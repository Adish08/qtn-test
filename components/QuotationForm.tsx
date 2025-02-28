// components/QuotationForm.tsx

import React, { useState, useEffect } from 'react';
import { Quotation, QuotationItem } from '../types';
import ItemRow from './ItemRow';
import Terms from './Terms';
import { generatePDF } from '../utils/pdf';

interface QuotationFormProps {
  username: string;
  onLogout: () => void;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ username, onLogout }) => {
  const [quotation, setQuotation] = useState<Quotation>({
    partyName: '',
    family: '',
    items: [],
    includeGst: false,
    notes: ''
  });

  const [families] = useState<string[]>([
    'Switches', 'MCB', 'Distribution Boards', 'Wires & Cables'
  ]);

  // Load saved quotation from localStorage
  useEffect(() => {
    const savedQuotation = localStorage.getItem('quotation');
    if (savedQuotation) {
      try {
        const parsedQuotation = JSON.parse(savedQuotation);
        setQuotation(parsedQuotation);
      } catch (error) {
        console.error('Error parsing saved quotation:', error);
      }
    }
  }, []);

  // Save quotation to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('quotation', JSON.stringify(quotation));
  }, [quotation]);

  const addItemRow = () => {
    const newItem: QuotationItem = {
      id: `item-${Date.now()}`,
      item: '',
      quantity: 1,
      price: 0,
      discount: 0,
      net: 0
    };
    
    setQuotation({
      ...quotation,
      items: [...quotation.items, newItem]
    });
  };

  const updateItem = (id: string, updatedItem: Partial<QuotationItem>) => {
    const updatedItems = quotation.items.map(item => {
      if (item.id === id) {
        return { ...item, ...updatedItem };
      }
      return item;
    });
    
    setQuotation({
      ...quotation,
      items: updatedItems
    });
  };

  const removeItem = (id: string) => {
    setQuotation({
      ...quotation,
      items: quotation.items.filter(item => item.id !== id)
    });
  };

  const calculateTotal = (): number => {
    return quotation.items.reduce((sum, item) => sum + item.net, 0);
  };

  const handleGeneratePdf = () => {
    generatePDF('quotationContainer', `${quotation.partyName || 'Quotation'}.pdf`);
  };

  const resetQuotation = () => {
    if (confirm('Are you sure you want to reset the quotation? All data will be lost.')) {
      setQuotation({
        partyName: '',
        family: '',
        items: [],
        includeGst: false,
        notes: ''
      });
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Legrand Quotation ~ Sagarawat Electricals</h1>
        <div className="text-sm">
          Logged in as <span className="font-semibold">{username}</span> | 
          <button 
            onClick={onLogout} 
            className="ml-2 text-blue-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      <div id="quotationContainer">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="partyName" className="block mb-1 font-medium">Party Name:</label>
            <input
              type="text"
              id="partyName"
              value={quotation.partyName}
              onChange={(e) => setQuotation({...quotation, partyName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label htmlFor="family" className="block mb-1 font-medium">Family:</label>
            <select
              id="family"
              value={quotation.family}
              onChange={(e) => setQuotation({...quotation, family: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Family</option>
              {families.map(family => (
                <option key={family} value={family}>{family}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">#</th>
                <th className="p-2 border text-left">Item</th>
                <th className="p-2 border text-left">Quantity</th>
                <th className="p-2 border text-right">Price</th>
                <th className="p-2 border text-left">Discount (%)</th>
                <th className="p-2 border text-right">Nett</th>
                <th className="p-2 border text-center no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <ItemRow
                  key={item.id}
                  index={index + 1}
                  item={item}
                  onUpdate={(updatedItem) => updateItem(item.id, updatedItem)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
              {quotation.items.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 border text-center text-gray-500">
                    No items added yet. Click "Add Item" to begin.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan={5} className="p-2 border text-right">Total:</td>
                <td className="p-2 border text-right">
                  {formatCurrency(calculateTotal())}
                </td>
                <td className="p-2 border no-print"></td>
              </tr>
              {quotation.includeGst && (
                <>
                  <tr>
                    <td colSpan={5} className="p-2 border text-right">GST (18%):</td>
                    <td className="p-2 border text-right">
                      {formatCurrency(calculateTotal() * 0.18)}
                    </td>
                    <td className="p-2 border no-print"></td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={5} className="p-2 border text-right">Grand Total:</td>
                    <td className="p-2 border text-right">
                      {formatCurrency(calculateTotal() * 1.18)}
                    </td>
                    <td className="p-2 border no-print"></td>
                  </tr>
                </>
              )}
            </tfoot>
          </table>
        </div>
        
        <Terms />
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quotation.includeGst}
                onChange={(e) => setQuotation({...quotation, includeGst: e.target.checked})}
                className="mr-2 h-4 w-4"
              />
              <span>Add GST</span>
            </label>
          </div>
          
          <div>
            <label htmlFor="notes" className="block mb-1 font-medium">Notes:</label>
            <textarea
              id="notes"
              value={quotation.notes}
              onChange={(e) => setQuotation({...quotation, notes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded h-24 resize-y"
              placeholder="Add any additional notes here..."
            ></textarea>
          </div>
        </div>
        
        <div className="md:w-1/3 flex flex-col gap-3 no-print">
          <button
            onClick={addItemRow}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Add Item
          </button>
          
          <button
            onClick={handleGeneratePdf}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Generate PDF
          </button>
          
          <button
            onClick={resetQuotation}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
          >
            Reset Quotation
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;
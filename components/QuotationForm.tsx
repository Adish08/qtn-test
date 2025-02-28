// components/QuotationForm.tsx

import React, { useState, useEffect } from 'react';
import { Quotation, QuotationItem } from '../types';
import ItemRow from './ItemRow';
import Terms from './Terms';
import { generatePDF } from '../utils/pdf';
import { 
  getAllFamilies, 
  getPriceForItemAndFamily,
  getDiscountForItemAndFamily, 
  calculateNet 
} from '../utils/inventory';

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

  // Initialize with an empty row
  useEffect(() => {
    if (quotation.items.length === 0) {
      addItemRow();
    }
  }, []);

  // Load saved quotation from localStorage
  useEffect(() => {
    const savedQuotation = localStorage.getItem('quotation');
    if (savedQuotation) {
      try {
        const parsedQuotation = JSON.parse(savedQuotation);
        // Ensure we have at least one row
        if (parsedQuotation.items.length === 0) {
          parsedQuotation.items = [createEmptyItem()];
        }
        setQuotation(parsedQuotation);
      } catch (error) {
        console.error('Error parsing saved quotation:', error);
        // Initialize with an empty row if there's an error
        setQuotation({
          partyName: '',
          family: '',
          items: [createEmptyItem()],
          includeGst: false,
          notes: ''
        });
      }
    }
  }, []);

  // Save quotation to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('quotation', JSON.stringify(quotation));
  }, [quotation]);

  // Create an empty item
  const createEmptyItem = (): QuotationItem => {
    return {
      id: `item-${Date.now()}`,
      item: '',
      quantity: 1,
      price: 0,
      discount: 0,
      net: 0
    };
  };

  // Add a new item row
  const addItemRow = () => {
    const newItem = createEmptyItem();
    
    setQuotation({
      ...quotation,
      items: [...quotation.items, newItem]
    });
  };

  // Update an item in the quotation
  const updateItem = (id: string, updatedItem: Partial<QuotationItem>) => {
    const updatedItems = quotation.items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updatedItem };
        
        // If family is selected and item name is updated, update price and discount
        if (quotation.family && updatedItem.item) {
          const price = getPriceForItemAndFamily(updatedItem.item, quotation.family);
          const discount = getDiscountForItemAndFamily(updatedItem.item, quotation.family);
          
          if (price > 0) {
            newItem.price = price;
          }
          
          if (discount > 0) {
            newItem.discount = discount;
          }
          
          // Recalculate net
          newItem.net = calculateNet(newItem.quantity, newItem.price, newItem.discount);
        }
        
        return newItem;
      }
      return item;
    });
    
    setQuotation({
      ...quotation,
      items: updatedItems
    });
  };

  // Remove an item from the quotation
  const removeItem = (id: string) => {
    const updatedItems = quotation.items.filter(item => item.id !== id);
    
    // If we're removing the last item, add an empty one
    if (updatedItems.length === 0) {
      updatedItems.push(createEmptyItem());
    }
    
    setQuotation({
      ...quotation,
      items: updatedItems
    });
  };

  // Handle family change
  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFamily = e.target.value;
    
    // Update all item prices and discounts based on the new family
    const updatedItems = quotation.items.map(item => {
      if (item.item) {
        const price = getPriceForItemAndFamily(item.item, selectedFamily);
        const discount = getDiscountForItemAndFamily(item.item, selectedFamily);
        
        if (price > 0) {
          item.price = price;
        }
        
        if (discount > 0) {
          item.discount = discount;
        }
        
        // Recalculate net
        item.net = calculateNet(item.quantity, item.price, item.discount);
      }
      return item;
    });
    
    setQuotation({
      ...quotation,
      family: selectedFamily,
      items: updatedItems
    });
  };

  // Calculate total
  const calculateTotal = (): number => {
    return quotation.items.reduce((sum, item) => sum + item.net, 0);
  };

  // Handle PDF generation
  const handleGeneratePdf = () => {
    generatePDF('quotationContainer', `${quotation.partyName || 'Quotation'}.pdf`);
  };

  // Reset quotation
  const resetQuotation = () => {
    if (confirm('Are you sure you want to reset the quotation? All data will be lost.')) {
      setQuotation({
        partyName: '',
        family: '',
        items: [createEmptyItem()],
        includeGst: false,
        notes: ''
      });
    }
  };

  // Format currency
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
            <label htmlFor="family" className="block mb-1 font-medium">Family/Variant:</label>
            <select
              id="family"
              value={quotation.family}
              onChange={handleFamilyChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Family/Variant</option>
              {getAllFamilies().map(family => (
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
                  onEnterKey={addItemRow}
                  family={quotation.family}
                  isLast={index === quotation.items.length - 1}
                />
              ))}
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
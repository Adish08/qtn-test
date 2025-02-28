// components/ItemRow.tsx

import React, { useState, useRef, useEffect } from 'react';
import { QuotationItem } from '../types';
import { getItemNames, calculateNet } from '../utils/inventory';

interface ItemRowProps {
  index: number;
  item: QuotationItem;
  onUpdate: (updatedItem: Partial<QuotationItem>) => void;
  onRemove: () => void;
  onEnterKey: () => void;
  family: string;
  isLast: boolean;
}

const ItemRow: React.FC<ItemRowProps> = ({ 
  index, 
  item, 
  onUpdate, 
  onRemove, 
  onEnterKey,
  family,
  isLast
}) => {
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set focus on input if this is the last row
  useEffect(() => {
    if (isLast && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLast]);

  // Handle item name input change
  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate({ item: value });
    
    // Filter available items based on input
    if (value.trim()) {
      const allItems = getItemNames();
      const filtered = allItems.filter(itemName => 
        itemName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredItems([]);
      setShowDropdown(false);
    }
  };

  // Select item from dropdown
  const selectItem = (selectedItem: string) => {
    onUpdate({ 
      item: selectedItem
    });
    setShowDropdown(false);
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 0;
    const net = calculateNet(quantity, item.price, item.discount);
    onUpdate({ quantity, net });
  };

  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value) || 0;
    const net = calculateNet(item.quantity, price, item.discount);
    onUpdate({ price, net });
  };

  // Handle discount change
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseFloat(e.target.value) || 0;
    const net = calculateNet(item.quantity, item.price, discount);
    onUpdate({ discount, net });
  };

  // Handle keydown events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnterKey();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <tr>
      <td className="p-2 border text-center">{index}</td>
      <td className="p-2 border relative">
        <input
          ref={inputRef}
          type="text"
          value={item.item}
          onChange={handleItemNameChange}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Type to search items..."
        />
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute z-10 left-0 mt-1 w-full bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto rounded-md"
          >
            {filteredItems.map((itemName) => (
              <div
                key={itemName}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectItem(itemName)}
              >
                {itemName}
              </div>
            ))}
          </div>
        )}
      </td>
      <td className="p-2 border">
        <input
          type="number"
          value={item.quantity || ''}
          onChange={handleQuantityChange}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="1"
          step="1"
        />
      </td>
      <td className="p-2 border text-right">
        <input
          type="number"
          value={item.price || ''}
          onChange={handlePriceChange}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
          min="0"
          step="0.01"
        />
      </td>
      <td className="p-2 border">
        <input
          type="number"
          value={item.discount || ''}
          onChange={handleDiscountChange}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="0"
          max="100"
          step="0.1"
        />
      </td>
      <td className="p-2 border text-right">
        ₹{item.net.toFixed(2)}
      </td>
      <td className="p-2 border no-print">
        <button
          onClick={onRemove}
          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
          aria-label="Remove item"
        >
          ×
        </button>
      </td>
    </tr>
  );
};

export default ItemRow;
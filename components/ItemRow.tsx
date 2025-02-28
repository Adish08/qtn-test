// components/ItemRow.tsx

import React from 'react';
import { QuotationItem } from '../types';

interface ItemRowProps {
  index: number;
  item: QuotationItem;
  onUpdate: (updatedItem: Partial<QuotationItem>) => void;
  onRemove: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ index, item, onUpdate, onRemove }) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 0;
    const net = calculateNet(quantity, item.price, item.discount);
    onUpdate({ quantity, net });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value) || 0;
    const net = calculateNet(item.quantity, price, item.discount);
    onUpdate({ price, net });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseFloat(e.target.value) || 0;
    const net = calculateNet(item.quantity, item.price, discount);
    onUpdate({ discount, net });
  };

  const calculateNet = (quantity: number, price: number, discount: number): number => {
    const discountedPrice = price * (1 - discount / 100);
    return quantity * discountedPrice;
  };

  return (
    <tr>
      <td className="p-2 border text-center">{index}</td>
      <td className="p-2 border">
        <input
          type="text"
          value={item.item}
          onChange={(e) => onUpdate({ item: e.target.value })}
          className="w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Item description"
        />
      </td>
      <td className="p-2 border">
        <input
          type="number"
          value={item.quantity || ''}
          onChange={handleQuantityChange}
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
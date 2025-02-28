// utils/inventory.ts

export interface InventoryItem {
  [variant: string]: {
    price: number;
    discount: number;
  };
}

export interface Inventory {
  [itemName: string]: InventoryItem;
}

// Full inventory data with price and standard discount per variant
export const inventory: Inventory = {
  "Switch 6A.1W": {
    "Britzy White- White Plate": { price: 46, discount: 5 },
    "Britzy White- Color Plate": { price: 46, discount: 5 },
    "Allzy White - White Plate": { price: 46, discount: 5 },
    "Allzy White - Black Plate": { price: 46, discount: 5 },
    "Allzy White - Metallic Plate": { price: 46, discount: 5 },
    "Allzy M Black - White Plate": { price: 51, discount: 5 },
    "Allzy M Black - M Black Plate": { price: 51, discount: 5 },
    "Allzy M Black - Metallic Plate": { price: 51, discount: 5 }
  },
  "Socket 6A": {
    "Britzy White- White Plate": { price: 120, discount: 7 },
    "Britzy White- Color Plate": { price: 120, discount: 7 },
    "Allzy White - White Plate": { price: 131, discount: 7 },
    "Allzy White - Black Plate": { price: 131, discount: 7 },
    "Allzy White - Metallic Plate": { price: 131, discount: 7 },
    "Allzy M Black - White Plate": { price: 150, discount: 7 },
    "Allzy M Black - M Black Plate": { price: 150, discount: 7 },
    "Allzy M Black - Metallic Plate": { price: 150, discount: 7 }
  },
  "Switch 16A.1W Ind": {
    "Britzy White- White Plate": { price: 162, discount: 8 },
    "Britzy White- Color Plate": { price: 162, discount: 8 },
    "Allzy White - White Plate": { price: 158, discount: 8 },
    "Allzy White - Black Plate": { price: 158, discount: 8 },
    "Allzy White - Metallic Plate": { price: 158, discount: 8 },
    "Allzy M Black - White Plate": { price: 180, discount: 8 },
    "Allzy M Black - M Black Plate": { price: 180, discount: 8 },
    "Allzy M Black - Metallic Plate": { price: 180, discount: 8 }
  },
  "Socket 16A": {
    "Britzy White- White Plate": { price: 208, discount: 10 },
    "Britzy White- Color Plate": { price: 208, discount: 10 },
    "Allzy White - White Plate": { price: 212, discount: 10 },
    "Allzy White - Black Plate": { price: 212, discount: 10 },
    "Allzy White - Metallic Plate": { price: 212, discount: 10 },
    "Allzy M Black - White Plate": { price: 230, discount: 10 },
    "Allzy M Black - M Black Plate": { price: 230, discount: 10 },
    "Allzy M Black - Metallic Plate": { price: 230, discount: 10 }
  }
};

// Get all available item names for dropdown
export const getItemNames = (): string[] => {
  return Object.keys(inventory);
};

// Get all available families/variants for a specific item
export const getFamiliesForItem = (itemName: string): string[] => {
  if (!inventory[itemName]) return [];
  return Object.keys(inventory[itemName]);
};

// Get all unique family/variant names across all items
export const getAllFamilies = (): string[] => {
  const families = new Set<string>();
  
  Object.values(inventory).forEach(item => {
    Object.keys(item).forEach(family => {
      families.add(family);
    });
  });
  
  return Array.from(families);
};

// Get price for a specific item and variant
export const getPriceForItemAndFamily = (itemName: string, family: string): number => {
  if (!inventory[itemName] || !inventory[itemName][family]) return 0;
  return inventory[itemName][family].price;
};

// Get discount for a specific item and variant
export const getDiscountForItemAndFamily = (itemName: string, family: string): number => {
  if (!inventory[itemName] || !inventory[itemName][family]) return 0;
  return inventory[itemName][family].discount;
};

// Calculate net amount after discount
export const calculateNet = (quantity: number, price: number, discount: number): number => {
  const discountedPrice = price * (1 - discount / 100);
  return quantity * discountedPrice;
};
// types/index.ts

export interface User {
    username: string;
    isLoggedIn: boolean;
  }
  
  export interface Credentials {
    username: string;
    password: string;
  }
  
  export interface QuotationItem {
    id: string;
    item: string;
    quantity: number;
    price: number;
    discount: number;
    net: number;
  }
  
  export interface Quotation {
    partyName: string;
    family: string;
    items: QuotationItem[];
    includeGst: boolean;
    notes?: string;
  }
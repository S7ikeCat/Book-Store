export interface OrderItem {
    _id: number;
    title: string;
    newPrice: number;
    category: string;
    quantity: number;
    coverImage?: string;
  }
  
  export interface ShippingInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  }
  
  export interface OrderData {
    id: number; // из базы Orders.id
    user_email: string;
    items: OrderItem[];
    total_price: string;
    shipping_info: ShippingInfo;
    created_at: string;
  }
  
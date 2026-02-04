export interface IUser {
    id: number;
    email: string;
    role: 'user' | 'admin';
  }

  export interface IOrder {
    id: number;
    createdAt: string;
    totalPrice: number;
    productIds: number[];
  }
  
  export interface IDashboardData {
    totalBooks: number;
    totalSales: number;
    trendingBooks: number;
    totalOrders: number;
  }
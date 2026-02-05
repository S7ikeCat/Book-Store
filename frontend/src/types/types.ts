export interface IUser {
  role_id: number;
  id: number;
  email: string;
  role: number;
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
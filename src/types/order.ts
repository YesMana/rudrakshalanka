export interface Order {
  id: string;
  productId: string;
  name: string;
  address: string;
  district: string;
  phone1: string;
  phone2?: string;
  paymentMethod: string;
  agreedToTerms?: boolean;
  status: 'Pending' | 'Verified' | 'Shipped' | 'Cancelled';
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  name: string;
  address: string;
  district: string;
  phone1: string;
  phone2?: string;
  paymentMethod: string;
  customerEmail?: string;
  wantsEmailUpdate?: boolean;
  agreedToTerms?: boolean;
  status: 'Pending' | 'Verified' | 'Shipped' | 'Cancelled';
  totalAmount?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  image: string; // Keep for backward compatibility
  images?: string[]; // Array of up to 5 images
  stock?: number; // Inventory tracking
  reviews?: Review[];
  createdAt?: string;
}

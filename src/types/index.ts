export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    originalPrice: number;
    price: number;
    category: any;
    images: string[];
    fabric: string;
    color: string;
    stock: number;
    isBestSeller: boolean;
    isNewArrival: boolean;
    createdAt: string;
    updatedAt: string;
  
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  mobile: string;
}

export interface AuthResponse {
  data: {
    id: string;
    email: string;
    name: string;
    mobile: string;
    token: string;
    refreshToken: string;
  };
}


export interface Address {
  id?: string; // Making id optional for new addresses
  _id?: string; // Assuming _id might also be used by the backend
  user?: string; // User ID associated with the address
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: 'Home' | 'Work';
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

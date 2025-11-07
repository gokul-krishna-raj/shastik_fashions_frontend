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
    category: string;
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
  token: string;
  data: {
    id: string;
    email: string;
    name: string;
    mobile: string;
  };
}

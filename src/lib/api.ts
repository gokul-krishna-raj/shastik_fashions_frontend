import axios from 'axios';
import { Address } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Unauthenticated API instance
export const unauthApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authenticated API instance with interceptors
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, redirecting to login...');
      // Optionally, redirect to login page or refresh token
      // Example: window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Address API Helper
const ADDRESS_API_URL = '/address';

export const getAddresses = async (): Promise<Address[]> => {
  const response = await api.get(ADDRESS_API_URL);
  return response.data.data || response.data; // Handle both data.data and direct array response
};

export const addAddress = async (payload: Omit<Address, 'id' | '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
  const response = await api.post(ADDRESS_API_URL, payload);
  return response.data;
};

export const updateAddress = async (id: string, payload: Partial<Address>): Promise<Address> => {
  const response = await api.put(`${ADDRESS_API_URL}/${id}`, payload);
  return response.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete(`${ADDRESS_API_URL}/${id}`);
};

// Razorpay API Helper
export const createPaymentOrder = async (amount: number, products: { product: string; quantity: number }[]): Promise<any> => {
  const response = await api.post('/payment/order', { amount, products });
  return response.data;
};

import { api } from './api';
import { Product } from '@/types';

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
  salesData?: Array<{ name: string; sales: number }>;
}

export interface AdminProduct {
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

export interface CreateProductPayload {
  name: string;
  description: string;
  originalPrice: number;
  price: number;
  category: string;
  fabric: string;
  color: string;
  stock: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
  images: File[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  _id: string;
}

export interface AdminOrder {
  _id: string;
  userId: string;
  products: Array<{
    product: Product | string;
    quantity: number;
  }>;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress?: any;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

// Admin Stats
export const fetchAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await api.get<{ data: AdminStats }>('/admin/stats');
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
  }
};

// Admin Products
export const fetchAdminProducts = async (page: number = 1, limit: number = 10): Promise<{
  products: AdminProduct[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const response = await api.get<{
      data: AdminProduct[];
      count: number;
      page: number;
      limit: number;
    }>(`/products?page=${page}&limit=${limit}`);
    return {
      products: response.data.data || [],
      total: response.data.count || 0,
      page: response.data.page || page,
      limit: response.data.limit || limit,
    };
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const createAdminProduct = async (payload: CreateProductPayload): Promise<AdminProduct> => {
  try {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    formData.append('originalPrice', payload.originalPrice.toString());
    formData.append('price', payload.price.toString());
    formData.append('category', payload.category);
    formData.append('fabric', payload.fabric);
    formData.append('color', payload.color);
    formData.append('stock', payload.stock.toString());
    formData.append('isBestSeller', payload.isBestSeller.toString());
    formData.append('isNewArrival', payload.isNewArrival.toString());

    payload.images.forEach((image, index) => {
      formData.append('images', image);
    });

    const response = await api.post<{ data: AdminProduct }>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateAdminProduct = async (payload: UpdateProductPayload): Promise<AdminProduct> => {
  try {
    const formData = new FormData();
    if (payload.name) formData.append('name', payload.name);
    if (payload.description) formData.append('description', payload.description);
    if (payload.originalPrice !== undefined) formData.append('originalPrice', payload.originalPrice.toString());
    if (payload.price !== undefined) formData.append('price', payload.price.toString());
    if (payload.category) formData.append('category', payload.category);
    if (payload.fabric) formData.append('fabric', payload.fabric);
    if (payload.color) formData.append('color', payload.color);
    if (payload.stock !== undefined) formData.append('stock', payload.stock.toString());
    if (payload.isBestSeller !== undefined) formData.append('isBestSeller', payload.isBestSeller.toString());
    if (payload.isNewArrival !== undefined) formData.append('isNewArrival', payload.isNewArrival.toString());

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.put<{ data: AdminProduct }>(`/products/${payload._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

export const deleteAdminProduct = async (productId: string): Promise<void> => {
  try {
    await api.delete(`/products/${productId}`);
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

// Admin Orders
export const fetchAdminOrders = async (): Promise<AdminOrder[]> => {
  try {
    const response = await api.get<{ data: AdminOrder[] }>('/orders/admin');
    return response.data.data || response.data || [];
  } catch (error: any) {
    console.error('Error fetching admin orders:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const updateOrderStatus = async (payload: UpdateOrderStatusPayload): Promise<AdminOrder> => {
  try {
    const response = await api.put<{ data: AdminOrder }>(`/orders/${payload.orderId}`, {
      status: payload.status,
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating order status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};


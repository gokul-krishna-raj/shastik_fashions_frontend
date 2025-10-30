
import { api } from './api';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export const createOrder = async (items: { productId: string; quantity: number }[]): Promise<Order> => {
  try {
    const response = await api.post<Order>('/orders', { items });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

/*
Example Usage:

// Create a new order
createOrder([
  { productId: 'prod1', quantity: 1 },
  { productId: 'prod2', quantity: 2 },
])
  .then(order => console.log('Order created:', order))
  .catch(error => console.error('Failed to create order:', error));

// Get all orders for the authenticated user
getOrders()
  .then(orders => console.log('Orders:', orders))
  .catch(error => console.error('Failed to get orders:', error));

// Get a specific order by ID
getOrderById('orderId789')
  .then(order => console.log('Order:', order))
  .catch(error => console.error('Failed to get order by ID:', error));
*/

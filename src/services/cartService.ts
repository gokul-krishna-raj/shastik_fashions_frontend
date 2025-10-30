
import { api } from './api';

interface CartItem {
  productId: string;
  quantity: number;
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export const getCart = async (): Promise<Cart> => {
  try {
    const response = await api.get<Cart>('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (productId: string, quantity: number): Promise<Cart> => {
  try {
    const response = await api.post<Cart>('/cart/add', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (productId: string, quantity: number): Promise<Cart> => {
  try {
    const response = await api.put<Cart>('/cart/update', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (productId: string): Promise<Cart> => {
  try {
    const response = await api.delete<Cart>(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

/*
Example Usage:

// Get user's cart
getCart()
  .then(cart => console.log('Cart:', cart))
  .catch(error => console.error('Failed to get cart:', error));

// Add item to cart
addToCart('productId123', 1)
  .then(cart => console.log('Item added to cart:', cart))
  .catch(error => console.error('Failed to add to cart:', error));

// Update item quantity in cart
updateCartItem('productId123', 2)
  .then(cart => console.log('Cart item updated:', cart))
  .catch(error => console.error('Failed to update cart item:', error));

// Remove item from cart
removeCartItem('productId123')
  .then(cart => console.log('Item removed from cart:', cart))
  .catch(error => console.error('Failed to remove cart item:', error));
*/

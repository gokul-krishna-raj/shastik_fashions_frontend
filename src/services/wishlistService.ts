
import { api } from './api';

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
}

interface Wishlist {
  id: string;
  userId: string;
  data: WishlistItem[];
}

export const getWishlist = async (): Promise<Wishlist> => {
  try {
    const response = await api.get<Wishlist>('/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const addToWishlist = async (productId: string): Promise<Wishlist> => {
  try {
    const response = await api.post<Wishlist>('/wishlist/add', { productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (productId: string): Promise<Wishlist> => {
  try {
    const response = await api.delete<Wishlist>(`/wishlist/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

/*
Example Usage:

// Get user's wishlist
getWishlist()
  .then(wishlist => console.log('Wishlist:', wishlist))
  .catch(error => console.error('Failed to get wishlist:', error));

// Add item to wishlist
addToWishlist('productId456')
  .then(wishlist => console.log('Item added to wishlist:', wishlist))
  .catch(error => console.error('Failed to add to wishlist:', error));

// Remove item from wishlist
removeFromWishlist('productId456')
  .then(wishlist => console.log('Item removed from wishlist:', wishlist))
  .catch(error => console.error('Failed to remove from wishlist:', error));
*/

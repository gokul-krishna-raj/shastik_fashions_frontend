
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistService from '@/services/wishlistService';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  altText: string;
}

interface WishlistState {
  data: WishlistItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WishlistState = {
  data: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch the wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      return response.data.map(item => ({
        id: item.productId, // Assuming productId is unique enough for UI key
        productId: item.productId,
        name: `Product ${item.productId}`, // Placeholder name
        price: item.price, // Placeholder price
        imageUrl: `https://via.placeholder.com/100x100?text=Product+${item.productId}`,
        altText: `Product ${item.productId}`,
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to add an item to the wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product: { productId: string; name: string; price: number; imageUrl: string; altText: string }, { dispatch, rejectWithValue }) => {
    try {
      // Optimistic update
      dispatch(wishlistSlice.actions.addItemOptimistic(product));
      await wishlistService.addToWishlist(product.productId);
      return product;
    } catch (error: any) {
      dispatch(wishlistSlice.actions.removeItemOptimistic(product.productId)); // Revert optimistic update
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to remove an item from the wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { wishlist: WishlistState };
    const originalItem = state.wishlist.items.find(item => item.productId === productId);
    if (!originalItem) return rejectWithValue('Item not found in wishlist');

    try {
      // Optimistic update
      dispatch(wishlistSlice.actions.removeItemOptimistic(productId));
      await wishlistService.removeFromWishlist(productId);
      return productId;
    } catch (error: any) {
      dispatch(wishlistSlice.actions.addItemOptimistic(originalItem)); // Revert
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItemOptimistic: (state, action: PayloadAction<Omit<WishlistItem, 'id'> & { productId: string }>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (!existingItem) {
        state.items.push({ ...action.payload, id: action.payload.productId });
      }
    },
    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add To Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Remove From Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromWishlist.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;


import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistService from '@/services/wishlistService';

import { Product } from '@/types';

interface WishlistState {
  data: [];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WishlistState = {
  data: [],
  status: 'idle',
  error: null,
};

import { getProductById } from '@/services/productService';

// Async thunk to fetch the wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      console.log("response 2=>", response);
      
      const wishlistItems = await Promise.all(
        response.data.map(async (item:any) => {
          const product = await getProductById(item.product._id);
          return product;
        })
      );
      return wishlistItems;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to add an item to the wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      await wishlistService.addToWishlist(productId);
      dispatch(fetchWishlist());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to remove an item from the wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      dispatch(fetchWishlist());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state:any, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
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

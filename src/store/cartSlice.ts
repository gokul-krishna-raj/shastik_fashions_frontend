
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from '@/services/cartService';

import { Product } from '@/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  data: CartItem[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  data: [],
  total: 0,
  status: 'idle',
  error: null,
};

import { getProductById } from '@/services/productService';

// Async thunk to fetch the cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response:any = await cartService.getCart();
      const cartItems = await Promise.all(
        response.data.map(async (item:any) => {
          const product = await getProductById(item.product._id);
          return { ...product, quantity: item.quantity };
        })
      );
      return cartItems;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to add an item to the cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      await cartService.addToCart(productId, 1);
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to update an item's quantity in the cart
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity }: { productId: string; quantity: number }, { dispatch, rejectWithValue }) => {
    try {
      await cartService.addToCart(productId, quantity);
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to remove an item from the cart
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      await cartService.removeCartItem(productId);
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.data = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add To Cart
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update Cart Item Quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItemQuantity.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Remove Cart Item
      .addCase(removeCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeCartItem.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

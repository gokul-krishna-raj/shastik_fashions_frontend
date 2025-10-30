
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from '@/services/cartService';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  altText: string;
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

// Async thunk to fetch the cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data.map(item => ({
        id: item.productId, // Assuming productId is unique enough for UI key
        productId: item.productId,
        name: `Product ${item.productId}`, // Placeholder name
        price: 100, // Placeholder price
        quantity: item.quantity,
        imageUrl: `https://via.placeholder.com/100x100?text=Product+${item.productId}`,
        altText: `Product ${item.productId}`,
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to add an item to the cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product: { productId: string; name: string; price: number; imageUrl: string; altText: string }, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { cart: CartState };
    const existingItem = state.cart.items.find(item => item.productId === product.productId);
    const quantityToAdd = existingItem ? existingItem.quantity + 1 : 1;

    try {
      // Optimistic update
      dispatch(cartSlice.actions.addItemOptimistic(product));
      await cartService.addToCart(product.productId, quantityToAdd);
      // No need to fetch cart again if optimistic update was correct
      return product;
    } catch (error: any) {
      dispatch(cartSlice.actions.removeItemOptimistic(product.productId)); // Revert optimistic update
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to update an item's quantity in the cart
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity }: { productId: string; quantity: number }, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { cart: CartState };
    const originalItem = state.cart.items.find(item => item.productId === productId);
    if (!originalItem) return rejectWithValue('Item not found in cart');

    try {
      // Optimistic update
      dispatch(cartSlice.actions.updateItemQuantityOptimistic({ productId, quantity }));
      await cartService.updateCartItem(productId, quantity);
      return { productId, quantity };
    } catch (error: any) {
      dispatch(cartSlice.actions.updateItemQuantityOptimistic({ productId, quantity: originalItem.quantity })); // Revert
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to remove an item from the cart
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (productId: string, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { cart: CartState };
    const originalItem = state.cart.items.find(item => item.productId === productId);
    if (!originalItem) return rejectWithValue('Item not found in cart');

    try {
      // Optimistic update
      dispatch(cartSlice.actions.removeItemOptimistic(productId));
      await cartService.removeCartItem(productId);
      return productId;
    } catch (error: any) {
      dispatch(cartSlice.actions.addItemOptimistic(originalItem)); // Revert
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemOptimistic: (state, action: PayloadAction<Omit<CartItem, 'quantity' | 'id'> & { productId: string }>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...action.payload, id: action.payload.productId, quantity: 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    updateItemQuantityOptimistic: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
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
        state.items = action.payload;
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

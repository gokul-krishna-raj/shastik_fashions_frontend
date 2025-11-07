import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchProducts as searchProductsApi } from '@/services/productService';
import { Product } from '@/types';

interface SearchState {
  results: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  status: 'idle',
  error: null,
};

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (query: string, { rejectWithValue }) => {
    if (!query) {
      return [];
    }
    try {
      const response = await searchProductsApi(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to search products');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to search products';
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SareeFilters } from '@/types/filters';
import { getProducts, getProductById } from '@/services/productService';

import { Product } from '@/types';

interface ProductsState {
  items: Product[];
  currentProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: SareeFilters;
  sort: string;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

const initialState: ProductsState = {
  items: [],
  currentProduct: null,
  status: 'idle',
  error: null,
  filters: {
    category: [],
    priceRange: [500, 20000],
    fabric: [],
    color: [],
  },
  sort: 'newest',
  page: 1,
  limit: 12,
  totalPages: 1,
  hasMore: true,
};

interface FetchProductsArgs {
  page?: number;
  limit?: number;
  filters?: SareeFilters;
  sort?: string;
  append?: boolean;
  type?: 'all' | 'new-arrivals' | 'best-sellers';
  categoryId?: string;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    {
      page = 1,
      limit = 12,
      filters = initialState.filters,
      sort = initialState.sort,
      append = false,
      type = 'all',
      categoryId
    }: FetchProductsArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await getProducts(page, limit, categoryId, filters, sort);
      return {
        products: response.products,
        page: response.page,
        totalPages: Math.ceil(response.total / response.limit),
        hasMore: response.page < Math.ceil(response.total / response.limit),
        append,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getProductById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch product details');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<SareeFilters>) => {
      state.filters = action.payload;
      state.page = 1;
      state.items = [];
      state.hasMore = true;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
      state.page = 1;
      state.items = [];
      state.hasMore = true;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetProducts: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.status = 'idle';
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ products: Product[]; page: number; totalPages: number; hasMore: boolean; append: boolean }>) => {
        state.status = 'succeeded';
        if (action.payload.append) {
          state.items = [...state.items, ...action.payload.products];
        } else {
          state.items = action.payload.products;
        }
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch products';
        state.hasMore = false;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch product details';
        state.currentProduct = null;
      });
  },
});

export const { setFilters, setSort, setPage, resetProducts, setCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
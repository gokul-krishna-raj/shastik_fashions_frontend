
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  altText: string;
  category: string;
  fabric: string;
  color: string;
  stock: number;
  images: string[]; // For image gallery
}

interface ProductsState {
  items: Product[];
  currentProduct: Product | null; // New field for single product details
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    category: string;
    priceRange: [number, number];
    fabric: string;
    color: string;
  };
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
    category: '',
    priceRange: [0, 1000],
    fabric: '',
    color: '',
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
  filters?: ProductsState['filters'];
  sort?: string;
  append?: boolean; // New argument to indicate whether to append or replace
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 12, filters = initialState.filters, sort = initialState.sort, append = false }: FetchProductsArgs) => {
    // TODO: Implement API call to fetch products with filters and pagination
    console.log('Fetching products with:', { page, limit, filters, sort });

    // Mock API response
    const allMockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `Product ${i + 1}`,
      description: `This is a detailed description for Product ${i + 1}. It is made of high-quality materials and offers great value.`,
      price: parseFloat((Math.random() * (1000 - 10) + 10).toFixed(2)),
      imageUrl: `https://via.placeholder.com/300x200/FFDDC1/333333?text=Product+${i + 1}`,
      altText: `Product ${i + 1}`,
      category: ['Electronics', 'Apparel', 'Home Goods', 'Books'][Math.floor(Math.random() * 4)],
      fabric: ['Cotton', 'Polyester', 'Wool', 'Silk'][Math.floor(Math.random() * 4)],
      color: ['Red', 'Blue', 'Green', 'Black', 'White'][Math.floor(Math.random() * 5)],
      stock: Math.floor(Math.random() * 100) + 1,
      images: [
        `https://via.placeholder.com/600x400/FFDDC1/333333?text=Product+${i + 1}+Image+1`,
        `https://via.placeholder.com/600x400/B0E0E6/333333?text=Product+${i + 1}+Image+2`,
        `https://via.placeholder.com/600x400/DDA0DD/333333?text=Product+${i + 1}+Image+3`,
      ],
    }));

    // Apply filters
    let filteredProducts = allMockProducts.filter(product => {
      let match = true;
      if (filters.category && product.category !== filters.category) {
        match = false;
      }
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        match = false;
      }
      if (filters.fabric && product.fabric !== filters.fabric) {
        match = false;
      }
      if (filters.color && product.color !== filters.color) {
        match = false;
      }
      return match;
    });

    // Apply sorting
    filteredProducts.sort((a, b) => {
      if (sort === 'price_asc') {
        return a.price - b.price;
      } else if (sort === 'price_desc') {
        return b.price - a.price;
      } else if (sort === 'name_asc') {
        return a.name.localeCompare(b.name);
      } else if (sort === 'name_desc') {
        return b.name.localeCompare(a.name);
      }
      return 0; // newest or default
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = filteredProducts.slice(start, end);

    const totalPages = Math.ceil(filteredProducts.length / limit);

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    return {
      products: paginatedProducts,
      page,
      totalPages,
      hasMore: page < totalPages,
      append,
    };
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string) => {
    // TODO: Implement API call to fetch a single product by ID
    console.log('Fetching product by ID:', id);

    // Mock API response for a single product
    const mockProduct: Product = {
      id: id,
      name: `Product ${id}`,
      description: `This is a detailed description for Product ${id}. It is made of high-quality materials and offers great value. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      price: parseFloat((Math.random() * (1000 - 10) + 10).toFixed(2)),
      imageUrl: `https://via.placeholder.com/600x400/FFDDC1/333333?text=Product+${id}+Image+1`,
      altText: `Product ${id}`,
      category: ['Electronics', 'Apparel', 'Home Goods', 'Books'][Math.floor(Math.random() * 4)],
      fabric: ['Cotton', 'Polyester', 'Wool', 'Silk'][Math.floor(Math.random() * 4)],
      color: ['Red', 'Blue', 'Green', 'Black', 'White'][Math.floor(Math.random() * 5)],
      stock: Math.floor(Math.random() * 100) + 1,
      images: [
        `https://via.placeholder.com/600x400/FFDDC1/333333?text=Product+${id}+Image+1`,
        `https://via.placeholder.com/600x400/B0E0E6/333333?text=Product+${id}+Image+2`,
        `https://via.placeholder.com/600x400/DDA0DD/333333?text=Product+${id}+Image+3`,
      ],
    };

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    return mockProduct;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductsState['filters']>) => {
      state.filters = action.payload;
      state.page = 1; // Reset page when filters change
      state.items = []; // Clear items when filters change
      state.hasMore = true; // Assume more data when filters change
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
      state.page = 1; // Reset page when sort changes
      state.items = []; // Clear items when sort changes
      state.hasMore = true; // Assume more data when sort changes
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
        state.error = action.error.message || 'Failed to fetch products';
        state.hasMore = false;
      })
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
        state.error = action.error.message || 'Failed to fetch product details';
        state.currentProduct = null;
      });
  },
});

export const { setFilters, setSort, setPage, resetProducts, setCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;

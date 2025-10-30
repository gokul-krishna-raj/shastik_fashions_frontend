import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SareeFilters } from '@/types/filters';
import { getProducts } from '@/services/productService';

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
  images: string[];
}

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
    console.log('Fetching products with:', { page, limit, filters, sort, type, categoryId });

    try {
      const response = await getProducts(page, limit, categoryId);

      // Mock data for now
      const allMockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
        id: `product-${i + 1}`,
        name: `Product ${i + 1}`,
        description: `This is a detailed description for Product ${i + 1}. It is made of high-quality materials and offers great value.`,
        price: parseFloat((Math.random() * (20000 - 500) + 500).toFixed(2)),
        imageUrl: `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
        altText: `Product ${i + 1}`,
        category: ['Silk Sarees', 'Cotton Sarees', 'Organza Sarees', 'Banarasi Sarees', 'Kanchipuram Sarees', 'Linen Sarees', 'Designer Sarees'][Math.floor(Math.random() * 7)],
        fabric: ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Crepe', 'Satin', 'Organza'][Math.floor(Math.random() * 7)],
        color: ['Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Black', 'White', 'Gold', 'Maroon', 'Purple'][Math.floor(Math.random() * 10)],
        stock: Math.floor(Math.random() * 100) + 1,
        images: [
          `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
          `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
          `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
        ],
      }));

      let productsToFilter = allMockProducts;

      // Apply type filter
      if (type === 'new-arrivals') {
        productsToFilter = allMockProducts.filter(product => parseInt(product.id.split('-')[1]) % 2 === 0);
      } else if (type === 'best-sellers') {
        productsToFilter = allMockProducts.filter(product => parseInt(product.id.split('-')[1]) % 2 !== 0);
      }

      // Apply filters
      let filteredProducts = productsToFilter.filter(product => {
        let match = true;
        if (filters.category.length > 0 && !filters.category.includes(product.category)) {
          match = false;
        }
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
          match = false;
        }
        if (filters.fabric.length > 0 && !filters.fabric.includes(product.fabric)) {
          match = false;
        }
        if (filters.color.length > 0 && !filters.color.includes(product.color)) {
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
        return 0;
      });

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedProducts = filteredProducts.slice(start, end);

      const totalPages = Math.ceil(filteredProducts.length / limit);

      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        products: paginatedProducts,
        page,
        totalPages,
        hasMore: page < totalPages,
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
      console.log('Fetching product by ID:', id);

      const mockProduct: Product = {
        id: id,
        name: `Product ${id}`,
        description: `This is a detailed description for Product ${id}. It is made of high-quality materials and offers great value. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        price: parseFloat((Math.random() * (20000 - 500) + 500).toFixed(2)),
        imageUrl: `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
        altText: `Product ${id}`,
        category: ['Silk Sarees', 'Cotton Sarees', 'Organza Sarees', 'Banarasi Sarees'][Math.floor(Math.random() * 4)],
        fabric: ['Silk', 'Cotton', 'Georgette', 'Chiffon'][Math.floor(Math.random() * 4)],
        color: ['Red', 'Blue', 'Green', 'Pink'][Math.floor(Math.random() * 4)],
        stock: Math.floor(Math.random() * 100) + 1,
        images: [
          `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
          `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
          `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
        ],
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      return mockProduct;
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
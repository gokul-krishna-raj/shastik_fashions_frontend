
import { api, unauthApi } from './api';

import { Product, SareeFilters } from '@/types';

interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export const getProducts = async (page: number = 1, limit: number = 10, categoryId?: string, filters?: SareeFilters, sort?: string): Promise<GetProductsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (categoryId) {
      params.append('categorySlug', categoryId);
    }
    if (filters) {
      if (filters.category && filters.category.length > 0) {
        params.append('categories', filters.category.join(','));
      }
      if (filters.color && filters.color.length > 0) {
        params.append('colors', filters.color.join(','));
      }
      if (filters.fabric && filters.fabric.length > 0) {
        params.append('fabrics', filters.fabric.join(','));
      }
      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange[0].toString());
        params.append('maxPrice', filters.priceRange[1].toString());
      }
    }
    if (sort) {
      params.append('sort', sort);
    }
    const response = await unauthApi.get<{ success: boolean; message: string; data: Product[]; count: number; page: number; pages: number; limit: number }>(`/products?${params.toString()}`);
    return {
      products: response.data.data,
      total: response.data.count,
      page: response.data.page,
      limit: response.data.limit,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try { 
    const response:any = await unauthApi.get<Product>(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const getBestSellers = async (): Promise<Product[]> => {
  try {
    const response = await unauthApi.get<{ data: Product[] }>('/products/best-sellers');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    throw error;
  }
};

export const getNewArrivals = async (): Promise<Product[]> => {
  try {
    const response = await unauthApi.get<{ data: Product[] }>('/products/new-arrivals');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await unauthApi.get<{ data: Product[] }>(`/products?search=${query}`);
    return response.data.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/*
Example Usage:

// Get all products
getProducts(1, 10)
  .then(data => console.log('Products:', data.products))
  .catch(error => console.error('Failed to get products:', error));

// Get product by ID
getProductById('someProductId')
  .then(product => console.log('Product:', product))
  .catch(error => console.error('Failed to get product by ID:', error));
*/

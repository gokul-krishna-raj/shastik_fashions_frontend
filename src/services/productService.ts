
import { api, unauthApi } from './api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export const getProducts = async (page: number = 1, limit: number = 10): Promise<GetProductsResponse> => {
  try {
    const response = await unauthApi.get<GetProductsResponse>(`/products?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await unauthApi.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
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

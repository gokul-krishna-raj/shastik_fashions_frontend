import { unauthApi } from './api';
import { Category } from '@/types';

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await unauthApi.get<{ success: boolean; message: string; data: Category[] }>('/categories');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

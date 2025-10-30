import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

const API_URL = "http://localhost:5000/api/categories";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<{ success: boolean; message: string; data: Category[] }>(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

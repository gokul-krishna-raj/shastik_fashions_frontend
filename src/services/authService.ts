
import { unauthApi } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await unauthApi.post<AuthResponse>('/auth/login', credentials);
    // Optionally, save token to localStorage or Redux store here
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await unauthApi.post<AuthResponse>('/auth/register', credentials);
    // Optionally, save token to localStorage or Redux store here
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/*
Example Usage:

// Login a user
login({ email: 'test@example.com', password: 'password123' })
  .then(data => console.log('Login successful:', data.user))
  .catch(error => console.error('Login failed:', error));

// Register a new user
register({ name: 'John Doe', email: 'john@example.com', password: 'password123' })
  .then(data => console.log('Registration successful:', data.user))
  .catch(error => console.error('Registration failed:', error));
*/

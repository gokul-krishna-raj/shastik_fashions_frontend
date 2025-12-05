import axios from 'axios';
import { refreshToken as refreshTokenApi } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Unauthenticated API instance
export const unauthApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authenticated API instance with interceptors
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const { store } = require('../store');
    const token = store.getState().user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("err=>",error);
    
    const originalRequest = error.config;
    if (error.response.status === 401 && error.response.data.message === 'Token expired' && !originalRequest._retry) {
      originalRequest._retry = true;
      const { store } = require('../store');
      const { updateAccessToken, clearAuthData } = require('../store/userSlice');
      const refreshToken = store.getState().user.refreshToken;
      console.log("refreshToken=>",refreshToken);
      console.log("store.getState()=>",store.getState());
      
      if (refreshToken) {
        try {
          const res:any = await refreshTokenApi(refreshToken);
          console.log("token =>",res.data.token);
          store.dispatch(updateAccessToken(res.data.token));
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(clearAuthData());
          return Promise.reject(refreshError);
        }
      } else {
        store.dispatch(clearAuthData());
      }
    }
    return Promise.reject(error);
  }
);

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '@/services/authService';
import { getLocalStorageItem, getParsedLocalStorageItem } from '../lib/utils';

import { User } from '@/types';

interface UserState {
  token: string | null;
  profile: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  token: getLocalStorageItem('authToken'),
  profile: getParsedLocalStorageItem('userProfile'),
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userProfile', JSON.stringify(response.data));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (credentials: { name: string; email: string; mobile: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userProfile', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.profile = action.payload.user;
      state.status = 'succeeded';
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('userProfile', JSON.stringify(action.payload.user));
    },
    clearAuthData: (state) => {
      state.token = null;
      state.profile = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; data: User }>) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.profile = action.payload.data;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.token = null;
        state.profile = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.profile = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.token = null;
        state.profile = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');
      });
  },
});

export const { setAuthData, clearAuthData } = userSlice.actions;
export default userSlice.reducer;

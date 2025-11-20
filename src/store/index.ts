import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import wishlistReducer from './wishlistSlice';
import categoryReducer from './categorySlice';
import homeReducer from './homeSlice';
import searchReducer from './searchSlice';
import productDetailsReducer from './productDetailsSlice';
import addressReducer from './addressSlice'; // Import addressReducer
import orderConfirmationReducer from './orderConfirmationSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    categories: categoryReducer,
    home: homeReducer,
    search: searchReducer,
    productDetails: productDetailsReducer,
    address: addressReducer, // Add addressReducer to the store
    orderConfirmation: orderConfirmationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

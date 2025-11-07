import React, { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCart, updateCartItemQuantity, removeCartItem } from '@/store/cartSlice';
import { useRouter } from 'next/router';
import { Trash2 } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const CartPage = () => {
  useAuth(); // Protect this page

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data: cartItems, total, status, error } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateCartItemQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  if (status === 'loading' && cartItems.length === 0) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <NextSeo
        title="Your Shopping Cart | Shastik Fashions"
        description="Review and manage items in your shopping cart."
      />
      <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1> */}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-primary px-6 py-3 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Continue shopping"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item:any) => (
                <div key={item._id} className="flex items-center border-b py-4">
                  <div className="relative w-24 h-24 flex-shrink-0 mr-4">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </button>
                      <span className="bg-gray-100 px-4 py-1 text-center" aria-live="polite" aria-atomic="true">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="ml-4 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between text-lg mb-2">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#8A1538] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
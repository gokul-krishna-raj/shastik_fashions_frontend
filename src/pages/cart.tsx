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

  // ✅ Handle quantity change with validation
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
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

  // ✅ Calculate subtotal dynamically in case backend total not updated
  const calculatedSubtotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <NextSeo
        title="Your Shopping Cart | Shastik Fashions"
        description="Review and manage items in your shopping cart."
      />

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="w-10 h-10 text-rose-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-500 mb-8 max-w-sm">
                Looks like you haven&apos;t added any items to your cart yet. Explore our collection to find something you love.
              </p>
              <button
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-6">
                {cartItems.map((item: any) => (
                  <div
                    key={item._id}
                    className="group relative flex flex-col sm:flex-row items-center sm:items-start p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all gap-6"
                  >
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 aspect-[3/4] sm:aspect-square flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 w-full text-center sm:text-left flex flex-col justify-between min-h-[128px]">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-lg font-bold text-rose-600 whitespace-nowrap">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Unit Price: ₹{item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-rose-600 transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-rose-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={16} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-lg lg:sticky lg:top-24">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-900">₹{calculatedSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-medium">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-rose-600">₹{calculatedSubtotal.toFixed(2)}</span>
                        <p className="text-xs text-slate-400 mt-1">Including all taxes</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="mt-6 flex justify-center">
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure Checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;

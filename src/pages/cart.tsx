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

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-[#8A1538] text-white px-6 py-3 rounded-md hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8A1538] focus:ring-offset-2"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cartItems.map((item: any) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center border-b py-4"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">₹{item.price.toFixed(2)}</p>

                    <div className="flex justify-center sm:justify-start items-center mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </button>
                      <span className="bg-gray-100 px-4 py-1 text-center w-10">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>

                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="ml-4 text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="text-lg font-semibold mt-2 sm:mt-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="flex justify-between text-lg mb-2">
                <span>Subtotal:</span>
                <span>₹{calculatedSubtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total:</span>
                <span>₹{calculatedSubtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#8A1538] text-white px-6 py-3 rounded-md text-lg font-semibold hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8A1538] focus:ring-offset-2"
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

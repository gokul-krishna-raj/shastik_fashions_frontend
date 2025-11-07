import React, { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCart, clearCart } from '@/store/cartSlice';
import { createOrder } from '@/services/orderService';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';

interface FormData {
  name: string;
  phone: string;
  address: string;
  pincode: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Full Name is required'),
  phone: yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone Number is required'),
  address: yup.string().required('Address is required'),
  pincode: yup.string().matches(/^\d{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
});

const CheckoutPage = () => {
  useAuth(); // Protect this page

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: cartItems, total, status: cartStatus } = useSelector((state: RootState) => state.cart);
  const [isProcessingOrder, setIsProcessingOrder] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [dispatch, cartStatus]);

  const onSubmit = async (data: FormData) => {
    if (cartItems?.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsProcessingOrder(true);
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      const order = await createOrder(orderItems);
      console.log('Order created:', order);

      // TODO: Integrate Razorpay here
      /*
        // Example Razorpay integration flow:
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total * 100, // Razorpay expects amount in paisa
            currency: 'INR',
            receipt: order.id,
          }),
        });
        const orderData = await response.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 means 50000 paise or ₹500.
          currency: orderData.currency,
          name: "Shastik Fashions",
          description: "Transaction for Order " + order.id,
          order_id: orderData.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: function (response: any) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            // Verify payment on your backend
            // fetch('/api/payment/verify', { method: 'POST', body: JSON.stringify({ ...response, orderId: order.id }) });
            dispatch(clearCart());
            router.push('/order-success');
          },
          prefill: {
            name: data.name,
            contact: data.phone,
          },
          notes: {
            address: data.address,
            pincode: data.pincode,
          },
          theme: {
            color: "#a0522d"
          }
        };
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
        rzp1.on('payment.failed', function (response: any) {
          alert("Payment Failed: " + response.error.code + " - " + response.error.description);
        });
      */

      dispatch(clearCart());
      router.push('/order-success'); // Redirect to a success page after order creation
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <>
      <NextSeo
        title="Checkout | Shastik Fashions"
        description="Complete your purchase on Shastik Fashions."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  id="address"
                  {...register('address')}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                ></textarea>
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  {...register('pincode')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={isProcessingOrder || cartStatus === 'loading' || cartItems?.length === 0}
                aria-label="Place order and proceed to payment"
              >
                {isProcessingOrder ? 'Processing...' : 'Place Order & Pay'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {cartItems?.length === 0 ? (
              <p className="text-gray-600">No items in cart.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {cartItems?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
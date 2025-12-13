'use client';

import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '@/layouts/MainLayout';
import CheckoutAddressSelector from '@/components/address/CheckoutAddressSelector';
import { ShieldCheck, Truck, CreditCard, Lock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { Address } from '@/types';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import { fetchAddresses } from '@/store/addressSlice';
import { createOrder } from '@/services/orderService'; // Import createOrder
import axios from 'axios';
import { createPaymentOrder } from '@/lib/api'; // Import the new backend function

// Define shipping charges based on state
const SHIPPING_CHARGES_BY_STATE: { [key: string]: number } = {
  "Tamil Nadu": 40,
  "Kerala": 50,
  "Karnataka": 60,
  "Andhra Pradesh": 55,
  "Telangana": 55,
  // Add more states as needed
};

const DEFAULT_SHIPPING_CHARGE = 80; // Default for states not listed

// Placeholder for Razorpay Key ID - IMPORTANT: Replace 'rzp_test_YOUR_KEY_ID' with your actual Razorpay test key from environment variables or directly.
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, selectedAddressId, status, error } = useSelector((state: RootState) => state.address);
  const cartItems = useSelector((state: RootState) => state.cart.data); // Assuming cart data is here
  const user = useSelector((state: RootState) => state.user.profile); // User profile data
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId || addr._id === selectedAddressId);

  // Calculate product subtotal
  const productSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Fetch addresses on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAddresses());
    }
  }, [status, dispatch]);

  // Handle error toasts for address fetching
  useEffect(() => {
    if (status === 'failed' && error) {
      toast({
        title: 'Error',
        description: error || 'Failed to load addresses for checkout.',
        variant: 'destructive',
      });
    }
  }, [status, error, toast]);

  // Function to fetch state from pincode API
  const fetchStateFromPincode = useCallback(async (pincode: string) => {
    setPincodeStatus('loading');
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data && response.data[0] && response.data[0].Status === 'Success') {
        const state = response.data[0].PostOffice[0].State;
        setPincodeStatus('succeeded');
        return state;
      } else {
        setPincodeStatus('failed');
        toast({
          title: 'Error',
          description: 'Could not find state for the given pincode.',
          variant: 'destructive',
        });
        return null;
      }
    } catch (err) {
      setPincodeStatus('failed');
      toast({
        title: 'Error',
        description: 'Failed to fetch pincode details.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  // Calculate shipping charge when selected address changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (selectedAddress && selectedAddress.pincode) {
        const state = await fetchStateFromPincode(selectedAddress.pincode);
        if (state) {
          setShippingCharge(SHIPPING_CHARGES_BY_STATE[state] || DEFAULT_SHIPPING_CHARGE);
        } else {
          setShippingCharge(DEFAULT_SHIPPING_CHARGE); // Fallback if state not found
        }
      } else {
        setShippingCharge(0); // No address selected or no pincode
      }
    };
    calculateShipping();
  }, [selectedAddress, fetchStateFromPincode]);

  const totalAmount = productSubtotal + shippingCharge;

  // Load Razorpay SDK script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  // ... (rest of the file)

  const displayRazorpay = useCallback(async (orderId: string) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Number((totalAmount * 100).toFixed(0)), // amount in smallest currency unit (paise), ensure it's a number
      currency: 'INR',
      name: 'Shastik Fashions',
      description: 'Order Payment',
      image: '/Images/shastik_fahsion_logo_new.png', // Your company logo
      order_id: orderId,
      handler: async function (response: any) {
        try {
          // Construct the order payload
          const orderPayload: any = {
            products: cartItems.map((item: any) => ({
              product: item._id,
              quantity: item.quantity,
            })),
            totalAmount: totalAmount,
            paymentStatus: 'paid',
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            shippingAddress: selectedAddressId,
          };

          // Call your backend to create the order
          const createdOrder: any = await createOrder(orderPayload);

          toast({
            title: 'Payment Successful',
            description: `Order ID: ${createdOrder.id || createdOrder.id}`,
          });
          const orderId = createdOrder.data?.orderId || createdOrder.orderId || createdOrder.id;
          router.push(`/order-confirmation?orderId=${orderId}`);
        } catch (err: any) {
          console.error('Error creating order after payment:', err);
          toast({
            title: 'Order Creation Failed',
            description: err.message || 'Failed to create order after successful payment.',
            variant: 'destructive',
          });
        } finally {
          setIsProcessingPayment(false);
        }
      },
      prefill: {
        name: user?.name || selectedAddress?.fullName || '',
        email: user?.email || selectedAddress?.email || '',
        contact: selectedAddress?.phone || '',
      },
      notes: {
        address: selectedAddress?.addressLine1,
        orderId: orderId,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on('payment.failed', function (response: any) {
      console.error('Razorpay Payment Failed:', response);

      toast({
        title: 'Payment Failed',
        description: response.error.description || 'Something went wrong with payment.',
        variant: 'destructive',
      });
      setIsProcessingPayment(false);
    });
    paymentObject.open();
  }, [totalAmount, selectedAddress, user, router, toast, cartItems, selectedAddressId]);


  // ... (imports and component setup)

  // ... (inside CheckoutPage component)

  const handleConfirmOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: 'Error',
        description: 'Please select an address to confirm your order.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessingPayment(true);


    try {
      // Step 1: Create order on your backend
      const products = cartItems.map(item => ({
        product: item._id, // Ensure this is the correct product ID field
        quantity: item.quantity,
      }));

      const orderResponse = await createPaymentOrder(totalAmount, products);

      if (orderResponse && orderResponse.orderId) {
        // Step 2: Open Razorpay checkout
        await displayRazorpay(orderResponse.orderId);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create Razorpay order.',
          variant: 'destructive',
        });
        setIsProcessingPayment(false);
      }
    } catch (err) {
      console.error('Error during order confirmation:', err);
      toast({
        title: 'Error',
        description: 'An error occurred during order processing.',
        variant: 'destructive',
      });
      setIsProcessingPayment(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Address & Payment Info */}
            <div className="lg:col-span-8 space-y-8">

              {/* Shipping Address Section */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <Truck size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Shipping Information</h2>
                </div>
                <CheckoutAddressSelector />
              </div>

              {/* Payment Method Section (Informational) */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                </div>

                <div className="flex items-center gap-4 p-4 border border-rose-100 bg-rose-50/30 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center overflow-hidden">
                    <span className="font-bold text-[10px] text-indigo-900 tracking-tighter">Razorpay</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Secure Online Payment</p>
                    <p className="text-xs sm:text-sm text-slate-500">Cards, UPI, Netbanking, Wallets</p>
                  </div>
                  <ShieldCheck className="ml-auto text-emerald-500 flex-shrink-0" size={20} />
                </div>
                <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                  <Lock size={12} />
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-lg lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                {/* Shipping Details Summary */}
                {selectedAddress ? (
                  <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shipping To</h3>
                    <p className="font-semibold text-slate-900">{selectedAddress.fullName}</p>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {selectedAddress.addressLine1}
                      {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-slate-600">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-medium text-slate-500">Phone:</span> {selectedAddress.phone}
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm">
                    Please select a delivery address to proceed.
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">Rs. {productSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className={pincodeStatus === 'loading' ? 'text-amber-500' : 'font-medium text-slate-900'}>
                      {pincodeStatus === 'loading' ? 'Calculating...' : `Rs. ${shippingCharge.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-rose-600">Rs. {totalAmount.toFixed(2)}</span>
                      <p className="text-xs text-slate-400 mt-1">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  disabled={!selectedAddressId || pincodeStatus === 'loading' || isProcessingPayment}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>Confirm Order</span>
                      <ShieldCheck size={18} className="opacity-80" />
                    </>
                  )}
                </button>

                <div className="mt-6 flex justify-center">
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Lock size={12} />
                    Secured by Razorpay
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

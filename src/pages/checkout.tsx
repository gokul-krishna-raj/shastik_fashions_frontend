'use client';

import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '@/layouts/MainLayout';
import CheckoutAddressSelector from '@/components/address/CheckoutAddressSelector';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { Address } from '@/types';
import { useRouter } from 'next/navigation';
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
  const user = useSelector((state: RootState) => state.user.user); // Assuming user data is here
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
        console.log('Razorpay Payment Response:', response);
        try {
          console.log("cartItems =>", cartItems);
          
          // Construct the order payload
          const orderPayload:any = {
            products: cartItems.map(item => ({
              product: item._id, // Assuming item.productId exists
              quantity: item.quantity,
            })),
            totalAmount: totalAmount,
            paymentStatus: 'paid',
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            shippingAddress: selectedAddressId, // Pass the selected address ID
            // Add other relevant order details like user ID if available
          };

          // Call your backend to create the order
          const createdOrder:any = await createOrder(orderPayload);
          console.log('Order created successfully:', createdOrder);
          toast({
            title: 'Payment Successful',
            description: `Order ID: ${createdOrder.id || createdOrder.id}`,
          });
          router.push(`/order-confirmation?orderId=${createdOrder.data.orderId || createdOrder.orderId}`);
        } catch (err: any) {
          console.error('Error creating order after payment:', err);
          toast({
            title: 'Order Creation Failed',
            description: err.message || 'Failed to create order after successful payment.',
            variant: 'destructive',
          });
          // Optionally, you might want to refund the payment if order creation fails
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
  }, [totalAmount, selectedAddress, user, router, toast]);


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
     console.log("cartItems =>",cartItems);
     
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
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Select Delivery Address</h2>
            <CheckoutAddressSelector />
          </div>

          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            {selectedAddress ? (
              <div className="mb-4">
                <h3 className="font-medium">Shipping to:</h3>
                <p className="text-gray-700">{selectedAddress.fullName}</p>
                <p className="text-gray-700">{selectedAddress.addressLine1}</p>
                {selectedAddress.addressLine2 && <p className="text-gray-700">{selectedAddress.addressLine2}</p>}
                <p className="text-gray-700">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                <p className="text-gray-700">{selectedAddress.country}</p>
                <p className="text-gray-700">Mobile: {selectedAddress.phone}</p>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">No address selected.</p>
            )}

            {/* Order details */}
            <div className="space-y-2 text-gray-800">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {productSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {pincodeStatus === 'loading' ? 'Calculating...' : `Rs. ${shippingCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>Rs. {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirmOrder}
              className="w-full mt-6 py-3 text-lg"
              disabled={!selectedAddressId || pincodeStatus === 'loading' || isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing Payment...' : 'Confirm Order'}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

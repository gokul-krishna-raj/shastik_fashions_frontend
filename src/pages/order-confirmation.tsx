
import { NextPage } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrderById } from '@/store/orderConfirmationSlice';
import { Skeleton } from '@/components/ui/skeleton';

// --- Sub-components (Unchanged) ---

const OrderSummary = ({ order }: { order: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Order Summary</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Order ID</span>
        <span>{order._id}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Order Date</span>
        <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Payment Method</span>
        <span>Razorpay</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total Amount</span>
        <span>₹{order.totalAmount.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Payment Status</span>
        <span className="text-green-600 font-semibold">{order.paymentStatus}</span>
      </div>
    </CardContent>
  </Card>
);

const ItemsPurchased = ({ products }: { products: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Items Purchased</CardTitle>
    </CardHeader>
    <CardContent>
      {products?.map((item) => (
        <div key={item._id} className="flex items-start space-x-4 mb-4">
          <Image src="https://via.placeholder.com/80" alt={item.product.name} width={80} height={80} className="rounded-md bg-gray-100" />
          <div className="flex-grow">
            <p className="font-semibold">{item.product.name}</p>
            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const ShippingDetails = ({ details }: { details: any }) => {
  const fullAddress = `${details.addressLine1}, ${details.addressLine2 ? details.addressLine2 + ', ' : ''}${details.city}, ${details.state} - ${details.pincode}, ${details.country}`;
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-semibold">{details.fullName}</p>
        <p className="text-muted-foreground">{fullAddress}</p>
        <p className="text-muted-foreground">{details.phone}</p>
        <div className="pt-2">
          <p className="text-sm font-medium">Estimated Delivery: <span className="font-normal">{estimatedDeliveryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentDetails = ({ details }: { details: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Payment Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Payment Provider</span>
        <span className="font-semibold">Razorpay</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Razorpay Payment ID</span>
        <span>{details.razorpayPaymentId}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Razorpay Order ID</span>
        <span>{details.razorpayOrderId}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Transaction Status</span>
        <span className="text-green-600 font-semibold">{details.paymentStatus}</span>
      </div>
    </CardContent>
  </Card>
);

const ConfirmationMessage = () => (
  <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
    <h2 className="text-2xl font-bold text-green-800">Thank You For Your Order!</h2>
    <p className="mt-2 text-muted-foreground">Your order has been confirmed. A confirmation email has been sent to your registered email address.</p>
    <div className="mt-6 flex justify-center gap-4">
      <Button>Continue Shopping</Button>
      <Button variant="outline">Download Invoice</Button>
    </div>
    <p className="mt-4 text-sm text-muted-foreground">
      For any support, please contact us at <a href="mailto:support@shastikfashion.com" className="text-primary hover:underline">support@shastikfashion.com</a>.
    </p>
  </div>
);

const TrackOrderButton = ({ orderId }: { orderId: string }) => (
  <div className="text-center mt-6">
    <Button size="lg" className="w-full md:w-auto" onClick={() => alert(`Tracking order: ${orderId}`)}>
      Track Your Order
    </Button>
  </div>
);

const BrandStory = () => (
  <Card className="bg-gray-50">
    <CardHeader>
      <CardTitle className="text-center">Our Story</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-center text-muted-foreground">
        At Shastik Fashion, we believe in quality and style. Thank you for being a part of our journey.
      </p>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <Skeleton className="h-48 w-full mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

const OrderConfirmationPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { order, suggestedProducts, loading, error } = useAppSelector(state => state.orderConfirmation);

  useEffect(() => {
    // The router query is only available on the client side, so we check for its readiness.
    if (router.isReady) {
      const { orderId } = router.query;
      if (orderId) {
        dispatch(fetchOrderById(orderId as string));
      }
    }
  }, [router.isReady, router.query, dispatch]);

  if (loading === 'pending' || loading === 'idle') {
    return (
      <LoadingSkeleton />
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-muted-foreground">The requested order could not be found. Please check the ID and try again.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <ConfirmationMessage />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ItemsPurchased products={order.products} />
        </div>

        <div className="space-y-8">
          {order && <OrderSummary order={order} />}
          {order && <ShippingDetails details={order.shippingAddress} />}
          {order && <PaymentDetails details={order} />}
          {order && <TrackOrderButton orderId={order._id} />}


        </div>
      </div>

      <Separator className="my-12" />

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">You Might Also Like</h2>
        <RelatedProductsCarousel products={suggestedProducts} onAddToCart={() => { }} onAddToWishlist={() => { }} />
      </div>

      <Separator className="my-12" />

      <BrandStory />
    </div>
  );
};

export default OrderConfirmationPage;

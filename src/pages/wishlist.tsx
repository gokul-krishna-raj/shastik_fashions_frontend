import React, { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { addToCart } from '@/store/cartSlice';
import { useRouter } from 'next/router';
import { ShoppingCart, XCircle } from 'lucide-react';

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: wishlistItems, status, error } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (item: {
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    altText: string;
  }) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.productId));
  };

  if (status === 'loading' && wishlistItems.length === 0) {
    return <div className="text-center py-8">Loading wishlist...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <NextSeo
        title="Your Wishlist | My E-commerce Store"
        description="View and manage your saved wishlist items."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">Your wishlist is empty.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Continue shopping"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex flex-col border rounded-lg shadow-md overflow-hidden bg-white">
                <div className="relative w-full h-48">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
                  <p className="text-gray-700 font-bold mb-4">${item.price.toFixed(2)}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-auto space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center justify-center w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Move ${item.name} to cart`}
                    >
                      <ShoppingCart size={16} className="mr-2" /> Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="flex items-center justify-center w-full sm:w-auto text-red-500 border border-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <XCircle size={16} className="mr-2" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
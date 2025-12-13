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
  const { data: wishlistItems, status, error } = useSelector((state: RootState) => state.wishlist);


  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (item: {
    _id: string;
    name: string;
    price: number;
    images: string;
    altText: string;
  }) => {
    dispatch(addToCart(item._id));
    dispatch(removeFromWishlist(item._id));
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
        title="Your Wishlist | Shastik Fashions"
        description="View and manage your saved wishlist items."
      />

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Your Wishlist</h1>
            <span className="text-slate-500 font-medium">{wishlistItems.length} items</span>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
              <p className="text-slate-500 mb-8 max-w-sm">
                Save items you love here for later. Start exploring our collection now.
              </p>
              <button
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item: any) => (
                <div
                  key={item._id}
                  className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <Image
                      src={item.images[0]}
                      alt={item.altText || item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Floating Delete Action (for quick access) */}
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                      aria-label="Remove from wishlist"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-4">
                      <h2 className="font-semibold text-slate-900 mb-1 line-clamp-1 text-lg group-hover:text-rose-600 transition-colors">
                        {item.name}
                      </h2>
                      <p className="text-xl font-bold text-rose-600">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-auto space-y-3">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-rose-500/20 hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                      >
                        <ShoppingCart size={18} />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 font-medium py-1.5 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
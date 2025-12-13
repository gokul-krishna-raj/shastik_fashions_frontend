import React from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/router';
import { Product } from '@/types';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  isInWishlist?: boolean;
  isLoggedIn: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
  isLoggedIn,
}) => {
  const router = useRouter();
  const { _id, name, price, originalPrice, images, category } = product;
  console.log('category', category);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
    onAddToWishlist(_id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(_id);
  };

  return (
    <Link href={`/products/${_id}`} legacyBehavior>
      <a className="group border border-rose-100 rounded-2xl shadow-md hover:shadow-2xl overflow-hidden bg-white transition-all duration-300 block">
        <div className="relative w-full h-48 sm:h-56 md:h-64 bg-rose-50 overflow-hidden">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <span className="text-gray-400 flex items-center justify-center h-full">
              No Image
            </span>
          )}

          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all ${
                isInWishlist
                  ? 'bg-rose-600 text-white'
                  : 'bg-white/90 text-rose-600 hover:bg-rose-50'
              } focus:outline-none focus:ring-2 focus:ring-rose-200`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} className={isInWishlist ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
            {category.name}
          </p>
          <h3 className="text-base md:text-lg font-semibold leading-snug truncate text-slate-900 group-hover:text-rose-700 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-slate-900">₹{price.toLocaleString('en-IN')}</p>
            {originalPrice && originalPrice > price && (
              <p className="text-sm text-rose-500 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCartClick}
            className="w-full flex items-center justify-center bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white px-4 py-2.5 rounded-xl text-sm sm:text-base font-semibold hover:shadow-2xl active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </button>

        </div>
      </a>
    </Link>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div className="border border-rose-100 rounded-2xl shadow-md overflow-hidden bg-white animate-pulse">
    <div className="relative w-full h-48 sm:h-56 md:h-64 bg-rose-100"></div>
    <div className="p-4 sm:p-5 space-y-3">
      <div className="h-5 sm:h-6 bg-rose-100 rounded w-24"></div>
      <div className="h-6 sm:h-7 bg-rose-100 rounded w-3/4"></div>
      <div className="h-6 sm:h-7 bg-rose-100 rounded w-1/2"></div>
      <div className="h-11 sm:h-12 bg-rose-100 rounded-xl w-full"></div>
    </div>
  </div>
);

export default ProductCard;
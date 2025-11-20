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
      <a className="group border rounded-lg shadow-md hover:shadow-xl overflow-hidden bg-white transition-all duration-300 block">
        <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
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
            className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition-all ${isInWishlist
                ? 'bg-primary text-white'
                : 'bg-primary text-white hover:bg-primary-dark'
              } focus:outline-none focus:ring-2 focus:ring-primary-light`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} className={isInWishlist ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <p className="text-sm text-gray-500 mb-1">{category.name}</p>
          <h3 className="text-base md:text-lg font-semibold mb-2 truncate text-gray-800 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{price.toLocaleString('en-IN')}
            </p>
            {originalPrice && originalPrice > price && (
              <p className="text-sm text-gray-500 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCartClick}
            className="w-full flex items-center justify-center bg-[#8A1538] text-white px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-[#6c112d] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#c43b5e] focus:ring-offset-2"
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
  <div className="border rounded-lg shadow-md overflow-hidden bg-white animate-pulse">
    <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-200"></div>
    <div className="p-3 sm:p-4">
      <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-6 sm:h-7 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4"></div>
      <div className="h-10 sm:h-11 bg-gray-200 rounded-lg w-full"></div>
    </div>
  </div>
);

export default ProductCard;
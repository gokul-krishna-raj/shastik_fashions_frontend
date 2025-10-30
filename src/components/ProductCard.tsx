import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  altText: string;
}

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
  const { id, name, price, imageUrl, altText } = product;

  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    onAddToWishlist(id);
  };

  return (
    <div className="group border rounded-lg shadow-md hover:shadow-xl overflow-hidden bg-white transition-all duration-300">
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <span className="text-gray-400 flex items-center justify-center h-full">
            No Image
          </span>
        )}
        
        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition-all ${
            isInWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
          } focus:outline-none focus:ring-2 focus:ring-red-400`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            className={isInWishlist ? 'fill-current' : ''}
          />
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 truncate text-gray-800 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          ₹{price.toLocaleString('en-IN')}
        </p>
        
        <button
          onClick={() => onAddToCart(id)}
          className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
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

// Product Grid with Navigation
interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  wishlistIds?: string[];
  isLoggedIn: boolean;
  title?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onAddToWishlist,
  wishlistIds = [],
  isLoggedIn,
  title = 'Featured Products',
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          
          {/* Navigation Buttons - Desktop Only */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 md:flex md:overflow-x-auto md:overflow-y-hidden scrollbar-hide scroll-smooth"
        >
          {products.map((product) => (
            <div key={product.id} className="md:flex-shrink-0 md:w-64">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                isInWishlist={wishlistIds.includes(product.id)}
                isLoggedIn={isLoggedIn}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ProductCard;
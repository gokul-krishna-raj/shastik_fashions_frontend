
import React from 'react';
import ProductCard from './ProductCard';

import { Product } from '@/types';

import { useAppSelector } from '@/store/hooks';

interface RelatedProductsCarouselProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
}

const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({
  products,
  onAddToCart,
  onAddToWishlist,
}) => {
  const { token } = useAppSelector((state) => state.user);

  if (!products || products.length === 0) {
    return null; // Don't render if no related products
  }

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-x-auto">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            isLoggedIn={!!token}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProductsCarousel;

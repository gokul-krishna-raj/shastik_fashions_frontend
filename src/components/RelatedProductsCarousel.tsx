
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { useAppSelector } from '@/store/hooks';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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
    return null;
  }

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product._id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  isLoggedIn={!!token}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 bg-white/90 hover:bg-white border-rose-200 text-rose-600 shadow-lg" />
        <CarouselNext className="right-0 bg-white/90 hover:bg-white border-rose-200 text-rose-600 shadow-lg" />
      </Carousel>
    </div>
  );
};

export default RelatedProductsCarousel;

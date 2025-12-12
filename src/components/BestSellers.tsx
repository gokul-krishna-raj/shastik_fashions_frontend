
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBestSellers } from '@/store/homeSlice';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist } from '@/store/wishlistSlice';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from 'next/router';

const BestSellers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bestSellers, bestSellersStatus } = useAppSelector((state) => state.home);
  const { token } = useAppSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchBestSellers());
  }, [dispatch]);

  const handleAddToCart = (productId: string) => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    dispatch(addToCart(productId));
  };

  const handleAddToWishlist = (productId: string) => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    dispatch(addToWishlist(productId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Best Sellers</h2>
      {bestSellersStatus === 'loading' && <p>Loading...</p>}
      {bestSellersStatus === 'failed' && <p>Error fetching best sellers.</p>}
      {bestSellersStatus === 'succeeded' && bestSellers.length === 0 && (
        <p className="text-center">No best sellers available right now.</p>
      )}
      {bestSellersStatus === 'succeeded' && bestSellers.length > 0 && (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {bestSellers.slice(0, 8).map((product) => (
              <CarouselItem key={product._id} className="basis-1/2 md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    isLoggedIn={!!token}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
      <div className="text-center mt-8">
        <Link href="/best-seller" legacyBehavior>
          <a className="bg-[#8A1538] text-white font-bold py-2 px-4 rounded">
            View All
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BestSellers;

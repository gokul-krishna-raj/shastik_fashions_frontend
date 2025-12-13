
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
    <section className="bg-gradient-to-b from-amber-50 via-white to-rose-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold">Top rated</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Best Sellers</h2>
            <p className="text-sm text-slate-600 mt-1">Customer-loved sarees with rich zari, pastels, and classics.</p>
          </div>
          <Link href="/best-seller" legacyBehavior>
            <a className="hidden sm:inline-flex bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-semibold py-2.5 px-5 rounded-full shadow-lg hover:shadow-2xl transition-all">
              View all
            </a>
          </Link>
        </div>

        {bestSellersStatus === 'loading' && <p className="text-center text-slate-500">Loading...</p>}
        {bestSellersStatus === 'failed' && <p className="text-center text-rose-600">Error fetching best sellers.</p>}
        {bestSellersStatus === 'succeeded' && bestSellers.length === 0 && (
          <p className="text-center text-slate-600">No best sellers available right now.</p>
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
                  <div className="p-2">
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
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
        <div className="text-center mt-8 sm:mt-10">
          <Link href="/best-seller" legacyBehavior>
            <a className="inline-flex bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg hover:shadow-2xl transition-all">
              View all best sellers
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;

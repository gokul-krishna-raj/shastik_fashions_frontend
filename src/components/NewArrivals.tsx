
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNewArrivals } from '@/store/homeSlice';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist } from '@/store/wishlistSlice';
import ProductCard from './ProductCard';
import { useRouter } from 'next/router';
import { Product } from '@/types';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const NewArrivals: React.FC = () => {
  const dispatch = useAppDispatch();
  const { newArrivals, newArrivalsStatus } = useAppSelector((state) => state.home);
  const { token } = useAppSelector((state) => state.user);
console.log("newArrivals =>", newArrivals);
console.log("newArrivalsStatus =>", newArrivalsStatus);
const router = useRouter();
  useEffect(() => {
    dispatch(fetchNewArrivals());
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
    <section className="bg-gradient-to-b from-white to-rose-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500 font-semibold">Fresh drop</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">New Arrivals</h2>
            <p className="text-sm text-slate-600 mt-1">Handpicked silks, organza, and pastel drapes this week.</p>
          </div>
          <Link href="/new-arrivals" legacyBehavior>
            <a className="hidden sm:inline-flex bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold py-2.5 px-5 rounded-full shadow-lg hover:shadow-2xl transition-all">
              View all
            </a>
          </Link>
        </div>

        {newArrivalsStatus === 'loading' && <p className="text-center text-slate-500">Loading...</p>}
        {newArrivalsStatus === 'failed' && <p className="text-center text-rose-600">Error fetching new arrivals.</p>}
        {newArrivalsStatus === 'succeeded' && newArrivals.length === 0 && (
          <p className="text-center text-slate-600">No new arrivals available right now.</p>
        )}
        {newArrivalsStatus === 'succeeded' && newArrivals.length > 0 && (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {newArrivals.slice(0, 8).map((product) => (
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
          <Link href="/new-arrivals" legacyBehavior>
            <a className="inline-flex bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg hover:shadow-2xl transition-all">
              View all arrivals
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;


import { NextSeo } from 'next-seo';
import HeroCarousel from '@/components/HeroCarousel';
import CategorySection from '@/components/CategorySection';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchCategories } from '@/store/categorySlice';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  altText: string;
}

const mockProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `new-arrival-${i + 1}`,
  name: `New Arrival Product ${i + 1}`,
  price: 29.99 + i,
  imageUrl: `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
  altText: `New Arrival Product ${i + 1}`,
}));

const mockBestSellers: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `best-seller-${i + 1}`,
  name: `Best Seller Product ${i + 1}`,
  price: 49.99 + i,
  imageUrl: `https://d1c96i8uprz2te.cloudfront.net/360x554/filters:quality(5)/product/product_gallery/68dfcee10b968.jpg`,
  altText: `Best Seller Product ${i + 1}`,
}));

const HomePage = () => {
  
  const dispatch = useDispatch<AppDispatch>();
 const { categories = [], loading: categoriesLoading = false } = useSelector(
    (state: RootState) => state.categories || {}
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddToCart = (productId: string) => {
    console.log(`Add product ${productId} to cart`);
    // TODO: Implement Redux dispatch for adding to cart
  };

  const handleAddToWishlist = (productId: string) => {
    console.log(`Add product ${productId} to wishlist`);
    // TODO: Implement Redux dispatch for adding to wishlist
  };

  const isLoading = false; // TODO: Replace with actual loading state from Redux

  return (
    <>
      <NextSeo
        title="Home | Shastik Fashions"
        description="Welcome to Shastik Fashions. Find the best products here."
      />
      <HeroCarousel />
      <CategorySection categories={categories} loading={categoriesLoading} />

      <section className="my-8">
        <h2 className="text-3xl font-bold text-center mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isLoggedIn={true}
              />
            ))
          )}
        </div>
      </section>

      <section className="my-8">
        <h2 className="text-3xl font-bold text-center mb-6">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            mockBestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isLoggedIn={true}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;


import { NextSeo } from 'next-seo';
import HeroCarousel from '@/components/HeroCarousel';
import CategorySection from '@/components/CategorySection';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchCategories } from '@/store/categorySlice';
import BestSellers from '@/components/BestSellers';
import NewArrivals from '@/components/NewArrivals';

const HomePage = () => {
  
  const dispatch = useDispatch<AppDispatch>();
 const { categories, status } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-white">
      <NextSeo
        title="Home | Shastik Fashions"
        description="Welcome to Shastik Fashions. Find the best products here."
      />
      <HeroCarousel />
      <CategorySection categories={categories} loading={status === 'loading'} />
      <NewArrivals />
      <BestSellers />
    </main>
  );
};

export default HomePage;

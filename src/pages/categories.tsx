import React, { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCategories } from '@/store/categorySlice';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

const CategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status, error } = useSelector((state: RootState) => state.categories);

  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-[#8A1538] mb-8">Categories</h1>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <h1 className="text-4xl font-bold text-[#8A1538] mb-8">Categories</h1>
        <p>Error loading categories: {error}</p>
      </div>
    );
  }

  return (
    <>
      <NextSeo
        title="Categories | Shastik Fashions"
        description="Explore all saree categories at Shastik Fashions."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-[#8A1538] mb-8">Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category: Category) => (
            <Link href={`/categories/${category._id}`} key={category._id} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-48">
                  <Image
                    src={category.image === 'no-photo.jpg' ? '/Images/shastik_fahsion_logo.png' : category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;

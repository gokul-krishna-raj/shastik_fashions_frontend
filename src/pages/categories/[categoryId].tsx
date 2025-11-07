import React, { useEffect, useRef, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts, setSort, setPage, resetProducts } from '@/store/productsSlice';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import SortDropdown from '@/components/SortDropdown';
import Link from 'next/link';

const CategoryProductsPage = () => {
  const router = useRouter();
  const { categoryId } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, sort, page, hasMore } = useSelector((state: RootState) => state.products);
  const { token } = useSelector((state: RootState) => state.user);
  const { categories } = useSelector((state: RootState) => state.categories);

  const categoryName = categories.find((c) => c.slug === categoryId)?.name || (categoryId as string);

  const observer = useRef<IntersectionObserver>();
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (status === 'loading') return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(setPage(page + 1));
        }
      });
      if (node) observer.current.observe(node);
    },
    [status, hasMore, page, dispatch]
  );

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchProducts({ page, sort, append: page > 1, categoryId: categoryId as string }));
    }
  }, [categoryId, dispatch, sort, page]);

  const handleSortChange = useCallback((newSort: string) => {
    dispatch(setSort(newSort));
    dispatch(resetProducts());
    dispatch(fetchProducts({ page: 1, sort: newSort, append: false, categoryId: categoryId as string }));
  }, [dispatch, categoryId]);

  const handleAddToCart = (productId: string) => {
    console.log(`Add product ${productId} to cart`);
    // TODO: Implement Redux dispatch for adding to cart
  };

  const handleAddToWishlist = (productId: string) => {
    console.log(`Add product ${productId} to wishlist`);
    // TODO: Implement Redux dispatch for adding to wishlist
  };

  return (
    <>
      <NextSeo
        title={`${categoryName} | Shastik Fashions`}
        description={`Explore ${categoryName} sarees at Shastik Fashions.`}
      />
      <div className="container mx-auto px-4 py-8 bg-[#FFF9F5]">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4" aria-label="breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/" className="text-blue-600 hover:underline">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/categories" className="text-blue-600 hover:underline">Categories</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-500" aria-current="page">{categoryName}</li>
          </ol>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#8A1538]">{categoryName}</h1>
          <SortDropdown currentSort={sort} onSortChange={handleSortChange} />
        </div>

        {status === 'loading' && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : status === 'failed' ? (
          <p className="text-center text-red-500 mt-8">Failed to load products.</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              if (products.length === index + 1) {
                return (
                  <div ref={lastProductElementRef} key={product._id}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      isLoggedIn={!!token}
                    />
                  </div>
                );
              }
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  isLoggedIn={!!token}
                />
              );
            })}
          </div>
        )}

        {!hasMore && status === 'succeeded' && products.length > 0 && (
          <p className="text-center text-gray-500 mt-8">You have reached the end of the list.</p>
        )}
      </div>
    </>
  );
};

export default CategoryProductsPage;

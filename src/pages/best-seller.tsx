import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts, setSort, setPage, resetProducts } from '@/store/productsSlice';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import SortDropdown from '@/components/SortDropdown';

const BestSellerPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, filters, sort, page, hasMore } = useSelector((state: RootState) => state.products);

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

  // Initial load and query param handling
  useEffect(() => {
    const { sort: sortParam, page: pageParam } = router.query;

    const initialSort = (sortParam as string) || 'newest';
    const initialPage = pageParam ? Number(pageParam) : 1;

    if (initialSort !== sort) {
      dispatch(setSort(initialSort));
    }
    if (initialPage !== page) {
      dispatch(setPage(initialPage));
    }

    if (status === 'idle' || (status === 'succeeded' && products.length === 0 && initialPage === 1)) {
      dispatch(fetchProducts({ page: initialPage, sort: initialSort, append: false, type: 'best-sellers' }));
    }
  }, [router.query]);

  // Fetch more products when page changes (for infinite scroll)
  useEffect(() => {
    if (page > 1 && hasMore && status !== 'loading') {
      dispatch(fetchProducts({ page, filters, sort, append: true, type: 'best-sellers' }));
    }
  }, [page]);

  // Effect to update URL when sort changes
  useEffect(() => {
    const query: Record<string, string | string[]> = {};
    if (sort !== 'newest') query.sort = sort;
    if (page > 1) query.page = String(page);

    router.push({
      pathname: router.pathname,
      query,
    }, undefined, { shallow: true });
  }, [sort, page]);

  const handleSortChange = useCallback((newSort: string) => {
    dispatch(setSort(newSort));
    dispatch(resetProducts());
    dispatch(fetchProducts({ page: 1, sort: newSort, append: false, type: 'best-sellers' }));
  }, [dispatch]);

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
        title="Best Sellers | Shastik Fashions"
        description="Explore our best-selling sarees at Shastik Fashions."
      />
      <div className="flex flex-col bg-[#FFF9F5]">
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#8A1538]">Best Sellers</h1>
            <SortDropdown currentSort={sort} onSortChange={handleSortChange} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              if (products.length === index + 1) {
                return (
                  <div ref={lastProductElementRef} key={product.id}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  </div>
                );
              }
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              );
            })}
            {status === 'loading' &&
              Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>

          {status === 'failed' && <p className="text-center text-red-500 mt-8">Failed to load products.</p>}
          {!hasMore && status === 'succeeded' && products.length > 0 && (
            <p className="text-center text-gray-500 mt-8">You have reached the end of the list.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BestSellerPage;

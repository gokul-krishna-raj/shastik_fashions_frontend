import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts, setFilters, setSort, setPage, resetProducts } from '@/store/productsSlice';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist } from '@/store/wishlistSlice';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import { Menu } from 'lucide-react';
import { SareeFilters } from '@/types/filters';

const ProductsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, isFetchingMore, filters, sort, page, hasMore } = useSelector((state: RootState) => state.products);
  const { token } = useSelector((state: RootState) => state.user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    const { category, priceRange, fabric, color, sort: sortParam, page: pageParam } = router.query;

    const initialFilters: SareeFilters = {
      category: typeof category === 'string' ? [category] : (category as string[] || []),
      priceRange: priceRange ? (priceRange as string).split('-').map(Number) as [number, number] : [500, 20000],
      fabric: typeof fabric === 'string' ? [fabric] : (fabric as string[] || []),
      color: typeof color === 'string' ? [color] : (color as string[] || []),
    };
    const initialSort = (sortParam as string) || 'newest';
    const initialPage = pageParam ? Number(pageParam) : 1;

    // Only dispatch if values are different from current Redux state
    // Note: Deep comparison for filters might be needed for complex objects
    if (JSON.stringify(initialFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(initialFilters));
    }
    if (initialSort !== sort) {
      dispatch(setSort(initialSort));
    }
    if (initialPage !== page) {
      dispatch(setPage(initialPage));
    }

    // Fetch products if not already loading or succeeded with current filters/sort/page
    if (status === 'idle' || (status === 'succeeded' && products.length === 0 && initialPage === 1)) {
      dispatch(fetchProducts({ page: initialPage, filters: initialFilters, sort: initialSort, append: false }));
    }
  }, [router.query, dispatch, filters, page, products.length, sort, status]); // Depend on router.query to re-evaluate when URL changes

  // Fetch more products when page changes (for infinite scroll)
  useEffect(() => {
    if (page > 1 && hasMore && status !== 'loading') {
      dispatch(fetchProducts({ page, filters, sort, append: true }));
    }
  }, [page, dispatch, filters, hasMore, sort, status]); // Depend on page to trigger infinite scroll

  // Effect to update URL when filters or sort change
  useEffect(() => {
    const query: Record<string, string | string[]> = {};
    if (filters.category.length > 0) query.category = filters.category;
    if (filters.priceRange[0] !== 500 || filters.priceRange[1] !== 20000) {
      query.priceRange = `${filters.priceRange[0]}-${filters.priceRange[1]}`;
    }
    if (filters.fabric.length > 0) query.fabric = filters.fabric;
    if (filters.color.length > 0) query.color = filters.color;
    if (sort !== 'newest') query.sort = sort;
    if (page > 1) query.page = String(page);

    router.push({
      pathname: router.pathname,
      query,
    }, undefined, { shallow: true });
  }, [filters, sort, page, router]);

  const handleApplyFilters = useCallback((newFilters: SareeFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(resetProducts()); // Reset products and page when filters change
    dispatch(fetchProducts({ page: 1, filters: newFilters, sort, append: false }));
  }, [dispatch, sort]);

  const handleClearAllFilters = useCallback(() => {
    const clearedFilters: SareeFilters = {
      category: [],
      color: [],
      priceRange: [500, 20000],
      fabric: [],
    };
    dispatch(setFilters(clearedFilters));
    dispatch(resetProducts());
    dispatch(fetchProducts({ page: 1, filters: clearedFilters, sort, append: false }));
  }, [dispatch, sort]);

  const handleSortChange = useCallback((newSort: string) => {
    dispatch(setSort(newSort));
    dispatch(resetProducts()); // Reset products and page when sort changes
    dispatch(fetchProducts({ page: 1, filters, sort: newSort, append: false }));
  }, [dispatch, filters]);

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
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      <NextSeo
        title="Products | Shastik Fashions"
        description="Browse all products in our store."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:hidden flex items-center justify-between bg-white/90 backdrop-blur-lg border border-rose-100 rounded-2xl px-4 py-3 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">Shop</p>
              <h1 className="text-xl font-bold text-slate-900">All Products</h1>
            </div>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open filters sidebar"
            >
              <Menu size={18} /> Filters
            </button>
          </div>

          <FilterSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            filters={filters}
            onApply={handleApplyFilters}
            onClearAll={handleClearAllFilters}
          />

          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">Shop</p>
                <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
              </div>
              <SortDropdown currentSort={sort} onSortChange={handleSortChange} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {(products || []).map((product, index) => {
                if ((products || []).length === index + 1) {
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
              {(status === 'loading' || isFetchingMore) &&
                Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>

            {status === 'failed' && <p className="text-center text-rose-600 mt-8">Failed to load products.</p>}
            {!hasMore && status === 'succeeded' && products.length > 0 && (
              <p className="text-center text-slate-500 mt-8">You have reached the end of the list.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;

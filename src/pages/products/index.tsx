import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts, setFilters, setSort, setPage, resetProducts } from '@/store/productsSlice';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import { Menu } from 'lucide-react';

const ProductsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, filters, sort, page, hasMore } = useSelector((state: RootState) => state.products);

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

    const initialFilters = {
      category: (category as string) || '',
      priceRange: priceRange ? (priceRange as string).split('-').map(Number) as [number, number] : [0, 1000],
      fabric: (fabric as string) || '',
      color: (color as string) || '',
    };
    const initialSort = (sortParam as string) || 'newest';
    const initialPage = pageParam ? Number(pageParam) : 1;

    // Only dispatch if values are different from current Redux state
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
  }, [router.query]); // Depend on router.query to re-evaluate when URL changes

  // Fetch more products when page changes (for infinite scroll)
  useEffect(() => {
    if (page > 1 && hasMore && status !== 'loading') {
      dispatch(fetchProducts({ page, filters, sort, append: true }));
    }
  }, [page]); // Depend on page to trigger infinite scroll

  // Effect to update URL when filters or sort change
  useEffect(() => {
    const query: Record<string, string | string[]> = {};
    if (filters.category) query.category = filters.category;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) {
      query.priceRange = `${filters.priceRange[0]}-${filters.priceRange[1]}`;
    }
    if (filters.fabric) query.fabric = filters.fabric;
    if (filters.color) query.color = filters.color;
    if (sort !== 'newest') query.sort = sort;
    if (page > 1) query.page = String(page);

    router.push({
      pathname: router.pathname,
      query,
    }, undefined, { shallow: true });
  }, [filters, sort, page]);

  const handleFilterChange = useCallback((newFilter: any) => {
    dispatch(setFilters({ ...filters, ...newFilter }));
    dispatch(resetProducts()); // Reset products and page when filters change
  }, [filters, dispatch]);

  const handleSortChange = useCallback((newSort: string) => {
    dispatch(setSort(newSort));
    dispatch(resetProducts()); // Reset products and page when sort changes
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
        title="Products | My E-commerce Store"
        description="Browse all products in our store."
      />
      <div className="flex flex-col md:flex-row">
        {/* Filter Sidebar Toggle for Mobile */}
        <button
          className="md:hidden p-4 bg-primary text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open filters sidebar"
        >
          <Menu className="mr-2" /> Filters
        </button>

        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Product List */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">All Products</h1>
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
              Array.from({ length: filters.limit }).map((_, i) => <ProductCardSkeleton key={i} />)}
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

export default ProductsPage;
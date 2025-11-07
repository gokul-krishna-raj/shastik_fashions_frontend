import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/store';
import { fetchProductDetails } from '@/store/productDetailsSlice';
import { fetchCategories } from '@/store/categorySlice';
import ProductImageGallery from '@/components/ProductImageGallery';
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel';
import { ShoppingCart, Heart } from 'lucide-react';
import { useRouter } from 'next/router';
import { NextSeo, ArticleJsonLd } from 'next-seo';

import { addToCart } from '@/store/cartSlice';
import { addToWishlist } from '@/store/wishlistSlice';

const ProductDetailsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = router.query;

  const { product, status, error, relatedProducts } = useSelector((state: RootState) => state.productDetails);
  const { categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (categoriesStatus === 'idle') dispatch(fetchCategories());
  }, [dispatch, categoriesStatus]);

  if (status === 'loading' || router.isFallback || categoriesStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading product details...
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Product not found.
      </div>
    );
  }

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

  const filteredRelatedProducts = relatedProducts.filter((p) => p._id !== product._id);
  const productCategory = categories.find((cat) => cat._id === product.category);

  return (
    <>
      <NextSeo
        title={`${product.name} | Shastik Fashions`}
        description={product.description}
        openGraph={{
          title: product.name,
          description: product.description,
          type: 'product',
          product: {
            price: {
              amount: product.price.toFixed(2),
              currency: 'INR',
            },
            availability: product.stock > 0 ? 'instock' : 'outofstock',
          },
        }}
      />
      <ArticleJsonLd
        url={`https://www.example.com/products/${product._id}`}
        title={product.name}
        images={product.images}
        datePublished={new Date().toISOString()}
        authorName="Shastik Fashions"
        description={product.description}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Grid layout for large screens, stacked for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div className="flex justify-center items-center">
            <ProductImageGallery images={product.images} altText={product.name} />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">{product.name}</h1>
            <p className="text-2xl sm:text-3xl font-semibold text-[#8A1538] mb-4">
              ₹{product.price.toFixed(2)}
            </p>

            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-gray-700 mb-6 text-base leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center space-x-2 mb-6">
              <span className="font-semibold">Category:</span>
              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {productCategory ? productCategory.name : 'N/A'}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => handleAddToCart(product._id)}
                className="flex justify-center items-center bg-[#8A1538] text-white px-6 py-3 rounded-md text-base sm:text-lg font-semibold hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#8A1538] focus:ring-offset-2"
                disabled={product.stock === 0}
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart size={20} className="mr-2" /> Add to Cart
              </button>

              <button
                onClick={() => handleAddToWishlist(product._id)}
                className="flex justify-center items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-base sm:text-lg font-semibold hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#8A1538] focus:ring-offset-2"
                aria-label={`Add ${product.name} to wishlist`}
              >
                <Heart size={20} className="mr-2" /> Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">
              Related Products
            </h2>
            <RelatedProductsCarousel
              products={filteredRelatedProducts}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailsPage;

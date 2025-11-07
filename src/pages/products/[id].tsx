import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/store';
import { fetchProductDetails } from '@/store/productDetailsSlice';
import { fetchCategories } from '@/store/categorySlice';
import ProductImageGallery from '@/components/ProductImageGallery';
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel';
import { ShoppingCart, Heart } from 'lucide-react';
import { useRouter } from 'next/router';
import { Product } from '@/types';
import { NextSeo, ArticleJsonLd } from 'next-seo';

const ProductDetailsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = router.query;

  const { product, status, error, relatedProducts, relatedStatus } = useSelector((state: RootState) => state.productDetails);
  const { categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  if (status === 'loading' || router.isFallback || categoriesStatus === 'loading') {
    return <div>Loading product details...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  const handleAddToCart = (productId: string) => {
    console.log(`Add product ${productId} to cart`);
    // TODO: Implement Redux dispatch for adding to cart
  };

  const handleAddToWishlist = (productId: string) => {
    console.log(`Add product ${productId} to wishlist`);
    // TODO: Implement Redux dispatch for adding to wishlist
  };

  const filteredRelatedProducts = relatedProducts.filter((p) => p._id !== product._id);
  const productCategory = categories.find(cat => cat._id === product.category);
console.log("product =>", product);

  return (
    <>
      <NextSeo
        title={`${product.name} | Shastik Fashions`}
        description={product.description}
        openGraph={{
          title: product.name,
          description: product.description,
          // images: product.images.map((image) => ({ url: image, alt: product.name })),
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div>
            <ProductImageGallery images={product.images} altText={product.name} />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-semibold text-primary mb-4">₹{product.price.toFixed(2)}</p>

            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="flex items-center space-x-2 mb-4">
              <span className="font-semibold">Category:</span>
              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">{productCategory ? productCategory.name : 'N/A'}</span>
            </div>

            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => handleAddToCart(product._id)}
                className="flex items-center bg-primary text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={product.stock === 0}
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart size={20} className="mr-2" /> Add to Cart
              </button>
              <button
                onClick={() => handleAddToWishlist(product._id)}
                className="flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Add ${product.name} to wishlist`}
              >
                <Heart size={20} className="mr-2" /> Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProductsCarousel
          products={filteredRelatedProducts}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      </div>
    </>
  );
};

export default ProductDetailsPage;
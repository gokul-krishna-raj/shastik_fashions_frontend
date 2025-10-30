import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { NextSeo, ArticleJsonLd } from 'next-seo';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchProductById } from '@/store/productsSlice';
import ProductImageGallery from '@/components/ProductImageGallery';
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel';
import { ShoppingCart, Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  altText: string;
  category: string;
  fabric: string;
  color: string;
  stock: number;
  images: string[];
}

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

// Mock data for demonstration
const mockProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  description: `This is a detailed description for Product ${i + 1}. It is made of high-quality materials and offers great value. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  price: parseFloat((Math.random() * (1000 - 10) + 10).toFixed(2)),
  imageUrl: `https://via.placeholder.com/600x400/FFDDC1/333333?text=Product+${i + 1}+Image+1`,
  altText: `Product ${i + 1}`,
  category: ['Electronics', 'Apparel', 'Home Goods', 'Books'][Math.floor(Math.random() * 4)],
  fabric: ['Cotton', 'Polyester', 'Wool', 'Silk'][Math.floor(Math.random() * 4)],
  color: ['Red', 'Blue', 'Green', 'Black', 'White'][Math.floor(Math.random() * 5)],
  stock: Math.floor(Math.random() * 100) + 1,
  images: [
    `https://via.placeholder.com/600x400/FFDDC1/333333?text=Product+${i + 1}+Image+1`,
    `https://via.placeholder.com/600x400/B0E0E6/333333?text=Product+${i + 1}+Image+2`,
    `https://via.placeholder.com/600x400/DDA0DD/333333?text=Product+${i + 1}+Image+3`,
  ],
}));

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for a few mock products
  const paths = mockProducts.slice(0, 5).map((product) => ({
    params: { id: product.id },
  }));

  return {
    paths,
    fallback: true, // Enable fallback for products not pre-rendered
  };
};

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async ({ params }) => {
  const id = params?.id as string;

  // Simulate fetching product data
  const product = mockProducts.find((p) => p.id === id) || null;

  if (!product) {
    return {
      notFound: true,
    };
  }

  // Simulate fetching related products
  const relatedProducts = mockProducts.filter((p) => p.id !== id).slice(0, 4);

  return {
    props: {
      product,
      relatedProducts,
    },
    revalidate: 60, // Re-generate page every 60 seconds
  };
};

const ProductDetailsPage: React.FC<ProductDetailsProps> = ({ product, relatedProducts }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  if (router.isFallback) {
    return <div>Loading product details...</div>;
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

  return (
    <>
      <NextSeo
        title={`${product.name} | Shastik Fashions`}
        description={product.description}
        openGraph={{
          title: product.name,
          description: product.description,
          images: [{
            url: product.imageUrl,
            alt: product.altText,
          }],
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
        url={`https://www.example.com/products/${product.id}`}
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
            <ProductImageGallery images={product.images} altText={product.altText} />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-semibold text-primary mb-4">${product.price.toFixed(2)}</p>

            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="flex items-center space-x-2 mb-4">
              <span className="font-semibold">Fabric:</span>
              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">{product.fabric}</span>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <span className="font-semibold">Color:</span>
              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">{product.color}</span>
            </div>

            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => handleAddToCart(product.id)}
                className="flex items-center bg-primary text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={product.stock === 0}
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart size={20} className="mr-2" /> Add to Cart
              </button>
              <button
                onClick={() => handleAddToWishlist(product.id)}
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
          products={relatedProducts}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      </div>
    </>
  );
};

export default ProductDetailsPage;
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/store';
import { fetchProductDetails } from '@/store/productDetailsSlice';
import { fetchCategories } from '@/store/categorySlice';
import ProductImageGallery from '@/components/ProductImageGallery';
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel';
import { ShoppingCart, Heart, BadgeCheck, Sparkles, ShieldCheck, Truck, RotateCcw, Package } from 'lucide-react';
import { useRouter } from 'next/router';
import { NextSeo, ArticleJsonLd } from 'next-seo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { addToCart } from '@/store/cartSlice';
import { addToWishlist } from '@/store/wishlistSlice';

const ProductDetailsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = router.query;

  const { product, status, error, relatedProducts } = useSelector((state: RootState) => state.productDetails);
  const { categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);
  const { token } = useSelector((state: RootState) => state.user);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (categoriesStatus === 'idle') dispatch(fetchCategories());
  }, [dispatch, categoriesStatus]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 400;
      setShowStickyBar(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-rose-100">
            <ProductImageGallery images={product.images} altText={product.name} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-[0.2em]">
                {productCategory ? productCategory.name : 'Saree'}
              </span>
              <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
                <Sparkles size={16} />
                Trending pick
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-rose-700">₹{product.price.toFixed(2)}</p>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                  <BadgeCheck size={16} />
                  In stock ({product.stock})
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm font-semibold">
                  Out of stock
                </span>
              )}
            </div>

            <p className="text-slate-700 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3 text-sm text-rose-700 font-semibold">
                Handpicked fabrics
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3 text-sm text-amber-700 font-semibold">
                Festive-ready drape
              </div>
              <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3 text-sm text-rose-700 font-semibold">
                Easy returns support
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleAddToCart(product._id)}
                className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white px-6 py-3 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
                disabled={product.stock === 0}
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>

              <button
                onClick={() => handleAddToWishlist(product._id)}
                className="inline-flex justify-center items-center gap-2 border border-rose-200 text-rose-700 px-6 py-3 rounded-xl text-base sm:text-lg font-semibold bg-white hover:bg-rose-50 transition-all focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2"
                aria-label={`Add ${product.name} to wishlist`}
              >
                <Heart size={20} /> Save to Wishlist
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl border border-rose-100 bg-white shadow-sm">
                <ShieldCheck className="text-rose-500 mb-2" size={20} />
                <p className="font-semibold text-slate-900">Authentic quality</p>
                <p className="text-slate-600">Curated weaves and premium finish.</p>
              </div>
              <div className="p-4 rounded-2xl border border-rose-100 bg-white shadow-sm">
                <BadgeCheck className="text-amber-500 mb-2" size={20} />
                <p className="font-semibold text-slate-900">Secure checkout</p>
                <p className="text-slate-600">Payments protected with SSL.</p>
              </div>
              <div className="p-4 rounded-2xl border border-rose-100 bg-white shadow-sm">
                <Sparkles className="text-rose-500 mb-2" size={20} />
                <p className="font-semibold text-slate-900">Care support</p>
                <p className="text-slate-600">Guidance on drape & maintenance.</p>
              </div>
            </div>

            {/* Product Details Accordions */}
            <div className="mt-8 bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="fabric" className="border-b border-rose-100">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-900 hover:text-rose-600">
                    Fabric & Material
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-700">
                    <p className="mb-2">
                      This exquisite saree is crafted from premium {productCategory?.name.toLowerCase() || 'fabric'} with intricate detailing.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>100% authentic handpicked material</li>
                      <li>Premium finish with elegant borders</li>
                      <li>Soft texture for comfortable draping</li>
                      <li>Colorfast and durable construction</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="care" className="border-b border-rose-100">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-900 hover:text-rose-600">
                    Care Instructions
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-700">
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Dry clean recommended for best results</li>
                      <li>If handwashing, use mild detergent in cold water</li>
                      <li>Do not wring or twist the fabric</li>
                      <li>Iron on low heat with a cloth barrier</li>
                      <li>Store in a cool, dry place away from direct sunlight</li>
                      <li>Keep away from perfumes and deodorants</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="occasion" className="border-b border-rose-100">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-900 hover:text-rose-600">
                    Perfect For
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-700">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-rose-500" size={16} />
                        <span className="text-sm">Weddings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-amber-500" size={16} />
                        <span className="text-sm">Festivals</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-rose-500" size={16} />
                        <span className="text-sm">Parties</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-amber-500" size={16} />
                        <span className="text-sm">Formal Events</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery" className="border-b-0">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-900 hover:text-rose-600">
                    Delivery & Returns
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-700">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <Truck className="text-rose-500 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">Free Shipping</p>
                          <p className="text-slate-600">Standard delivery within 5-7 business days. Express delivery available.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <RotateCcw className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">Easy Returns</p>
                          <p className="text-slate-600">30-day return policy. Unworn items with tags can be returned for full refund.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Package className="text-rose-500 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">Secure Packaging</p>
                          <p className="text-slate-600">Each saree is carefully packed to ensure it reaches you in perfect condition.</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Add to Cart Bar */}
        {showStickyBar && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-rose-200 shadow-2xl lg:hidden">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-lg font-bold text-rose-700">₹{product.price.toFixed(2)}</p>
                {product.stock > 0 && (
                  <p className="text-xs text-emerald-600 font-medium">In Stock</p>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product._id)}
                className="flex items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                disabled={product.stock === 0}
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        )}

        {filteredRelatedProducts.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-rose-500 font-semibold">You may also like</p>
                <h2 className="text-3xl font-bold text-slate-900">Related Products</h2>
              </div>
            </div>
            <RelatedProductsCarousel
              products={filteredRelatedProducts}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailsPage;

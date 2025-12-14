import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  Search,
  User,
  ShoppingCart,
  Home,
  Heart,
  X,
  Sparkles,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState, AppDispatch } from '@/store';
import { fetchCart } from '@/store/cartSlice';
import { fetchWishlist } from '@/store/wishlistSlice';
import { clearAuthData } from '@/store/userSlice';
import { useDebounce } from '@/hooks/use-debounce';
import { searchProducts, clearSearchResults } from '@/store/searchSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.user);
  const cartItems = useSelector((state: RootState) => state.cart.data);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.data);
  const { results: searchResults, status: searchStatus } = useSelector((state: RootState) => state.search);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts on client
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      dispatch(searchProducts(debouncedSearchQuery));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedSearchQuery, dispatch]);

  const handleNavigation = (path: string) => {
    if (token) {
      router.push(path);
    }
    else {
      router.push('/auth/login');
    }
  };

  const handleLogout = () => {
    dispatch(clearAuthData());
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Product' },
    { href: '/new-arrivals', label: 'New Arrivals' },
    { href: '/best-seller', label: 'Best Seller' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/products?search=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 shadow-md hover:shadow-lg transition-all"
                aria-label="Toggle menu"
              >
                <Menu size={22} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-10 w-32 md:h-14 md:w-40">
                  <Image
                    src="/Images/shastik_fahsion_logo_new.png"
                    alt="Shastik Fashions Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
              {navLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  className="group relative text-slate-700 hover:text-rose-700 font-medium tracking-wide transition-colors py-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-rose-700 hover:bg-rose-50 transition-colors"
                aria-label="Search"
              >
                <Search size={22} />
              </button>
              <button
                onClick={() => handleNavigation('/wishlist')}
                className="relative p-2 rounded-full text-rose-700 hover:bg-rose-50 transition-colors"
                aria-label="Wishlist items"
              >
                <Heart size={22} />
                {isClient && wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] px-1.5 rounded-full min-w-[18px] h-4 flex items-center justify-center shadow-lg">
                    {wishlistCount}
                  </span>
                )}
              </button>
              {isClient && token ? (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-rose-700 hover:bg-rose-50 transition-colors"
                  aria-label="Logout"
                >
                  <User size={22} />
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="p-2 rounded-full text-rose-700 hover:bg-rose-50 transition-colors"
                  aria-label="Account"
                >
                  <User size={22} />
                </Link>
              )}
              <button
                onClick={() => handleNavigation('/cart')}
                className="relative px-3 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all"
                aria-label="Shopping Cart"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  <span className="text-sm">Cart</span>
                </div>
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-rose-600 text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full bg-rose-50 text-rose-700 shadow-sm"
                aria-label="Search"
              >
                <Search size={22} />
              </button>
              <div className="relative">
                <button
                  onClick={() => handleNavigation('/cart')}
                  className="p-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-md"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart size={22} />
                </button>
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-rose-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="h-16 md:h-24"></div>

      <div
        className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden border-r border-rose-100/50 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b border-rose-50 bg-rose-50/30">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <div className="relative h-8 w-28">
              <Image
                src="/Images/shastik_fahsion_logo_new.png"
                alt="Shastik Fashions"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 -mr-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <nav className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</p>
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between text-slate-700 hover:text-rose-700 text-lg font-medium py-3 px-3 rounded-xl hover:bg-rose-50/80 transition-all border border-transparent hover:border-rose-100"
              >
                {link.label}
                <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white p-5 shadow-lg shadow-rose-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Sparkles size={20} className="text-white" />
                </div>
                <p className="font-bold tracking-wide">Festive Collection</p>
              </div>
              <p className="text-sm text-white/90 leading-relaxed mb-4">
                Explore our handpicked sarees for the upcoming wedding season.
              </p>
              <Link
                href="/products?category=festive"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center w-full bg-white text-rose-600 font-bold py-3 rounded-xl text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                Shop Now
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {isClient && token ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-slate-600 hover:text-rose-600 font-medium py-2 px-3 w-full transition-colors"
                >
                  <User size={20} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-slate-700 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 font-semibold py-3 rounded-xl transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 font-semibold py-3 rounded-xl transition-all shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } md:hidden`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 transition-all duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl animate-slideDown overflow-hidden border border-white/50">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white shadow-sm text-rose-600 flex items-center justify-center border border-rose-100">
                  <Search size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">Search Collection</h3>
                  <p className="text-xs text-slate-500 font-medium">Find your perfect drape</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  dispatch(clearSearchResults());
                }}
                className="p-2 -mr-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try 'Red Kanjeevaram' or 'Silk Cotton'..."
                  className="w-full px-5 py-4 pl-14 text-lg bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-rose-300 focus:bg-white focus:shadow-lg focus:shadow-rose-100/50 transition-all placeholder:text-slate-400 text-slate-900"
                  autoFocus
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={24} />
              </form>

              <div className="mt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {searchStatus === 'loading' && (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Searching our collection...</p>
                  </div>
                )}

                {searchStatus === 'failed' && (
                  <div className="text-center py-10">
                    <p className="text-rose-600 font-medium">Unable to complete search.</p>
                  </div>
                )}

                {searchStatus === 'succeeded' && searchResults.length === 0 && debouncedSearchQuery && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-900 font-semibold text-lg">No matches found</p>
                    <p className="text-slate-500">We couldn&apos;t find any products matching &quot;{debouncedSearchQuery}&quot;</p>
                  </div>
                )}

                {searchStatus === 'succeeded' && searchResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Top Results</h4>
                      <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                        {searchResults.length} items
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 gap-2">
                      {searchResults.map((product) => (
                        <li key={product._id}>
                          <Link
                            href={`/products/${product._id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-4 p-3 hover:bg-rose-50/80 rounded-2xl transition-all group border border-transparent hover:border-rose-100"
                          >
                            <div className="relative h-16 w-16 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                              <Image
                                src={product.images[0] || '/Images/placeholder.png'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 truncate group-hover:text-rose-700 transition-colors">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-rose-600 font-bold">₹{product.price.toFixed(2)}</span>
                                {product.stock < 5 && product.stock > 0 && (
                                  <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded-full">
                                    Low Stock
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="p-2 text-slate-300 group-hover:text-rose-500 transform group-hover:translate-x-1 transition-all">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                              </svg>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!debouncedSearchQuery && !searchStatus && (
                  <div className="py-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {['Silk Saree', 'Organza', 'Bridal Collection', 'Cotton', 'Festive'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-4 py-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-full text-sm font-medium transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={handleSearch}
                  className="text-sm font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                >
                  View all results
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-rose-100 shadow-[0_-6px_30px_-18px_rgba(0,0,0,0.3)] z-40">
        <div className="flex items-center justify-around h-16 px-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center flex-1 text-slate-700 hover:text-rose-700 transition-colors"
          >
            <Home size={22} />
            <span className="text-[11px] mt-1 font-semibold">Home</span>
          </Link>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center flex-1 text-slate-700 hover:text-rose-700 transition-colors"
          >
            <Search size={22} />
            <span className="text-[11px] mt-1 font-semibold">Search</span>
          </button>
          <button
            onClick={() => handleNavigation('/wishlist')}
            className="flex flex-col items-center justify-center flex-1 text-slate-700 hover:text-rose-700 transition-colors relative"
            aria-label="Wishlist items"
          >
            <div className="relative flex items-center justify-center">
              <Heart size={22} />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 font-semibold">Wishlist</span>
          </button>

          <button
            onClick={() => handleNavigation('/cart')}
            className="flex flex-col items-center justify-center flex-1 text-slate-700 hover:text-rose-700 transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={22} />
            <span className="text-[11px] mt-1 font-semibold">Cart</span>
            {isClient && cartCount > 0 && (
              <span className="absolute -top-1 right-3 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav Spacer */}
      <div className="h-16 md:hidden"></div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;

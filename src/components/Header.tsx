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
                  className="text-slate-700 hover:text-rose-700 font-semibold tracking-wide transition-colors"
                >
                  {link.label}
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
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-rose-100 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden`}
      >
        <div className="p-5 space-y-6">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-rose-700 hover:text-rose-900 text-3xl"
            aria-label="Close menu"
          >
            &times;
          </button>
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-800 hover:text-rose-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-rose-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
            {isClient && token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-slate-800 hover:text-rose-700 text-base font-semibold py-2 px-3 w-full text-left rounded-lg hover:bg-rose-50 transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-800 hover:text-rose-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-rose-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-800 hover:text-rose-700 text-base font-semibold py-2 px-3 rounded-lg hover:bg-rose-50 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white p-4 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={20} />
              <p className="font-semibold tracking-wide text-sm">Festive Picks</p>
            </div>
            <p className="text-sm/relaxed text-rose-50">
              Curated sarees with luxe drapes and artisanal motifs.
            </p>
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 w-full rounded-full bg-white/90 text-rose-700 font-semibold py-2 text-sm hover:bg-white transition-all"
            >
              Shop collection
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slideDown border border-rose-50">
            <div className="p-4 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Search size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Search sarees</h3>
                  <p className="text-xs text-slate-500">Find colors, fabrics, weaves</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  dispatch(clearSearchResults());
                }}
                className="text-rose-500 hover:text-rose-700"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Kanjivaram, organza, pastel, zari..."
                  className="w-full px-4 py-3 pl-12 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/60"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={20} />
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white py-3 rounded-xl font-semibold tracking-wide shadow-lg hover:shadow-2xl transition-all"
              >
                Search
              </button>
            </form>
            <div className="p-4 border-t border-rose-100 max-h-60 overflow-y-auto">
              {searchStatus === 'loading' && <p className="text-center text-slate-500">Loading...</p>}
              {searchStatus === 'failed' && <p className="text-center text-rose-600">Error searching products.</p>}
              {searchStatus === 'succeeded' && searchResults.length === 0 && debouncedSearchQuery && (
                <p className="text-center text-slate-600">No results for “{debouncedSearchQuery}”</p>
              )}
              {searchStatus === 'succeeded' && searchResults.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Search results</h4>
                  <ul className="space-y-2">
                    {searchResults.map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/products/${product._id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center space-x-4 p-2 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Image
                            src={product.images[0] || '/Images/placeholder.png'}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            <p className="text-sm text-rose-600">₹{product.price}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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

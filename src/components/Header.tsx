import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, ShoppingCart, Home, Heart, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState, AppDispatch } from '@/store';
import { fetchCart } from '@/store/cartSlice';
import { fetchWishlist } from '@/store/wishlistSlice';
import { clearAuthData } from '@/store/userSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState('');
  const [isClient, setIsClient] = useState(false); // New state for client-side rendering check

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.user);
  const cartItems = useSelector((state: RootState) => state.cart.data);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.data);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts on client
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

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
    console.log('Searching for:', searchQuery);
    // Add your search logic here
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Desktop Logo - Left Side */}
            <div className="hidden md:block">
              <Link href="/" className="block">
                <Image
                  src="Images/shastik_fahsion_logo_new.png"
                  alt="Shastik Fashions Logo"
                  width={240}
                  height={80}
                  className="h-14 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Mobile Logo - Centered */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="block">
                <Image
                  src="Images/shastik_fahsion_logo_new.png"
                  alt="Shastik Fashions Logo"
                  width={160}
                  height={53}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <Search size={24} />
              </button>
              <button
                onClick={() => handleNavigation('/wishlist')}
                className="text-gray-600 hover:text-gray-900 transition-colors relative"
                aria-label="Wishlist items"
              >
                <Heart size={24} />
                {isClient && wishlistCount > 0 && (
                  <span className="hidden md:flex absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-pink-600 text-white text-xs px-1 rounded-full items-center justify-center min-w-[1rem] h-4">
                    {wishlistCount}
                  </span>
                )}
              </button>
              {isClient && token ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Logout"
                >
                  <User size={24} />
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Account"
                >
                  <User size={24} />
                </Link>
              )}
              <button
                onClick={() => handleNavigation('/cart')}
                className="text-gray-600 hover:text-gray-900 transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={24} />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile User Icon */}
          <div className="md:hidden">
            {isClient && token ? (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center flex-1 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Logout"
              >
                <User size={24} />
                <span className="text-xs mt-1">Logout</span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex flex-col items-center justify-center flex-1 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Account"
              >
                <User size={24} />
                <span className="text-xs mt-1">Account</span>
              </Link>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20"></div>

      {/* Mobile Side Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden`}
      >
        <div className="p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-600 hover:text-gray-900 mb-6 text-3xl"
            aria-label="Close menu"
          >
            &times;
          </button>
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            {token && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2 w-full text-left"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl animate-slideDown">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Search Products</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500 hover:text-gray-900"
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
                  placeholder="Search for sarees, categories..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
            {/* Recent Searches or Suggestions */}
            <div className="p-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                {['Silk Sarees', 'Cotton Sarees', 'Designer Sarees', 'Wedding Collection'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handleSearch(new Event('submit') as any);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex items-center justify-around h-16">
          <Link
            href="/"
            className="flex flex-col items-center justify-center flex-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center flex-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Search size={24} />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button
            onClick={() => handleNavigation('/wishlist')}
            className="flex flex-col items-center justify-center flex-1 text-gray-600 hover:text-blue-600 transition-colors relative"
            aria-label="Wishlist items"
          >
            <div className="relative flex items-center justify-center">
              <Heart size={24} />
              {isClient && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-pink-600 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">Wishlist</span>
          </button>

          <button
            onClick={() => handleNavigation('/cart')}
            className="flex flex-col items-center justify-center flex-1 text-gray-600 hover:text-blue-600 transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={24} />
            <span className="text-xs mt-1">Cart</span>
            {isClient && cartCount > 0 && (
              <span className="absolute top-1 right-6 bg-pink-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
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
            transform: translateY(-20px);
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
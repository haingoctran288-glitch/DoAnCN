import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors, User, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Dropdown from './Dropdown';
import ProductMenu from './ProductMenu';
import ServiceMenu from './ServiceMenu';
import { useCart } from '../context/CartContext';
import NavbarNotifications from './NavbarNotifications';
import { productCategories, highlightMenu } from '../data/products';
import { getAllNews } from '../api/news';

const MainNavbar = () => {
  const { cartItems } = useCart();
  const cartDistinctCount = cartItems.length;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const fullName = localStorage.getItem('fullName') || 'Tài khoản';

  const [unreadNewsCount, setUnreadNewsCount] = useState(0);
  const [totalNewsCount, setTotalNewsCount] = useState(0);

  useEffect(() => {
    const fetchNewsCount = async () => {
      try {
        const res = await getAllNews();
        const newsList = res.data || [];
        const currentTotal = newsList.length;
        setTotalNewsCount(currentTotal);
        
        const seenCount = parseInt(localStorage.getItem('seenNewsCount') || '0', 10);
        if (currentTotal > seenCount) {
          setUnreadNewsCount(currentTotal - seenCount);
        } else {
          setUnreadNewsCount(0);
        }
      } catch (err) {
        console.error('Failed to fetch news for badge', err);
      }
    };
    fetchNewsCount();
  }, [pathname]);

  const handleNewsClick = () => {
    localStorage.setItem('seenNewsCount', totalNewsCount.toString());
    setUnreadNewsCount(0);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  const contactItems = [
    { label: 'Kết nối với Barber Shop', href: '/contact-owner' },
    { label: 'Liên hệ với thợ để tư vấn', href: '/choose-barber' },
  ];

  const serviceItems = [
    { label: 'Tất cả Dịch vụ', href: '/services' },
    { label: 'Dịch vụ Nam', href: '/services/nam' },
    { label: 'Dịch vụ cho Nữ', href: '/services/nu' }
  ];

  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-primary/95 backdrop-blur-sm py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 md:gap-4 cursor-pointer z-50 group">
            <img 
              src="/images/logo.png" 
              alt="Hornet Royale Logo" 
              className="h-[52px] md:h-[64px] w-auto object-contain mix-blend-screen brightness-110 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-transform duration-500 group-hover:scale-105" 
            />
            <span className="font-heading text-[1.3rem] md:text-2xl font-black tracking-[0.15em] uppercase text-white mt-1">
              HORNET <span className="text-accent drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">ROYALE</span>
            </span>
          </Link>

          {/* Desktop Menu - Show from lg (1024px) upwards */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/#home" className="text-gray-300 hover:text-accent uppercase tracking-wider text-[12px] font-medium transition-colors">
              Trang chủ
            </Link>
            
            <ServiceMenu />
            
            <ProductMenu />
            
            <Link to="/booking" className="text-gray-300 hover:text-accent uppercase tracking-wider text-[12px] font-medium transition-colors">
              Đặt lịch
            </Link>
            
            <Link to="/kienthuc" className="text-gray-300 hover:text-accent uppercase tracking-wider text-[12px] font-medium transition-colors">
              Kiến Thức
            </Link>
            
            <Link 
              to="/news" 
              onClick={handleNewsClick}
              className={`relative uppercase tracking-wider text-[12px] font-medium transition-colors ${pathname === '/news' ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}
            >
              Tin Tức
              {unreadNewsCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[9px] font-bold h-[16px] min-w-[16px] px-1 rounded-full flex items-center justify-center border border-[#111] animate-pulse">
                  {unreadNewsCount}
                </span>
              )}
            </Link>
            
            <Dropdown title="Liên hệ" items={contactItems} linkPath="/#contact" />

            {/* Icon Thông báo */}
            <NavbarNotifications />

            {/* Icon Giỏ Hàng */}
            <Link to="/cart" className="relative text-gray-300 hover:text-accent transition-colors flex items-center pr-2">
              <ShoppingCart className="h-6 w-6" />
              {cartDistinctCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-primary">
                  {cartDistinctCount}
                </span>
              )}
            </Link>

            {/* Auth Premium Button */}
            <Link to={isLoggedIn ? '/profile' : '/login'} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold uppercase tracking-wider text-[10px] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] relative overflow-hidden group whitespace-nowrap">
              <span className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full transition-transform duration-500 group-hover:translate-x-full z-0"></span>
              <User className="h-4 w-4 relative z-10" />
              <span className="relative z-10">{isLoggedIn ? fullName : 'Tài khoản'}</span>
            </Link>
          </div>

          {/* Mobile Menu Button + Cart */}
          <div className="lg:hidden flex items-center gap-4 z-50">
            <NavbarNotifications />
            <Link to="/cart" className="relative text-gray-300 hover:text-accent transition-colors flex items-center">
              <ShoppingCart className="h-6 w-6" />
              {cartDistinctCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-primary">
                  {cartDistinctCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-accent focus:outline-none bg-[#1a1a1a] p-2 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-0 left-0 w-full min-h-screen bg-[#0a0a0a] transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0 opacity-100 z-40' : '-translate-x-full opacity-0 z-0'}`}>
        <div className="pt-24 px-6 pb-6 space-y-4 overflow-y-auto h-full">
          <Link to="/#home" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-gray-300 hover:text-accent uppercase tracking-wider text-sm font-bold border-b border-[#222]">
            Trang chủ
          </Link>
          <div className="py-2 border-b border-[#222]">
            <div 
              className="flex justify-between items-center py-2 cursor-pointer text-gray-300 hover:text-accent"
              onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
            >
              <span className="uppercase tracking-wider text-sm font-bold">Dịch vụ</span>
              <svg className={`w-4 h-4 transition-transform duration-300 ${isServicesMenuOpen ? 'rotate-180 text-accent' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${isServicesMenuOpen ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="pl-4 space-y-3 pb-3">
                {serviceItems.map((item, index) => (
                  <Link key={index} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`block text-sm ${index === 0 ? 'text-accent font-bold' : 'text-gray-400 hover:text-white font-medium'}`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="py-2 border-b border-[#222]">
            <div 
              className="flex justify-between items-center py-2 cursor-pointer text-gray-300 hover:text-accent"
              onClick={() => setIsProductsMenuOpen(!isProductsMenuOpen)}
            >
              <span className="uppercase tracking-wider text-sm font-bold">Sản phẩm</span>
              <svg className={`w-4 h-4 transition-transform duration-300 ${isProductsMenuOpen ? 'rotate-180 text-accent' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${isProductsMenuOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="pl-4 space-y-3 pb-3">
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block text-accent hover:text-white text-sm font-bold">
                  Tất cả sản phẩm
                </Link>
                {productCategories.map(cat => (
                  <Link key={cat.slug} to={`/products/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-400 hover:text-white text-sm font-medium">
                    {cat.name}
                  </Link>
                ))}
                
                <div className="pt-2 mt-2 border-t border-[#333] space-y-3">
                  <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Nổi bật</span>
                  {highlightMenu.map(item => {
                    const colorClass = item.slug === 'sale' ? 'text-red-500' : item.slug === 'best-seller' ? 'text-yellow-400' : 'text-blue-400';
                    return (
                      <Link key={item.slug} to={`/products/${item.slug}`} onClick={() => setIsMobileMenuOpen(false)} className={`block ${colorClass} hover:opacity-80 text-sm font-medium`}>
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-gray-300 hover:text-accent uppercase tracking-wider text-sm font-bold border-b border-[#222]">
            Đặt lịch
          </Link>
          <Link to="/kienthuc" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-gray-300 hover:text-accent uppercase tracking-wider text-sm font-bold border-b border-[#222]">
            Kiến Thức
          </Link>
          <Link 
            to="/news" 
            onClick={handleNewsClick} 
            className="flex items-center gap-2 py-3 text-gray-300 hover:text-accent uppercase tracking-wider text-sm font-bold border-b border-[#222]"
          >
            Tin Tức
            {unreadNewsCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center">
                {unreadNewsCount}
              </span>
            )}
          </Link>
          <div className="py-2 border-b border-[#222]">
            <div 
              className="flex justify-between items-center py-2 cursor-pointer text-gray-300 hover:text-accent"
              onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
            >
              <span className="uppercase tracking-wider text-sm font-bold">Liên hệ</span>
              <svg className={`w-4 h-4 transition-transform duration-300 ${isContactMenuOpen ? 'rotate-180 text-accent' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${isContactMenuOpen ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="pl-4 space-y-4 pb-3">
                <Link to="/contact-owner" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-400 hover:text-white text-sm font-medium">
                  Kết nối với Barber Shop
                </Link>
                <Link to="/choose-barber" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-400 hover:text-white text-sm font-medium">
                  Liên hệ với thợ để tư vấn
                </Link>
              </div>
            </div>
          </div>
          <Link to={isLoggedIn ? '/profile' : '/login'} onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 text-center text-primary bg-gradient-to-r from-accent to-yellow-600 rounded-xl uppercase tracking-wider text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-8">
            {isLoggedIn ? fullName : 'Đăng nhập / Đăng ký'}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;

import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors, User, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Dropdown from './Dropdown';
import ProductMenu from './ProductMenu';
import { useCart } from '../context/CartContext';
import NavbarNotifications from './NavbarNotifications';

const AboutNavbar = () => {
  const { cartItems } = useCart();
  const cartDistinctCount = cartItems.length;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const fullName = localStorage.getItem('fullName') || 'Tài khoản';

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

  const navLinks = [
    { label: 'Trang chủ', href: '/#home' },
    { label: 'Dịch vụ', href: '/services' },
    { label: 'Sản phẩm', isProduct: true },
    { label: 'Đặt lịch', href: '/booking' },
    { label: 'Kiến Thức', href: '/kienthuc' },
    { label: 'Liên hệ', isDropdown: true },
    { label: 'Về chúng tôi', href: '/about' },
  ];

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl py-3 border-b border-white/5 shadow-2xl' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-14">
          
          {/* 1. LOGO SECTION (Left) */}
          <div className="flex-shrink-0 w-auto md:w-[260px]">
            <Link to="/" className="flex items-center gap-3 md:gap-4 group">
              <img 
                src="/images/logo.png" 
                alt="Hornet Royale Logo" 
                className="h-[52px] md:h-[64px] object-contain mix-blend-screen brightness-110 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-transform duration-500 group-hover:scale-105" 
              />
              <span className="font-heading text-[1.3rem] md:text-2xl font-black text-white tracking-[0.15em] uppercase mt-1">
                HORNET <span className="text-accent drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">ROYALE</span>
              </span>
            </Link>
          </div>

          {/* 2. MENU SECTION (Center) */}
          <div className="hidden xl:flex items-center justify-center flex-grow px-4">
            <div className="flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href || (link.href?.startsWith('/#') && hash === link.href.substring(1));
                
                if (link.isProduct) return <ProductMenu key={idx} />;
                if (link.isDropdown) return <Dropdown key={idx} title="Liên hệ" items={contactItems} linkPath="/#contact" />;
                
                return (
                  <Link 
                    key={idx} 
                    to={link.href} 
                    className={`relative px-4 py-2 text-[13px] font-bold uppercase tracking-[1.5px] transition-all duration-300 whitespace-nowrap group ${
                      isActive ? 'text-accent' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {/* Hover Underline Glow */}
                    <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-accent transform transition-transform duration-500 origin-left ${
                      isActive ? 'scale-x-100 shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. ACTIONS SECTION (Right) */}
          <div className="hidden xl:flex items-center justify-end space-x-6 w-[320px]">
            {/* Notifications */}
            <NavbarNotifications />

            {/* Cart Icon */}
            <Link to="/cart" className="relative group p-2 text-gray-400 hover:text-accent transition-colors">
              <ShoppingCart className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
              {cartDistinctCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-primary text-[10px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-[#000] shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                  {cartDistinctCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            <Link 
              to={isLoggedIn ? '/profile' : '/login'} 
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-accent/5 text-white transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <User className="h-4.5 w-4.5 text-accent relative z-10" />
              <span className="text-[12px] font-black uppercase tracking-wider relative z-10 group-hover:text-accent transition-colors">
                {isLoggedIn ? fullName : 'Đăng nhập'}
              </span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="xl:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-gray-400 hover:text-accent p-2">
              <ShoppingCart className="h-6 w-6" />
              {cartDistinctCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-primary text-[10px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-[#000]">
                  {cartDistinctCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white bg-white/5 p-2.5 rounded-xl border border-white/10 hover:border-accent/50 transition-all"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-accent" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`xl:hidden fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl transition-all duration-500 ${
        isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="pt-32 px-8 flex flex-col space-y-6 h-full overflow-y-auto pb-20">
          {navLinks.map((link, idx) => {
            if (link.isProduct || link.isDropdown) return null; // Simplified for mobile
            return (
              <Link 
                key={idx} 
                to={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-heading font-black text-white hover:text-accent transition-colors uppercase tracking-widest border-b border-white/5 pb-4"
              >
                {link.label}
              </Link>
            );
          })}
          {/* Add product and contact explicitly for mobile if needed, or keep simple */}
          <Link 
            to={isLoggedIn ? '/profile' : '/login'} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-4 mt-10 rounded-2xl bg-accent text-primary font-black text-center uppercase tracking-widest"
          >
            {isLoggedIn ? fullName : 'Đăng nhập / Đăng ký'}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AboutNavbar;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ContactOwner from './pages/ContactOwner';
import ChooseBarber from './pages/ChooseBarber';
import ContactBarber from './pages/ContactBarber';
import AllServices from './pages/AllServices';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import PaymentReturn from './pages/PaymentReturn';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './pages/BookingSuccess';
import AboutPage from './pages/AboutPage';
import BookingHistory from './pages/BookingHistory';
import BookingDetail from './pages/BookingDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Knowledge from './pages/Knowledge';
import KnowledgeDetail from './pages/KnowledgeDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Session management for "Remember Me"
    const token = localStorage.getItem('token');
    const remembered = localStorage.getItem('rememberMe');
    const tempSession = sessionStorage.getItem('tempSession');
    
    if (token && !remembered && !tempSession) {
      // Not remembered and new session -> log out
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('fullName');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    } else if (token && !remembered) {
      // Not remembered but continuing current session
      sessionStorage.setItem('tempSession', 'true');
    }

    // --- GLOBAL INTERCEPTORS FOR BLOCKED ACCOUNTS ---
    // 1. Axios Interceptor
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 403) {
          const data = error.response.data;
          if (data && data.message === 'Tài khoản của bạn đã bị khóa.') {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login?blocked=true&reason=' + encodeURIComponent(data.reason || 'Vi phạm chính sách');
          }
        }
        return Promise.reject(error);
      }
    );

    // 2. Fetch Interceptor
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.status === 403) {
          const cloned = response.clone();
          cloned.json().then(data => {
            if (data && data.message === 'Tài khoản của bạn đã bị khóa.') {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = '/login?blocked=true&reason=' + encodeURIComponent(data.reason || 'Vi phạm chính sách');
            }
          }).catch(e => {});
        }
        return response;
      } catch (err) {
        throw err;
      }
    };

    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <Router>
      <ToastProvider>
        <CartProvider>
          <div className="min-h-screen bg-primary flex flex-col font-body">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact-owner" element={<ContactOwner />} />
            <Route path="/choose-barber" element={<ChooseBarber />} />
            <Route path="/contact-barber/:id" element={<ContactBarber />} />
            <Route path="/services" element={<AllServices />} />
            <Route path="/services/:type" element={<AllServices />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/payment-return" element={<PaymentReturn />} />
            <Route path="/payment- return" element={<PaymentReturn />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/booking-detail/:id" element={<BookingDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/kienthuc" element={<Knowledge />} />
            <Route path="/kienthuc/:slug" element={<KnowledgeDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>
        
        <Footer />
        <ChatBot />
      </div>
      </CartProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;

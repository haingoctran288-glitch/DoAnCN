import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';

/**
 * Trang Quên Mật Khẩu - Bước 1: Nhập email để nhận OTP
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gọi API gửi OTP tới email
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });

      // Chuyển sang trang nhập OTP, truyền email qua state
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      const message = err.response?.data?.message || 'Không thể gửi OTP! Vui lòng thử lại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-card p-10 rounded-2xl border border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mt-10 -mr-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mb-10 -ml-10"></div>

        <div className="text-center mb-8 relative z-10">
          {/* Icon email */}
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/30">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Quên Mật Khẩu</h2>
          <div className="w-12 h-1 bg-accent mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Nhập email để nhận mã xác nhận (OTP)</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Email</label>
            <input type="email" required
              className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-accent text-primary font-bold py-3.5 px-4 rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-300 uppercase tracking-widest hover:-translate-y-0.5 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <Link to="/login" className="text-sm text-gray-400 hover:text-accent transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, CheckCircle } from 'lucide-react';

/**
 * Trang Đặt Lại Mật Khẩu - Bước 3: Nhập mật khẩu mới
 */
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy email từ trang VerifyOtp
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate mật khẩu
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp!');
      return;
    }

    setLoading(true);

    try {
      // Gọi API đặt lại mật khẩu
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        email,
        newPassword,
      });

      setSuccess(true);

      // Chuyển về trang login sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || 'Đặt lại mật khẩu thất bại!';
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

        {success ? (
          /* Giao diện thành công */
          <div className="text-center relative z-10 py-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-3">Thành Công!</h2>
            <p className="text-gray-400 text-sm">Mật khẩu đã được đặt lại.<br />Đang chuyển về trang đăng nhập...</p>
          </div>
        ) : (
          /* Form đặt lại mật khẩu */
          <>
            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/30">
                <Lock className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-white mb-2">Mật Khẩu Mới</h2>
              <div className="w-12 h-1 bg-accent mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm">Tạo mật khẩu mới cho tài khoản của bạn</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center relative z-10">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Mật khẩu mới</label>
                <input type="password" required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Xác nhận mật khẩu</label>
                <input type="password" required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-accent text-primary font-bold py-3.5 px-4 rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-300 uppercase tracking-widest hover:-translate-y-0.5 shadow-lg shadow-accent/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

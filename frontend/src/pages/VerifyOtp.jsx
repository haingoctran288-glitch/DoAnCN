import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import OTPInput from '../components/OTPInput';

/**
 * Trang Xác Nhận OTP - Bước 2: Nhập mã 6 số đã gửi qua email
 */
const VerifyOtp = () => {
  // State OTP dạng mảng 6 phần tử
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy email từ trang trước (ForgotPassword truyền qua state)
  const email = location.state?.email || '';

  // Nếu không có email → redirect về forgot-password
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  /**
   * Callback nhận mảng OTP mới từ OTPInput component
   */
  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setCountdown(120);
      setSuccess('Mã OTP mới đã được gửi đến email của bạn!');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi lại OTP! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Join mảng thành string
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đủ 6 số!');
      return;
    }

    setLoading(true);

    try {
      // Gọi API xác nhận OTP
      await axios.post('http://localhost:8080/api/auth/verify-otp', {
        email,
        otp: otpCode,
      });

      // OTP hợp lệ → chuyển sang trang đặt lại mật khẩu
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      const message = err.response?.data?.message || 'Mã OTP không hợp lệ!';
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
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/30">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Nhập Mã OTP</h2>
          <div className="w-12 h-1 bg-accent mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">
            Mã xác nhận 6 số đã được gửi tới<br />
            <span className="text-accent font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center relative z-10">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-sm text-center relative z-10">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Component OTPInput tách riêng */}
          <OTPInput value={otp} onChange={handleOtpChange} />

          <div className="text-center text-sm">
            {countdown > 0 ? (
              <span className="text-gray-400">Mã OTP sẽ hết hạn sau: <strong className="text-accent font-mono">{countdown}s</strong></span>
            ) : (
              <button type="button" onClick={handleResendOtp} className="text-accent hover:underline font-bold">[Gửi lại mã OTP]</button>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-accent text-primary font-bold py-3.5 px-4 rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-300 uppercase tracking-widest hover:-translate-y-0.5 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xác nhận...' : 'Xác nhận OTP'}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-accent transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Quay lại nhập email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

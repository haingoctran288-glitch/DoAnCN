import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck } from 'lucide-react';
import axios from 'axios';

/**
 * Modal đổi mật khẩu - Tích hợp xác thực OTP + chức năng Quên mật khẩu
 */
const ChangePassModal = ({ isOpen, onClose, email }) => {
  const [mode, setMode] = useState('change'); // 'change' (đổi mật khẩu) hoặc 'forgot' (quên mật khẩu)
  const [step, setStep] = useState(1); // 1: nhập pass, 2: xác nhận OTP
  const [formData, setFormData] = useState({ oldPass: '', newPass: '', confirmPass: '', otp: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Reset modal state when it is opened/closed
  useEffect(() => {
    if (!isOpen) {
      setMode('change');
      setStep(1);
      setFormData({ oldPass: '', newPass: '', confirmPass: '', otp: '' });
      setError('');
      setSuccess('');
      setCountdown(0);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  // Gửi OTP cho chế độ Đổi mật khẩu
  const sendChangeOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/api/auth/change-password/send-otp',
        {
          oldPassword: formData.oldPass,
          newPassword: formData.newPass
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCountdown(120);
      setSuccess('Mã OTP xác nhận đã được gửi đến email của bạn!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi OTP! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Gửi OTP cho chế độ Quên mật khẩu
  const sendForgotOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setCountdown(120);
      setSuccess('Mã OTP đã được gửi đến email để đặt lại mật khẩu!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi mã OTP! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Nút gửi lại OTP (Step 2)
  const handleResendOtp = () => {
    if (mode === 'change') {
      sendChangeOtp();
    } else {
      sendForgotOtp();
    }
  };

  // Gửi yêu cầu ở Step 1
  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPass !== formData.confirmPass) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (formData.newPass.length < 6) {
      setError('Mật khẩu mới phải từ 6 ký tự.');
      return;
    }

    if (mode === 'change') {
      sendChangeOtp();
    } else {
      sendForgotOtp();
    }
  };

  // Khi click "Quên mật khẩu?" ở Step 1
  const handleForgotPasswordClick = () => {
    setError('');
    setSuccess('');
    if (!email || !email.includes('@')) {
      setError('Tài khoản của bạn chưa được liên kết email hợp lệ!');
      return;
    }
    setMode('forgot');
  };

  // Gửi yêu cầu ở Step 2
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.otp.length !== 6) {
      setError('Vui lòng nhập đủ 6 số OTP!');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'change') {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:8080/api/auth/change-password',
          {
            oldPassword: formData.oldPass,
            newPassword: formData.newPass,
            otp: formData.otp
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccess(response.data.message || 'Đổi mật khẩu thành công!');
        setFormData({ oldPass: '', newPass: '', confirmPass: '', otp: '' });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Quên mật khẩu
        // 1. Xác nhận OTP trước
        await axios.post('http://localhost:8080/api/auth/verify-otp', {
          email,
          otp: formData.otp
        });
        // 2. Đặt lại mật khẩu mới
        const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
          email,
          newPassword: formData.newPass
        });
        setSuccess(response.data.message || 'Đặt lại mật khẩu thành công!');
        setFormData({ oldPass: '', newPass: '', confirmPass: '', otp: '' });
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-heading font-bold text-white">
            {mode === 'change' ? 'Đổi Mật Khẩu' : 'Đặt Lại Mật Khẩu'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-accent transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center">{error}</div>}
            {success && <div className="p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-sm text-center">{success}</div>}

            {mode === 'change' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Mật khẩu cũ</label>
                <input
                  type="password"
                  required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  value={formData.oldPass}
                  onChange={(e) => setFormData({ ...formData, oldPass: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {mode === 'change' ? 'Mật khẩu mới' : 'Mật khẩu mới muốn đặt'}
              </label>
              <input
                type="password"
                required
                className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.newPass}
                onChange={(e) => setFormData({ ...formData, newPass: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Xác nhận mật khẩu</label>
              <input
                type="password"
                required
                className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.confirmPass}
                onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })}
              />
            </div>

            <div className="flex justify-end text-sm">
              {mode === 'change' ? (
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-accent hover:underline font-medium"
                >
                  Quên mật khẩu?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode('change')}
                  className="text-accent hover:underline font-medium"
                >
                  Quay lại đổi mật khẩu
                </button>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 bg-transparent border border-gray-700 text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold py-3 px-4 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 uppercase tracking-wider text-sm transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Key className="w-4 h-4" /> {loading ? '...' : 'Tiếp tục'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="p-6 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-accent/20">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-gray-300">
                Mã xác thực OTP đã được gửi đến email:<br />
                <span className="text-accent font-semibold">{email}</span>
              </p>
            </div>

            {error && <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center">{error}</div>}
            {success && <div className="p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-sm text-center">{success}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide text-center">Mã xác thực OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent text-center tracking-widest text-xl font-bold font-mono"
                placeholder="------"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              />
              <div className="text-right mt-2 text-xs">
                {countdown > 0 ? (
                  <span className="text-gray-400">Mã OTP sẽ hết hạn sau: <strong className="text-accent">{countdown}s</strong></span>
                ) : (
                  <button type="button" onClick={handleResendOtp} className="text-accent hover:underline font-bold">[Gửi lại mã OTP]</button>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-transparent border border-gray-700 text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors uppercase text-sm"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold py-3 px-4 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 uppercase tracking-wider text-sm transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                Xác nhận
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassModal;

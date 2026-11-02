import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Send, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

/**
 * Modal đổi mật khẩu - Quy trình chuẩn bảo mật:
 * Bước 1: Gửi và xác thực mã OTP qua Email trước
 * Bước 2: Sau khi OTP hợp lệ mới cho phép nhập và đổi mật khẩu mới
 */
const ChangePassModal = ({ isOpen, onClose, email }) => {
  const [mode, setMode] = useState('change'); // 'change' (đổi mật khẩu) hoặc 'forgot' (quên mật khẩu cũ)
  const [step, setStep] = useState(1); // 1: xác nhận OTP trước, 2: nhập mật khẩu mới
  const [formData, setFormData] = useState({ oldPass: '', newPass: '', confirmPass: '', otp: '' });
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Gửi OTP đến email của khách hàng
  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setError('Tài khoản của bạn chưa được liên kết email hợp lệ!');
      return;
    }
    setError('');
    setSuccess('');
    setSendingOtp(true);
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setOtpSent(true);
      setCountdown(120);
      setSuccess('Mã OTP xác thực đã được gửi đến email của bạn!');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi mã OTP! Vui lòng thử lại.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Reset modal state when it is opened/closed, và tự động gửi OTP khi mở modal
  useEffect(() => {
    if (!isOpen) {
      setMode('change');
      setStep(1);
      setFormData({ oldPass: '', newPass: '', confirmPass: '', otp: '' });
      setShowPass({ old: false, new: false, confirm: false });
      setError('');
      setSuccess('');
      setOtpSent(false);
      setCountdown(0);
    } else {
      handleSendOtp();
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

  // Bước 1: Kiểm tra mã OTP trước
  const handleVerifyOtpStep = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.otp || formData.otp.trim().length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã OTP!');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/verify-otp', {
        email,
        otp: formData.otp.trim()
      });
      setSuccess('Xác thực OTP thành công! Vui lòng nhập mật khẩu mới.');
      setError('');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn!');
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Đổi mật khẩu sau khi đã xác thực OTP thành công
  const handleChangePasswordStep = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPass !== formData.confirmPass) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (formData.newPass.length < 6) {
      setError('Mật khẩu mới phải từ 6 ký tự trở lên.');
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
            otp: formData.otp.trim()
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccess(response.data.message || 'Đổi mật khẩu thành công!');
      } else {
        const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
          email,
          newPassword: formData.newPass
        });
        setSuccess(response.data.message || 'Đặt lại mật khẩu thành công!');
      }

      setFormData({ oldPass: '', newPass: '', confirmPass: '', otp: '' });
      setTimeout(() => {
        onClose();
      }, 1500);
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
            {step === 1
              ? 'Xác Thực OTP Đổi Mật Khẩu'
              : mode === 'change'
                ? 'Đổi Mật Khẩu Mới'
                : 'Đặt Lại Mật Khẩu'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-accent transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleVerifyOtpStep} className="p-6 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-accent/20">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Để bảo vệ tài khoản, vui lòng nhập mã xác thực OTP đã được gửi đến email:<br />
                <span className="text-accent font-semibold">{email || 'Chưa liên kết email'}</span>
              </p>
            </div>

            {error && <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center">{error}</div>}
            {success && <div className="p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-sm text-center">{success}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide text-center">
                Mã xác thực OTP (6 chữ số)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                disabled={sendingOtp}
                className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent text-center tracking-widest text-xl font-bold font-mono"
                placeholder="------"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
              />
              <div className="text-right mt-2 text-xs">
                {sendingOtp ? (
                  <span className="text-accent">Đang gửi mã OTP đến email...</span>
                ) : countdown > 0 ? (
                  <span className="text-gray-400">
                    Mã OTP sẽ hết hạn sau: <strong className="text-accent">{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-accent hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> {otpSent ? '[Gửi lại mã OTP]' : '[Nhận mã OTP]'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 bg-transparent border border-gray-700 text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || sendingOtp}
                className="w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold py-3 px-4 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 uppercase tracking-wider text-sm transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" /> {loading ? 'Đang kiểm tra...' : 'Xác nhận OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePasswordStep} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center">{error}</div>}
            {success && <div className="p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-sm text-center">{success}</div>}

            {mode === 'change' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Mật khẩu cũ</label>
                <div className="relative">
                  <input
                    type={showPass.old ? 'text' : 'password'}
                    required
                    className="w-full bg-primary border border-gray-700 rounded-lg py-3 pl-4 pr-11 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    value={formData.oldPass}
                    onChange={(e) => setFormData({ ...formData, oldPass: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass({ ...showPass, old: !showPass.old })}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-accent transition-colors"
                    tabIndex={-1}
                  >
                    {showPass.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {mode === 'change' ? 'Mật khẩu mới' : 'Mật khẩu mới muốn đặt'}
              </label>
              <div className="relative">
                <input
                  type={showPass.new ? 'text' : 'password'}
                  required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 pl-4 pr-11 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  value={formData.newPass}
                  onChange={(e) => setFormData({ ...formData, newPass: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-accent transition-colors"
                  tabIndex={-1}
                >
                  {showPass.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass.confirm ? 'text' : 'password'}
                  required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 pl-4 pr-11 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  value={formData.confirmPass}
                  onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-accent transition-colors"
                  tabIndex={-1}
                >
                  {showPass.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              {mode === 'change' ? (
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('forgot');
                  }}
                  className="text-accent hover:underline font-medium"
                >
                  Quên mật khẩu cũ?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('change');
                  }}
                  className="text-accent hover:underline font-medium"
                >
                  Quay lại nhập mật khẩu cũ
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
                <Key className="w-4 h-4" /> {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassModal;

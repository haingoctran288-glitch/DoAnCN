import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '',
    fullName: '', 
    email: '',
    birthday: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleNextStep = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setSuccess('');

    if (step === 1) {
      // Validate email
      if (!isValidEmail(formData.email)) {
        setError('Email không hợp lệ! Vui lòng nhập đúng format email.');
        return;
      }

      if (formData.username.length < 6 || formData.password.length < 6) {
        setError('Tài khoản và mật khẩu phải từ 6 ký tự trở lên!');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp!');
        return;
      }

      if (!formData.birthday) {
        setError('Vui lòng chọn ngày sinh!');
        return;
      }
    }

    setOtpLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register/send-otp', {
        email: formData.email,
      });
      setCountdown(120);
      setSuccess(step === 2 ? 'Mã OTP mới đã được gửi đến email của bạn!' : 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi OTP. Vui lòng thử lại!');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.otp) {
      setError('Vui lòng nhập mã OTP đã nhận qua email!');
      return;
    }

    setLoading(true);

    try {
      // Gọi API đăng ký
      await axios.post('http://localhost:8080/api/auth/register', {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        birthday: formData.birthday,
        otp: formData.otp
      });

      setSuccess('Đăng ký thành công! Đang đăng nhập...');

      // Đăng ký thành công → tự động đăng nhập
      const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
        username: formData.username,
        password: formData.password,
      });

      // Lưu token vào localStorage
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('userId', loginRes.data.id);
      localStorage.setItem('fullName', loginRes.data.fullName);
      localStorage.setItem('role', loginRes.data.role);

      const userObj = {
        id: loginRes.data.id,
        fullName: loginRes.data.fullName,
        role: loginRes.data.role,
        branch: loginRes.data.branch
      };
      localStorage.setItem('user', JSON.stringify(userObj));

      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-card p-10 rounded-2xl border border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mt-10 -mr-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mb-10 -ml-10"></div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Đăng Ký</h2>
          <div className="w-12 h-1 bg-accent mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Gia nhập cộng đồng Barber Shop</p>
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

        <form onSubmit={step === 1 ? handleNextStep : handleFinalSubmit} className="space-y-5 relative z-10">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Họ và tên</label>
                <input type="text" required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Tên đăng nhập</label>
                <input type="text" required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  placeholder="Nhập username (tối thiểu 6 ký tự)"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Email đăng ký</label>
                <input type="email" required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  placeholder="Nhập email hợp lệ"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Ngày sinh</label>
                <input type="date" required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Mật khẩu</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required
                    className="w-full bg-primary border border-gray-700 rounded-lg py-3 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                    placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} required
                    className="w-full bg-primary border border-gray-700 rounded-lg py-3 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={otpLoading}
                className="w-full bg-accent text-primary font-bold py-3.5 px-4 rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-300 uppercase tracking-widest hover:-translate-y-0.5 shadow-lg shadow-accent/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading ? 'Đang gửi mã...' : 'Đăng ký'}
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Mã xác thực OTP</label>
                <input type="text" required
                  maxLength={6}
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 text-center tracking-widest text-2xl font-bold"
                  placeholder="------"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
                <div className="text-right mt-2 text-sm">
                  {countdown > 0 ? (
                    <span className="text-gray-400">Mã OTP sẽ hết hạn sau: {countdown}s</span>
                  ) : (
                    <button type="button" onClick={handleNextStep} className="text-accent hover:underline font-bold">[Gửi lại mã OTP]</button>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setStep(1)} disabled={loading}
                  className="flex-1 bg-transparent border border-gray-600 text-gray-300 font-bold py-3.5 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 uppercase disabled:opacity-50"
                >
                  Quay lại
                </button>
                <button type="submit" disabled={loading}
                  className="flex-[2] bg-accent text-primary font-bold py-3.5 px-4 rounded-lg hover:bg-accent/90 transition-all duration-300 uppercase tracking-widest shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận OTP'}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-sm text-gray-400">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-accent hover:text-white font-medium transition-colors">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

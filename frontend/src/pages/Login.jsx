import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [blockedReason, setBlockedReason] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('blocked') === 'true') {
      const reason = searchParams.get('reason') || 'Vi phạm chính sách';
      setBlockedReason(reason);
      window.history.replaceState(null, '', '/login');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.username.length < 3 || formData.password.length < 6) {
      setError('Tài khoản phải từ 3 ký tự và mật khẩu từ 6 ký tự trở lên!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('role', response.data.role);
      
      // Save user object for branch and role lookup in frontend
      const userObj = {
        id: response.data.id,
        fullName: response.data.fullName,
        role: response.data.role,
        branch: response.data.branch
      };
      localStorage.setItem('user', JSON.stringify(userObj));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
        sessionStorage.setItem('tempSession', 'true');
      }

      navigate('/profile');
    } catch (err) {
      if (err.response?.status === 403) {
        setBlockedReason(err.response?.data?.reason || 'Vi phạm điều khoản dịch vụ');
        return;
      }
      const message = err.response?.data?.message || 'Đăng nhập thất bại! Vui lòng thử lại.';
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
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Đăng Nhập</h2>
          <div className="w-12 h-1 bg-accent mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Chào mừng bạn quay lại Barber Shop</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Tên đăng nhập</label>
            <input type="text" required
              className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              placeholder="Nhập username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Mật khẩu</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required
                className="w-full bg-primary border border-gray-700 rounded-lg py-3 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                placeholder="Nhập mật khẩu"
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

          {/* Toggle Remember Me */}
          <div
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all duration-200 group"
            style={{
              background: rememberMe ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)',
              borderColor: rememberMe ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'
            }}
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Ghi nhớ đăng nhập</span>
              <span className="text-xs text-gray-500 mt-0.5">Tự đăng nhập lần sau khi mở lại</span>
            </div>
            {/* Toggle Switch */}
            <div
              className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300"
              style={{ background: rememberMe ? '#d4af37' : '#333' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: rememberMe ? '22px' : '2px' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-accent text-primary font-bold py-3.5 px-4 rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-300 uppercase tracking-widest hover:-translate-y-0.5 shadow-lg shadow-accent/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4 relative z-10">
          <div>
            {/* Link quên mật khẩu → trang ForgotPassword */}
            <Link to="/forgot-password" className="text-sm text-accent hover:text-white transition-colors font-medium">
              Quên mật khẩu?
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-accent hover:text-white font-medium transition-colors">Đăng ký</Link>
          </p>
        </div>
      </div>

      {/* Blocked Account Modal */}
      {blockedReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setBlockedReason(null)}></div>
          <div className="relative bg-[#1a1a1a] border border-red-500 rounded-2xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] w-full max-w-sm overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-red-500 blur-xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 className="text-red-500 text-lg font-bold uppercase tracking-wide m-0">Tài Khoản Bị Khóa</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Tài khoản của bạn đã bị khóa.
              <br/><br/>
              <strong>Lý do:</strong> {blockedReason}
              <br/><br/>
              Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ với HORNET ROYALE để được hỗ trợ.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setBlockedReason(null)}
                className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

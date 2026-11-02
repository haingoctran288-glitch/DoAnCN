import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Shield, Upload, Send, ArrowLeft, Star, User, MapPin, Award, X } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { getStaffById } from '../api/staff';
import ScrollToTop from '../components/ScrollToTop';
import ReviewList from '../components/ReviewList';

const BASE_URL = 'http://localhost:8080';

const ContactBarber = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      addToast({ title: 'Yêu Cầu Đăng Nhập', message: 'Để liên hệ với thợ cắt tóc, bạn cần đăng nhập tài khoản trước!', type: 'auth_warning' });
      navigate('/login');
      return;
    }

    const fetchBarberDetails = async () => {
      try {
        const data = await getStaffById(id);
        if (data) {
          setBarber(data);
        } else {
          navigate('/choose-barber');
        }
      } catch (error) {
        console.error('Failed to fetch barber details:', error);
        navigate('/choose-barber');
      } finally {
        setLoading(false);
      }
    };
    fetchBarberDetails();
  }, [id, navigate]);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
    return BASE_URL + avatar;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        addToast({ title: 'Lỗi', message: 'Kích thước file quá lớn (tối đa 50MB)', type: 'error' });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      addToast({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin.', type: 'error' });
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      addToast({ title: 'Lỗi', message: 'Bạn chưa đăng nhập.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedImageUrl = null;
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        const uploadRes = await axios.post(`${BASE_URL}/api/upload/chat-image`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImageUrl = uploadRes.data.url;
      }

      await axios.post(`${BASE_URL}/api/chats`, {
        userId: user.id,
        barberId: barber.id,
        name: formData.name,
        contact: user.username || user.phone || user.email || 'Khách hàng',
        message: formData.message,
        imageUrl: uploadedImageUrl
      });
      addToast({ title: 'Thành công', message: 'Đã gửi yêu cầu tư vấn cho thợ!', type: 'success' });
      setFormData({ name: '', message: '' });
      setSelectedFile(null);
      setPreviewUrl(null);
      navigate('/choose-barber');
    } catch (error) {
      console.error('Failed to send chat:', error);
      addToast({ title: 'Lỗi', message: 'Không thể gửi tin nhắn. Thử lại sau.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-primary flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!barber) return null;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-primary flex justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-2xl w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-accent hover:text-white transition-colors group relative z-10 mb-8"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-wider">Quay lại</span>
        </button>
        
        <div className="bg-card w-full p-8 md:p-12 rounded-2xl border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -mt-20 -mr-20"></div>

          {/* Barber Info Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 pb-8 border-b border-gray-800 relative z-10">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-accent shrink-0 bg-[#111] flex items-center justify-center">
              {barber.avatar ? (
                <img src={getAvatarUrl(barber.avatar)} alt={barber.name} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-gray-600" />
              )}
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-heading font-bold text-white mb-2">{barber.name}</h2>
              {barber.rating && barber.rating > 0 ? (
                <div className="flex items-center text-yellow-500 mb-3">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span className="font-bold text-white text-sm mr-2">{Number(barber.rating).toFixed(1)}</span>
                  <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded mr-3">Chuyên gia</span>
                  <button onClick={() => document.getElementById('barber-reviews')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs text-accent hover:underline uppercase font-bold tracking-wider">
                    Xem thêm đánh giá
                  </button>
                </div>
              ) : (
                <div className="mb-3 text-sm text-gray-500 italic tracking-wider">
                  Chưa có đánh giá
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                <div className="text-sm text-gray-400 sm:col-span-2 leading-snug">
                  <span className="text-gray-500 mr-2">Chuyên môn:</span> 
                  <span className="text-gray-200">{barber.specialty || 'Chưa cập nhật'}</span>
                </div>
                <div className="text-sm text-gray-400 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-gray-500 whitespace-nowrap">Chi nhánh:</span>
                  <span className="text-gray-200 leading-snug">{barber.branch || 'Chưa cập nhật'}</span>
                </div>
                <div className="text-sm text-gray-400 flex items-start gap-2">
                  <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-gray-200 leading-snug">{barber.experienceYears || 0} năm kinh nghiệm</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Thông tin tư vấn</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  placeholder="Ví dụ: Triệu Tử Long"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Mô tả ý tưởng tóc của bạn
              </label>
              <textarea
                required
                rows={4}
                className="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Ví dụ: Tôi muốn cắt kiểu Buzz cut kết hợp với nhuộm màu khói..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Đính kèm hình mẫu mong muốn
              </label>
              <div className="mt-1 flex justify-center px-6 py-10 border-2 border-gray-700 border-dashed rounded-lg bg-primary/50 hover:bg-primary hover:border-accent transition-all cursor-pointer group relative">
                {previewUrl ? (
                  <div className="relative inline-block">
                    <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg object-contain shadow-lg" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); removeFile(); }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-center">
                    <Upload className="mx-auto h-16 w-16 text-gray-500 group-hover:text-accent transition-colors" />
                    <div className="flex text-base text-gray-400 justify-center font-medium">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md text-accent hover:text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent px-2 py-1">
                        <span className="uppercase tracking-wider font-bold">Tải file lên</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1 py-1">hoặc kéo thả vào đây</p>
                    </div>
                    <p className="text-sm text-gray-500">PNG, JPG lên tới 50MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center text-accent/80 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Shield className="h-5 w-5 mr-3 shrink-0 text-accent" />
              <span className="text-sm font-medium">Vấn đề của bạn chúng tôi cam kết sẽ được bảo mật tuyệt đối!</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold py-4 px-8 rounded-lg transition-all duration-300 uppercase tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transform hover:-translate-y-1 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5 relative -top-0.5" />
              )}
              {isSubmitting ? 'Đang Gửi...' : 'Gửi Cho Thợ'}
            </button>
          </form>
        </div>
        
        <div id="barber-reviews" className="mt-8">
          <ReviewList type="barber" itemId={barber.id} />
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default ContactBarber;

// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Award, LogOut, Scissors, Package, Calendar, BellRing, Ticket, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Component imports
import RankTable from '../components/RankTable';
import AvatarUpload from '../components/profile/AvatarUpload';
import UserInfo from '../components/profile/UserInfo';
import HaircutStats from '../components/profile/HaircutStats';
import EditNameModal from '../components/profile/EditNameModal';
import ChangePassModal from '../components/profile/ChangePassModal';
import VoucherWalletModal from '../components/profile/VoucherWalletModal';
import CustomerChatHistoryModal from '../components/profile/CustomerChatHistoryModal';

const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    joinedDate: '',
    birthday: '',
    visits: 0,
    avatarUrl: null,
    role: '',
    isCodRestricted: false,
  });

  const [loading, setLoading] = useState(true);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [isVoucherWalletOpen, setIsVoucherWalletOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);

  // Gọi API lấy thông tin user khi trang load
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      // Chưa đăng nhập → quay về login
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Lấy profile
        const response = await axios.get('http://localhost:8080/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        // Lấy số lần đặt lịch thành công
        let visitsCount = 0;
        try {
          const vRes = await axios.get('http://localhost:8080/api/bookings/my-bookings/count', {
            headers: { Authorization: `Bearer ${token}` },
          });
          visitsCount = vRes.data;
        } catch (vErr) {
          console.warn('Lỗi lấy số lần đặt lịch:', vErr);
        }

        // Format ngày tạo tài khoản
        const date = new Date(data.createdAt);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        // Format ngày sinh
        let birthdayStr = '';
        if (data.birthday) {
          const bd = new Date(data.birthday);
          birthdayStr = `${bd.getDate().toString().padStart(2, '0')}/${(bd.getMonth() + 1).toString().padStart(2, '0')}/${bd.getFullYear()}`;
        }

        // Lấy avatar từ backend (đã lưu trong DB)
        let avatarUrl = null;
        if (data.avatar) {
          avatarUrl = data.avatar.startsWith('http') || data.avatar.startsWith('data:')
            ? data.avatar
            : `http://localhost:8080${data.avatar}`;
        }

        setUserData({
          name: data.fullName,
          email: data.email || data.username,
          rawEmail: data.email,
          phone: data.phone,
          joinedDate: formattedDate,
          birthday: birthdayStr,
          visits: visitsCount,
          avatarUrl: avatarUrl,
          role: data.role,
          isCodRestricted: data.isCashPaymentLocked || false,
        });
      } catch (err) {
        console.error('Lỗi lấy thông tin profile:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('fullName');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const increaseVisits = () => {
    setUserData((prev) => ({ ...prev, visits: prev.visits + 1 }));
  };

  const handleSaveName = (newName) => {
    setUserData((prev) => ({ ...prev, name: newName }));
  };

  const handleUploadAvatar = async (base64Url) => {
    try {
      const token = localStorage.getItem('token');
      // Convert base64 to File object
      const res = await fetch(base64Url);
      const blob = await res.blob();
      const file = new File([blob], 'avatar.png', { type: blob.type });

      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axios.post('http://localhost:8080/api/upload/user-avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const serverUrl = `http://localhost:8080${uploadRes.data.url}`;
      setUserData((prev) => ({ ...prev, avatarUrl: serverUrl }));
    } catch (err) {
      console.error('Lỗi upload avatar:', err);
      // Fallback: hiện ảnh tạm trên UI
      setUserData((prev) => ({ ...prev, avatarUrl: base64Url }));
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8080/api/upload/user-avatar', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData((prev) => ({ ...prev, avatarUrl: null }));
    } catch (err) {
      console.error('Lỗi xóa avatar:', err);
      setUserData((prev) => ({ ...prev, avatarUrl: null }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-primary flex items-center justify-center">
        <div className="text-accent text-xl font-heading animate-pulse">Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-primary px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Hồ Sơ Của Tuyệt Phẩm</h2>
          <div className="w-16 h-1 bg-accent mx-auto"></div>
        </div>

        {/* Thông báo khóa COD */}
        {userData.isCodRestricted && (
          <div className="bg-[#1a0f0f] border border-red-900/50 rounded-2xl p-5 mb-8 flex items-start gap-4">
            <div className="bg-red-500/10 p-3 rounded-full text-red-500 shrink-0">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-red-500 font-bold text-lg mb-1">Thông Báo Hệ Thống</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Xin chào quý khách. Hệ thống ghi nhận tài khoản của quý khách có lịch sử đặt hàng chưa thành công nhiều lần. 
                Vì vậy, tính năng <strong>Thanh toán khi nhận hàng (COD)</strong> đã bị tạm khóa.
                <br className="my-1"/>
                Quý khách vẫn có thể tiếp tục mua sắm bình thường bằng các hình thức thanh toán trực tuyến (VNPay, MoMo). 
                Hệ thống sẽ tự động xem xét và mở lại chức năng COD khi quý khách khôi phục mức độ uy tín qua các đơn hàng sắp tới. Cảm ơn quý khách đã đồng hành cùng Hornet Royale!
              </p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-8 md:p-12 border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mt-20 -mr-20"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center shrink-0">
              <AvatarUpload 
                avatarUrl={userData.avatarUrl} 
                onUpload={handleUploadAvatar} 
                onRemove={handleRemoveAvatar}
              />
            </div>

            {/* Main Info Section */}
            <div className="flex-grow w-full">
              <UserInfo 
                userData={userData} 
                onEditName={() => setIsEditNameOpen(true)}
                onChangePass={() => setIsChangePassOpen(true)}
              />

              {/* Badges / Stats */}
              <HaircutStats visits={userData.visits} />

               {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-8">
                <button
                  onClick={() => navigate('/booking-history')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-yellow-500 text-primary font-bold py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-wider"
                >
                  <Calendar className="w-5 h-5 relative -top-0.5" />
                  Lịch sử đặt lịch
                </button>
                 <button
                  onClick={() => navigate('/orders')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#222] to-[#111] border border-accent/40 hover:border-accent text-accent font-bold py-3.5 px-8 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-wider"
                >
                  <Package className="w-5 h-5" />
                  Lịch sử mua hàng
                </button>
                <button
                  onClick={() => setIsVoucherWalletOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#111] to-[#050505] border border-accent hover:border-accent/80 text-white font-bold py-3.5 px-8 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-wider"
                >
                  <Ticket className="w-5 h-5 text-accent" />
                  Ví Voucher của tôi
                </button>
                <button
                  onClick={() => setIsChatHistoryOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border border-accent/60 hover:border-accent text-white font-bold py-3.5 px-8 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-wider"
                >
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Lịch sử tư vấn
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a0f0f] to-[#110505] border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 text-red-400 font-bold py-3.5 px-8 rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-wider"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng Xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng Đặc Quyền */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-accent" />
            <h3 className="text-2xl font-bold text-white font-heading">Đặc Quyền Hội Viên</h3>
          </div>
          <RankTable currentVisitCount={userData.visits} />
        </div>
      </div>

      {/* Modals */}
      <EditNameModal 
        isOpen={isEditNameOpen} 
        currentName={userData.name} 
        onClose={() => setIsEditNameOpen(false)} 
        onSave={handleSaveName} 
      />
      
      <ChangePassModal 
        isOpen={isChangePassOpen} 
        onClose={() => setIsChangePassOpen(false)} 
        email={userData.rawEmail}
      />

      <VoucherWalletModal
        isOpen={isVoucherWalletOpen}
        onClose={() => setIsVoucherWalletOpen(false)}
        userId={localStorage.getItem('userId')}
      />

      <CustomerChatHistoryModal
        isOpen={isChatHistoryOpen}
        onClose={() => setIsChatHistoryOpen(false)}
      />
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, Scissors, User } from 'lucide-react';
import axios from 'axios';

const statusConfig = {
  PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  PAID: { label: 'Đã thanh toán', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  // Dynamic states
  WAITING: { label: 'Chờ thực hiện', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  IN_PROGRESS: { label: 'Đang thực hiện', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate));
        setBookings(sortedData);
      } catch (err) {
        console.error('Lỗi fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDynamicState = (booking) => {
    if (booking.status === 'CANCELLED') return 'CANCELLED';
    
    const now = new Date();
    // Start time
    const startStr = `${booking.bookingDate}T${booking.bookingTime}`;
    const startTime = new Date(startStr);
    
    // End time
    let endTime;
    if (booking.endTime) {
      endTime = new Date(`${booking.bookingDate}T${booking.endTime}`);
    } else {
      endTime = new Date(startTime.getTime() + (booking.duration || 30) * 60000);
    }
    
    if (now < startTime) return 'WAITING';
    if (now >= startTime && now <= endTime) return 'IN_PROGRESS';
    return 'COMPLETED';
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'ALL') return true;
    return getDynamicState(b) === activeTab;
  });

  return (
    <div className="min-h-screen pt-24 pb-32 bg-primary text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/profile')} className="relative z-50 flex w-fit items-center gap-2 text-accent hover:text-white mb-8 transition-colors group cursor-pointer">
          <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold uppercase tracking-wider text-sm">Quay lại hồ sơ</span>
        </button>

        <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-white flex items-center gap-3 mb-8">
          <span className="w-2 h-8 bg-accent block"></span>
          Lịch Sử Đặt Lịch
        </h1>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 custom-scrollbar">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'WAITING', label: 'Chờ thực hiện' },
            { id: 'IN_PROGRESS', label: 'Đang thực hiện' },
            { id: 'COMPLETED', label: 'Hoàn thành' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-accent text-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                  : 'bg-[#111] border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-[#111] rounded-2xl border border-gray-800">
            <p className="text-gray-400">Không có lịch hẹn nào trong mục này.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const dynamicState = getDynamicState(booking);
              const st = statusConfig[dynamicState] || statusConfig.PENDING;
              
              // Get all services names
              const renderServices = () => {
                if (booking.services && booking.services.length > 0) {
                  return booking.services.map(s => (
                    <span key={s.id} className="text-accent text-[11px] font-bold px-3 py-1 rounded-full border border-accent/30 bg-accent/5 whitespace-nowrap">
                      {s.name}
                    </span>
                  ));
                }
                return <span className="text-white font-bold text-lg leading-tight line-clamp-2">{booking.service?.name || 'Dịch vụ đã xóa'}</span>;
              };
              
              // Formatting time
              const startTimeStr = booking.bookingTime?.substring(0,5);
              const endTimeStr = booking.endTime?.substring(0,5) || (() => {
                 if (!booking.bookingTime) return '';
                 const [h, m] = booking.bookingTime.split(':').map(Number);
                 const d = new Date(2000, 0, 1, h, m + (booking.duration || 30));
                 return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              })();
              const timeDisplay = `${startTimeStr} - ${endTimeStr}`;
              return (
                <div key={booking.id} className="bg-[#111] rounded-2xl border border-gray-800 p-5 sm:p-6 hover:border-gray-700 transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors">
                        <Scissors className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="flex flex-wrap gap-1.5 pr-4 mb-2">
                          {renderServices()}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(booking.bookingDate)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {timeDisplay} ({booking.duration || 30}p)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${st.color} uppercase tracking-widest whitespace-nowrap text-center min-w-max`}>
                        {st.label}
                      </span>
                      <span className="text-xl font-bold text-accent">{booking.totalPrice?.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Thợ: <span className="text-white font-medium">{booking.staff?.name || 'Ngẫu nhiên'}</span></span>
                    </div>
                    <button
                      onClick={() => navigate(`/booking-detail/${booking.id}`)}
                      className="flex items-center gap-2 text-sm font-bold text-accent hover:text-white transition-colors"
                    >
                      <span>Xem chi tiết</span>
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, CreditCard, Scissors, FileText, BadgeCheck } from 'lucide-react';
import axios from 'axios';
import ReviewSection from '../components/ReviewSection';

const statusConfig = {
  PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  PAID: { label: 'Đã thanh toán', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  // Dynamic states
  WAITING: { label: 'Chờ thực hiện', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  IN_PROGRESS: { label: 'Đang thực hiện', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:8080/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooking(response.data);
      } catch (err) {
        console.error('Lỗi fetch booking detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex justify-center items-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-primary text-white">
        <h2 className="text-3xl font-bold mb-4 text-accent text-center">Không tìm thấy thông tin đặt lịch</h2>
        <button onClick={() => navigate('/booking-history')} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-bold transition-all">
          <ArrowLeft className="inline w-5 h-5 mr-2" /> Về lịch sử
        </button>
      </div>
    );
  }

  const getDynamicState = (b) => {
    if (b.status === 'CANCELLED') return 'CANCELLED';
    
    const now = new Date();
    const startStr = `${b.bookingDate}T${b.bookingTime}`;
    const startTime = new Date(startStr);
    
    let endTime;
    if (b.endTime) {
      endTime = new Date(`${b.bookingDate}T${b.endTime}`);
    } else {
      endTime = new Date(startTime.getTime() + (b.duration || 30) * 60000);
    }
    
    if (now < startTime) return 'WAITING';
    if (now >= startTime && now <= endTime) return 'IN_PROGRESS';
    return 'COMPLETED';
  };

  const dynamicState = getDynamicState(booking);
  const st = statusConfig[dynamicState] || statusConfig.PENDING;

  const renderServices = () => {
    if (booking.services && booking.services.length > 0) {
      return booking.services.map(s => (
        <span key={s.id} className="text-accent text-xs font-bold px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 whitespace-nowrap shadow-[0_0_10px_rgba(212,175,55,0.05)]">
          {s.name}
        </span>
      ));
    }
    return <span className="font-bold text-white text-lg leading-tight mb-1">{booking.service?.name || 'Dịch vụ đã xóa'}</span>;
  };
    
  const endTimeStr = booking.endTime?.substring(0,5) || (() => {
     if (!booking.bookingTime) return '';
     const [h, m] = booking.bookingTime.split(':').map(Number);
     const d = new Date(2000, 0, 1, h, m + (booking.duration || 30));
     return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  })();

  return (
    <div className="min-h-screen pt-24 pb-32 bg-primary text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/booking-history')} className="relative z-50 flex w-fit items-center gap-2 text-accent hover:text-white mb-8 transition-colors group cursor-pointer">
          <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold uppercase tracking-wider text-sm">Quay lại lịch sử</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-accent block"></span>
            Chi Tiết Lịch Hẹn #{booking.id}
          </h1>
          <span className={`text-sm font-bold px-4 py-2 rounded-full border self-start sm:self-auto whitespace-nowrap text-center ${st.color}`}>
            {st.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin dịch vụ */}
          <div className="bg-[#111] rounded-2xl border border-gray-800 p-6 shadow-lg">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-6 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-accent" /> Dịch vụ & Thợ
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Scissors className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {renderServices()}
                  </div>
                  <p className="text-accent font-semibold">{booking.totalPrice?.toLocaleString('vi-VN')}₫</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">Thợ thực hiện:</span>
                  <span className="text-white font-bold">{booking.staff?.name || 'Ngẫu nhiên'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BadgeCheck className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">Chi nhánh:</span>
                  <span className="text-white font-bold">{booking.staff?.branch || 'Chưa xác định'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thời gian & Thanh toán */}
          <div className="bg-[#111] rounded-2xl border border-gray-800 p-6 shadow-lg">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" /> Thời gian & Thanh toán
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="text-sm text-gray-400">Ngày đặt (chọn hẹn):</span>
                </div>
                <span className="font-bold text-white">{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-sm text-gray-400">Giờ hẹn & Tổng thời gian:</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{booking.bookingTime?.substring(0,5)} - {endTimeStr}</p>
                  <p className="text-xs text-gray-500">Tổng cộng {booking.duration || 30} phút</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-sm text-gray-400">Thời gian tạo đơn:</span>
                </div>
                <span className="font-bold text-white">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleString('vi-VN', { 
                    day: '2-digit', month: '2-digit', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  }) : 'Không rõ'}
                </span>
              </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">Thanh toán:</span>
                  </div>
                  {booking.paymentMethod === 'MOMO' ? (
                    <div className="flex items-center gap-2 bg-[#a50064] text-white px-3 py-1.5 rounded-lg border border-[#ff0099]/30 shadow-[0_0_10px_rgba(165,0,100,0.3)]">
                      <span className="font-black tracking-wider text-xs">MoMo</span>
                    </div>
                  ) : booking.paymentMethod === 'VNPAY' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', background: '#005baa', color: 'white', fontWeight: 'bold', border: '1px solid #00a0e9', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', letterSpacing: '0.5px' }}>
                      VN<span style={{ color: '#ff4d4f' }}>PAY</span>
                    </span>
                  ) : (
                    <span className="font-bold text-accent uppercase">{booking.paymentMethod}</span>
                  )}
                </div>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="bg-[#111] rounded-2xl border border-gray-800 p-6 shadow-lg md:col-span-2">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-6 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-accent" /> Thông tin liên hệ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-bold">Họ và tên</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" />
                  <p className="font-bold text-white">{booking.customerName}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-bold">Số điện thoại</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent" />
                  <p className="font-bold text-white">{booking.customerPhone}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  <p className="font-bold text-white truncate">{booking.customerEmail || 'Chưa cung cấp'}</p>
                </div>
              </div>
            </div>

            {booking.note && (
              <div className="mt-8 p-4 bg-primary rounded-xl border border-gray-800">
                <h4 className="text-xs text-gray-500 uppercase font-bold mb-2 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Ghi chú từ khách hàng
                </h4>
                <p className="text-sm text-gray-300 italic">"{booking.note}"</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Đánh giá nhân viên (Thợ) */}
        {booking.staff && booking.staff.id && (
          <ReviewSection 
            type="barber"
            itemId={booking.staff.id}
            transactionId={booking.id}
            status={booking.status}
            isCompleted={booking.status === 'COMPLETED'}
            itemName={booking.staff.name || 'Thợ cắt tóc'}
            itemImage={null} // Can add staff image if available
          />
        )}

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-xs">Mã giao dịch: {booking.transactionNo || 'Đang chờ xử lý'}</p>
          <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-widest">Cảm ơn bạn đã tin tưởng Barber Shop</p>
        </div>

      </div>
    </div>
  );
};

export default BookingDetail;

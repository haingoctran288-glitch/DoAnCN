import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Scissors, ArrowRight, Home } from 'lucide-react';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, service, staff } = location.state || {};

  if (!booking) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-primary text-white">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đặt lịch</h1>
        <button onClick={() => navigate('/')} className="text-accent hover:underline">Về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-primary text-white font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Success Icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3">
            Đặt lịch <span className="text-accent">thành công!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Mã đơn: <span className="text-accent font-bold">#{booking.id}</span>
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-accent/10 to-transparent px-6 py-4 border-b border-gray-800">
            <h3 className="text-lg font-heading font-bold text-accent">Chi tiết lịch hẹn</h3>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Scissors className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Dịch vụ</div>
                <div className="text-white font-medium">{service?.name || booking.service?.name || '—'}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Thợ cắt</div>
                <div className="text-white font-medium">{staff?.name || booking.staff?.name || 'Bất kỳ'}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Ngày hẹn</div>
                <div className="text-white font-medium">
                  {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Giờ hẹn</div>
                <div className="text-white font-medium">{booking.bookingTime || '—'}</div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
              <span className="text-gray-300 font-semibold">Tổng tiền</span>
              <span className="text-2xl font-heading font-bold text-accent">
                {booking.totalPrice ? Number(booking.totalPrice).toLocaleString('vi-VN') + '₫' : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-8">
          <p className="text-gray-300 text-sm leading-relaxed">
            📧 Email xác nhận đã được gửi tới <strong className="text-accent">{booking.customerEmail}</strong>. 
            Vui lòng đến đúng giờ để được phục vụ tốt nhất. Nếu cần thay đổi lịch hẹn, 
            vui lòng liên hệ chúng tôi qua hotline hoặc fanpage.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 bg-[#111] border border-gray-700 hover:border-gray-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </button>
          <button
            onClick={() => navigate('/booking')}
            className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-primary font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
          >
            Đặt lịch thêm
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccess;

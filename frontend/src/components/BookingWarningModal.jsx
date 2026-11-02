import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const BookingWarningModal = ({ open, onClose, branch, bookingTime, onAccepted }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#111] border border-red-900/50 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.3)] max-w-lg w-full p-0 relative transform scale-100 animate-in zoom-in-95 duration-300 overflow-hidden">

        {/* Glow red effect behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/20 blur-[60px] -z-10 rounded-full"></div>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/40 via-red-900/20 to-transparent p-5 border-b border-red-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-xl font-heading font-bold text-red-500 tracking-wide uppercase">
              Xác Nhận Đặt Lịch
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="space-y-4 text-gray-300 text-[15px] leading-relaxed">
            <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">
              Lưu Ý Quan Trọng !
            </h4>
            <p>
              Quý khách vui lòng đến đúng chi nhánh và đúng thời gian đã đặt để hệ thống có thể phục vụ tốt nhất.
            </p>

            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 my-4 flex flex-col gap-2 shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Chi nhánh:</span>
                <span className="text-red-500 font-bold text-base">{branch}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Thời gian:</span>
                <span className="text-red-500 font-bold text-base">{bookingTime}</span>
              </div>
            </div>

            <p>
              Nếu quý khách đến trễ <strong className="text-red-500">quá 15 phút</strong> so với giờ hẹn, lịch đặt sẽ tự động bị hủy để tránh ảnh hưởng đến lịch phục vụ của các khách hàng tiếp theo.
            </p>
            <p>
              Đối với trường hợp hủy do đến không đúng giờ, khoản thanh toán trước sẽ <strong className="text-red-500">không được hoàn lại</strong> theo chính sách đặt lịch của HORNET ROYALE.
            </p>
            <p className="italic text-gray-400 text-sm mt-4">
              Cảm ơn quý khách đã dành thời gian đọc thông báo và tin tưởng sử dụng dịch vụ của chúng tôi.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                onAccepted();
              }}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] border border-red-500 focus:outline-none"
            >
              Đã hiểu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingWarningModal;

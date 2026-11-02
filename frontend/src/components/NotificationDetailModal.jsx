import React, { useEffect } from 'react';
import { X, Calendar, User, MapPin, Mail, Phone, CreditCard, Hash, CheckCircle, Package, Bell, Lock, Unlock, MessageSquare, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const NotificationDetailModal = ({ isOpen, onClose, notification }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [reportReason, setReportReason] = React.useState('');
  const [reportDetails, setReportDetails] = React.useState('');
  const [isReporting, setIsReporting] = React.useState(false);
  const [isReportedLocally, setIsReportedLocally] = React.useState(false);

  const reportOptions = [
    "Thái độ không tốt - Thiếu chuyên nghiệp",
    "Ngôn từ không phù hợp (Nói tục, xúc phạm)",
    "Dẫn dụ giao dịch ngoài ứng dụng - Có dấu hiệu lừa đảo",
    "Nội dung rác (Spam) - Không liên quan đến công việc",
    "Khác (Nhập lý do chi tiết)"
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !notification) return null;

  let detailData = {};
  try {
    if (notification.dataJson) {
      detailData = JSON.parse(notification.dataJson);
    }
  } catch (e) {
    console.error("Failed to parse notification dataJson");
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
      const parts = dateStr.split('T')[0].split('-');
      const y = parts[0], m = parts[1], d = parts[2];
      return `${d}-${m}-${y}`;
    }
    return dateStr;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      const pad = (n) => n.toString().padStart(2, '0');
      return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
    } catch(e) {
      return 'N/A';
    }
  };

  const isOrder = !!detailData.order_id;
  const isCancel = notification.type === 'cancel';
  const isSystem = notification.type === 'system';
  const isChatReply = notification.type === 'chat_reply';

  const handleReportChat = async () => {
    if (!reportReason) {
      addToast({ title: 'Lỗi', message: 'Vui lòng chọn lý do báo cáo.', type: 'error' });
      return;
    }
    if (reportReason === 'Khác' && !reportDetails.trim()) {
      addToast({ title: 'Lỗi', message: 'Vui lòng nhập chi tiết vấn đề.', type: 'error' });
      return;
    }

    setIsReporting(true);
    try {
      await axios.post(`http://localhost:8080/api/chats/${detailData.chatId}/report`, {
        reason: reportReason,
        details: reportDetails
      });
      addToast({ title: 'Thành công', message: 'Đã gửi báo cáo thành công.', type: 'success' });
      setIsReportedLocally(true);
    } catch (err) {
      if (err.response?.data?.message?.includes('đã được báo cáo')) {
        addToast({ title: 'Lỗi', message: 'Tin nhắn này đã được báo cáo trước đó.', type: 'error' });
        setIsReportedLocally(true);
      } else {
        addToast({ title: 'Lỗi', message: 'Không thể gửi báo cáo.', type: 'error' });
      }
    } finally {
      setIsReporting(false);
    }
  };

  if (isSystem) {
    const isLock = notification.title?.toLowerCase().includes('khóa cod');
    const isUnlock = notification.title?.toLowerCase().includes('mở cod');

    let theme = {
      border: 'border-accent/30',
      shadow: 'shadow-[0_0_50px_rgba(212,175,55,0.15)]',
      gradientFrom: 'from-accent/20',
      borderHeader: 'border-accent/20',
      iconBg: 'bg-accent/20 border-accent/30 text-accent',
      buttonBg: 'from-accent to-yellow-600 text-primary hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]',
      icon: <Bell className="w-5 h-5" />
    };

    if (isLock) {
      theme = {
        border: 'border-red-500/30',
        shadow: 'shadow-[0_0_50px_rgba(239,68,68,0.15)]',
        gradientFrom: 'from-red-500/20',
        borderHeader: 'border-red-500/20',
        iconBg: 'bg-red-500/20 border-red-500/30 text-red-500',
        buttonBg: 'from-red-600 to-red-800 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
        icon: <Lock className="w-5 h-5" />
      };
    } else if (isUnlock) {
      theme = {
        border: 'border-green-500/30',
        shadow: 'shadow-[0_0_50px_rgba(34,197,94,0.15)]',
        gradientFrom: 'from-green-500/20',
        borderHeader: 'border-green-500/20',
        iconBg: 'bg-green-500/20 border-green-500/30 text-green-500',
        buttonBg: 'from-green-500 to-green-700 text-white hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]',
        icon: <Unlock className="w-5 h-5" />
      };
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className={`relative w-full max-w-md bg-[#111] border ${theme.border} ${theme.shadow} rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300`}>
          <div className={`bg-gradient-to-r ${theme.gradientFrom} to-transparent p-6 border-b ${theme.borderHeader}`}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${theme.iconBg}`}>
                {theme.icon}
              </div>
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-wider">
                {notification.title || 'Thông Báo Hệ Thống'}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </p>
          </div>
          <div className="p-4 bg-[#1a1a1a] border-t border-gray-800 flex justify-end">
            <button 
              onClick={onClose}
              className={`py-2.5 px-6 rounded-xl bg-gradient-to-r ${theme.buttonBg} font-bold uppercase tracking-wider text-sm transition-all`}
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isChatReply) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-lg bg-[#111] border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-r from-indigo-500/20 to-transparent p-6 border-b border-indigo-500/20">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-indigo-500/20 border-indigo-500/30 text-indigo-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-wider">
                {notification.title || 'Phản hồi tư vấn'}
              </h3>
            </div>
            <p className="text-gray-300 text-sm pl-13 leading-relaxed mt-4">
              {notification.message}
            </p>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 relative">
              <div className="absolute -top-3 left-4 bg-[#111] px-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">Nội dung phản hồi</div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap mt-2">{detailData.replyMessage}</p>
            </div>

            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-2 mb-3 text-red-500 font-bold uppercase text-sm tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Báo cáo cuộc trò chuyện
              </div>
              
              {isReportedLocally ? (
                <div className="text-center p-3">
                  <p className="text-red-400 font-medium">Bạn đã báo cáo cuộc trò chuyện này.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {reportOptions.map(reason => (
                      <label key={reason} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="reportReason" 
                          value={reason} 
                          checked={reportReason === reason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-4 h-4 accent-red-500 bg-gray-800 border-gray-700" 
                        />
                        <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{reason}</span>
                      </label>
                    ))}
                  </div>
                  
                  {reportReason === 'Khác (Nhập lý do chi tiết)' && (
                    <div className="mt-3">
                      <textarea 
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        placeholder="Vui lòng nhập chi tiết vấn đề bạn gặp phải..."
                        className="w-full bg-[#111] border border-red-500/30 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-red-500 transition-colors resize-none custom-scrollbar"
                        rows="3"
                      ></textarea>
                    </div>
                  )}

                  <button 
                    onClick={handleReportChat}
                    disabled={isReporting}
                    className="w-full mt-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs transition-colors disabled:opacity-50"
                  >
                    {isReporting ? 'Đang gửi...' : 'Gửi Báo Cáo'}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="p-4 bg-[#1a1a1a] border-t border-gray-800 flex justify-end">
            <button 
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl border border-gray-700 text-gray-300 font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isOrder) {
    // ────────────── ORDER NOTIFICATION RENDER ──────────────
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className={`relative w-full max-w-lg bg-[#111] border ${isCancel ? 'border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.15)]' : 'border-[#38bdf8]/30 shadow-[0_0_50px_rgba(56,189,248,0.15)]'} rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300`}>
          
          {/* Header */}
          <div className={`bg-gradient-to-r ${isCancel ? 'from-red-900/40' : 'from-[#0284c7]/40'} to-transparent p-6 border-b ${isCancel ? 'border-red-500/20' : 'border-[#38bdf8]/20'}`}>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full ${isCancel ? 'bg-red-500/20 border-red-500/30 text-red-500' : 'bg-[#38bdf8]/20 border-[#38bdf8]/30 text-[#38bdf8]'} flex items-center justify-center border`}>
                {isCancel ? <span className="text-xl font-black">!</span> : <CheckCircle className="w-5 h-5" />}
              </div>
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-wider">
                {isCancel ? 'Chi Tiết Hủy Đơn Hàng' : 'Chi Tiết Duyệt Đơn Hàng'}
              </h3>
            </div>
            <p className="text-gray-300 text-sm pl-13 leading-relaxed mt-4">
              {notification.message}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Hash className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Mã đơn hàng</span>
                </div>
                <p className="text-white font-medium">#{detailData.order_id || 'N/A'}</p>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Tổng giá trị</span>
                </div>
                <p className="text-accent font-medium">
                  {detailData.total_price ? Number(detailData.total_price).toLocaleString('vi-VN') + '₫' : 'N/A'}
                </p>
              </div>
            </div>

            {isCancel && (
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-red-500/20">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Lý do hủy đơn</p>
                <p className="text-red-400 font-medium text-sm">{detailData.cancel_reason || 'Không có lý do chi tiết.'}</p>
              </div>
            )}

            {!isCancel && (
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#38bdf8]/20 flex items-start gap-3">
                <Package className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Trạng thái giao hàng</p>
                  <p className="text-[#38bdf8] font-medium text-sm">Đã xác nhận & đang chuẩn bị bàn giao vận chuyển.</p>
                </div>
              </div>
            )}
            
          </div>

          {/* Footer */}
          <div className="p-6 bg-[#1a1a1a] border-t border-gray-800 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-700 text-gray-300 font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
            >
              Đóng
            </button>
            <button 
              onClick={() => {
                onClose();
                navigate(`/orders/${detailData.order_id}`);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              Chi tiết đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ────────────── BOOKING NOTIFICATION RENDER (Original) ──────────────
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className={`relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#111] border rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${detailData.cancel_reason === 'late_customer' ? 'border-red-600/50 shadow-[0_0_50px_rgba(220,38,38,0.3)]' : 'border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.15)]'}`}>
        
        {/* Header */}
        <div className={`bg-gradient-to-r to-transparent p-6 border-b ${detailData.cancel_reason === 'late_customer' ? 'from-red-950/60 border-red-600/40' : 'from-red-900/40 border-red-500/20'}`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${detailData.cancel_reason === 'late_customer' ? 'bg-red-600/20 border-red-600/40' : 'bg-red-500/20 border-red-500/30'}`}>
              <span className="text-red-500 text-xl font-black">!</span>
            </div>
            <h3 className={`text-xl font-heading font-black uppercase tracking-wider ${detailData.cancel_reason === 'late_customer' ? 'text-red-500' : 'text-white'}`}>
              Chi Tiết Hủy Lịch
            </h3>
          </div>
          <div className={`text-sm pl-13 leading-relaxed mt-4 whitespace-pre-wrap ${detailData.cancel_reason === 'late_customer' ? 'text-red-200' : 'text-gray-300'}`}>
            {notification.message}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 overflow-y-auto custom-scrollbar flex-1">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Hash className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Mã đơn</span>
              </div>
              <p className="text-white font-medium">#{detailData.booking_id || 'N/A'}</p>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Thanh toán</span>
              </div>
              <p className="text-white font-medium">{detailData.payment_method || 'N/A'}</p>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border ${detailData.cancel_reason === 'late_customer' ? 'bg-red-950/30 border-red-900/50' : 'bg-[#1a1a1a] border-gray-800'}`}>
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Thông Tin Hủy</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Lý do:</span>
                <span className="text-sm font-bold text-red-400">
                  {detailData.cancel_reason === 'late_customer' ? 'Bị hủy do không đúng giờ' : 'Bị hủy bởi admin'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Thời gian hủy:</span>
                <span className="text-sm text-gray-300">
                  {formatDateTime(detailData.cancelled_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Hoàn tiền:</span>
                <span className={`text-sm font-bold ${detailData.refund_status === 'success' ? 'text-green-400' : 'text-yellow-500'}`}>
                  {detailData.refund_status === 'success' ? 'Đã hoàn tiền' : 'Không hoàn tiền'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-3 border-b border-gray-800 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Thời gian đặt</p>
                <p className="text-white font-medium">{detailData.booking_time} - {formatDate(detailData.booking_date)}</p>
              </div>
            </div>
            <div className="p-3 border-b border-gray-800 flex items-start gap-3">
              <User className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dịch vụ & Thợ</p>
                <p className="text-white font-medium mb-1">{detailData.service_name || 'N/A'}</p>
                {detailData.service_price ? (
                  <p className="text-xs text-accent font-medium mb-1">
                    {Number(detailData.service_price).toLocaleString('vi-VN')}đ • {detailData.service_duration || 0} phút
                  </p>
                ) : null}
                <p className="text-sm text-gray-400">Thợ: {detailData.barber_name || 'Không chọn thợ'}</p>
              </div>
            </div>
            <div className="p-3 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Chi nhánh</p>
                <p className="text-white font-medium">{detailData.branch_name || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-3 space-y-2">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-300 text-sm">{detailData.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-300 text-sm">{detailData.phone || 'N/A'}</span>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1a1a1a] border-t border-gray-800 flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-700 text-gray-300 font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
          >
            Đóng
          </button>
          <button 
            onClick={() => {
              onClose();
              navigate('/booking');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
          >
            Đặt lịch mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;

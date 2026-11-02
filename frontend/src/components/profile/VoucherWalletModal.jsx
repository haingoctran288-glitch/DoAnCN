import React, { useState, useEffect } from 'react';
import { X, Ticket, HelpCircle, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';

const VoucherWalletModal = ({ isOpen, onClose, userId }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('UNUSED'); // 'UNUSED', 'USED', 'EXPIRED'

  const formatDate = (dateString) => {
    if (!dateString) return 'Vô thời hạn';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const fetchMyVouchers = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/customer-vouchers/my-vouchers', {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` }
      });
      setVouchers(res.data || []);
    } catch (err) {
      console.error('Lỗi tải ví voucher:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMyVouchers();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const filteredVouchers = vouchers.filter(v => {
    if (activeTab === 'UNUSED') return v.status === 'UNUSED';
    if (activeTab === 'USED') return v.status === 'USED';
    return v.status === 'EXPIRED';
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-[#111] border border-accent/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col max-h-[85vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gradient-to-r from-black via-[#111] to-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-heading tracking-wide">Ví Voucher Hornet</h3>
              <p className="text-xs text-gray-400">Xem và quản lý các đặc quyền ưu đãi của bạn</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-[#0a0a0a] px-6">
          {[
            { id: 'UNUSED', label: 'Chưa sử dụng' },
            { id: 'USED', label: 'Đã sử dụng' },
            { id: 'EXPIRED', label: 'Hết hạn' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 font-bold text-sm border-b-2 transition-all relative ${
                activeTab === tab.id 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-accent blur-[2px] rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Voucher List Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-4 min-h-[350px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400 text-sm">Đang tải ví voucher...</span>
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-gray-600" />
              <div>
                <p className="text-white font-bold text-lg">Hộp thư ví trống</p>
                <p className="text-gray-500 text-sm max-w-sm mt-1">
                  {activeTab === 'UNUSED' 
                    ? 'Bạn chưa có voucher khả dụng nào. Đăng ký thành viên hoặc tham gia các dịch vụ để nhận ưu đãi nhé!' 
                    : activeTab === 'USED' 
                    ? 'Bạn chưa sử dụng voucher nào gần đây.' 
                    : 'Không có voucher nào đã hết hạn.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVouchers.map(cv => {
                const v = cv.voucher;
                if (!v) return null;
                const isPercent = v.voucherType === 'PERCENTAGE';
                
                return (
                  <div 
                    key={cv.id} 
                    className={`relative bg-gradient-to-br from-[#181818] to-[#121212] border rounded-2xl p-5 flex flex-col justify-between shadow-lg overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 ${
                      activeTab === 'UNUSED' 
                        ? 'border-accent/20 hover:border-accent/50' 
                        : 'border-gray-800 opacity-60'
                    }`}
                  >
                    {/* Left Cutout decoration */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#111] border-r border-accent/20 rounded-r-full"></div>
                    {/* Right Cutout decoration */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#111] border-l border-accent/20 rounded-l-full"></div>

                    <div>
                      {/* Badge / Code */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                            {v.code}
                          </span>
                          {v.userLimit > 1 && activeTab === 'UNUSED' && (
                            <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-black tracking-widest flex-shrink-0">
                              x{v.userLimit - (cv.usedCount || 0)}
                            </span>
                          )}
                          {v.userLimit > 1 && activeTab !== 'UNUSED' && (
                            <span className="text-[10px] bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full font-black tracking-widest flex-shrink-0">
                              x{v.userLimit - (cv.usedCount || 0)}
                            </span>
                          )}
                        </div>
                        {activeTab === 'UNUSED' && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                            Khả dụng
                          </span>
                        )}
                        {activeTab === 'USED' && (
                          <span className="text-[10px] text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded-full">
                            Đã dùng
                          </span>
                        )}
                        {activeTab === 'EXPIRED' && (
                          <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                            Hết hạn
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-white font-bold font-heading text-[15px] line-clamp-1 mt-1 group-hover:text-accent transition-all">
                        {v.name}
                      </h4>

                      {/* Apply Scope Badge */}
                      <div className="mt-2">
                        {v.applyTo === 'SERVICE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Dùng cho: Dịch vụ đặt lịch
                          </span>
                        )}
                        {v.applyTo === 'PRODUCT' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                            Dùng cho: Mua sản phẩm
                          </span>
                        )}
                        {v.applyTo === 'ALL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Dùng cho: Cả 2 (Dịch vụ & Sản phẩm)
                          </span>
                        )}
                      </div>

                      {/* Discount Amount */}
                      <div className="mt-3 text-2xl font-bold text-accent">
                        {v.voucherType === 'FREE_SERVICE'
                          ? 'Miễn phí dịch vụ'
                          : isPercent
                            ? `${v.value || 0}%`
                            : `${Number(v.value || 0).toLocaleString('vi-VN')}₫`
                        }
                      </div>

                      {/* Min spend & Max discount info */}
                      <div className="mt-3 space-y-1 text-xs text-gray-400">
                        {v.minOrderValue > 0 && (
                          <p>• Đơn tối thiểu: <span className="text-white font-semibold">{Number(v.minOrderValue).toLocaleString('vi-VN')}₫</span></p>
                        )}
                        {isPercent && v.maxDiscount > 0 && (
                          <p>• Giảm tối đa: <span className="text-white font-semibold">{Number(v.maxDiscount).toLocaleString('vi-VN')}₫</span></p>
                        )}
                      </div>
                    </div>

                    {/* Expiry / Usage Info */}
                    <div className="mt-5 pt-3 border-t border-gray-800 flex flex-col gap-1.5 text-[11px] text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-accent/60" />
                        <span>HSD: {formatDate(v.endDate)}</span>
                      </div>
                      {cv.note && (
                        <p className="text-[10px] italic text-accent/70 mt-1 leading-normal break-words" title={cv.note}>
                          {cv.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#0a0a0a] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#222] hover:bg-accent hover:text-black border border-gray-700 hover:border-accent text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 uppercase tracking-wider text-xs"
          >
            Đóng ví
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherWalletModal;

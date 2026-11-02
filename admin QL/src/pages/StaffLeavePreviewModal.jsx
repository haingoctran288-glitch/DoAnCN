import React, { useState } from 'react';
import { Modal, Select, Space, Alert } from 'antd';
import { 
  ExclamationCircleOutlined, CheckCircleOutlined, SwapOutlined, 
  DollarOutlined, ArrowLeftOutlined, SearchOutlined, WarningOutlined,
  CalendarOutlined, UserOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const LEAVE_TYPE_LABELS = {
  ANNUAL_LEAVE: 'Nghỉ phép năm',
  SICK_LEAVE: 'Nghỉ ốm',
  PERSONAL: 'Việc cá nhân',
  OTHER: 'Lý do khác',
};

export default function StaffLeavePreviewModal({ open, data, staffList, formValues, onConfirm, onCancel }) {
  const [assignments, setAssignments] = useState({});
  const [confirming, setConfirming] = useState(false);

  if (!data) return null;

  const { bookingsWithAlternative = [], bookingsWithNoAlternative = [], estimatedRefundAmount = 0, totalAffectedBookings = 0 } = data;
  const allBookings = [...bookingsWithAlternative, ...bookingsWithNoAlternative];

  const handleAssign = (bookingId, staffId) => {
    setAssignments(prev => ({ ...prev, [bookingId]: staffId || null }));
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm(assignments);
    } finally {
      setConfirming(false);
    }
  };

  const assignedCount = Object.values(assignments).filter(v => v !== null && v !== undefined).length;
  const refundCount = bookingsWithNoAlternative.length + (bookingsWithAlternative.length - Object.keys(assignments).filter(k => assignments[k]).length);
  const totalPaidRefunds = bookingsWithNoAlternative.filter(b => b.status === 'PAID').length + 
                           bookingsWithAlternative.filter(b => b.status === 'PAID' && !assignments[b.bookingId]).length;
  const totalUnpaidCancels = bookingsWithNoAlternative.filter(b => b.status !== 'PAID').length + 
                             bookingsWithAlternative.filter(b => b.status !== 'PAID' && !assignments[b.bookingId]).length;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
      className="premium-modal"
      styles={{ body: { padding: 0 } }}
      closeIcon={<span className="text-gray-400 hover:text-white text-xl">×</span>}
    >
      <div className="bg-[#111] border border-accent/30 shadow-[0_0_60px_rgba(212,175,55,0.15)] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-accent/20 via-[#111] to-transparent p-6 border-b border-accent/20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 text-accent flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <SearchOutlined />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider m-0">Phân Tích Lịch Hẹn</h2>
                <div className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase">
                  Ảnh Hưởng
                </div>
              </div>
              
              {formValues && (
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-gray-800">
                    <CalendarOutlined className="text-accent" />
                    <span className="font-bold text-gray-300">{dayjs(formValues.startDate).format('DD/MM/YYYY')} → {dayjs(formValues.endDate).format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-gray-800">
                    <ExclamationCircleOutlined className="text-accent" />
                    <span className="font-bold text-gray-300">{LEAVE_TYPE_LABELS[formValues.leaveType]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-4 gap-4 p-6 bg-[#0a0a0a] border-b border-gray-800 shrink-0">
          <div className="bg-[#111] border border-gray-800 rounded-xl p-4 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-all"></div>
            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Tổng Ảnh Hưởng</div>
            <div className="text-3xl font-black text-white">{totalAffectedBookings} <span className="text-sm font-medium text-gray-500">đơn</span></div>
          </div>
          <div className="bg-[#111] border border-green-500/20 rounded-xl p-4 relative overflow-hidden group hover:border-green-500/40 transition-all">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all"></div>
            <div className="text-green-500/70 text-[10px] font-bold uppercase tracking-widest mb-1">Có Thể Đổi Thợ</div>
            <div className="text-3xl font-black text-green-400">{bookingsWithAlternative.length} <span className="text-sm font-medium text-green-500/50">đơn</span></div>
          </div>
          <div className="bg-[#111] border border-red-500/20 rounded-xl p-4 relative overflow-hidden group hover:border-red-500/40 transition-all">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
            <div className="text-red-500/70 text-[10px] font-bold uppercase tracking-widest mb-1">Bắt Buộc Hủy/Hoàn</div>
            <div className="text-3xl font-black text-red-400">{bookingsWithNoAlternative.length} <span className="text-sm font-medium text-red-500/50">đơn</span></div>
          </div>
          <div className="bg-[#111] border border-accent/20 rounded-xl p-4 relative overflow-hidden group hover:border-accent/40 transition-all">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-all"></div>
            <div className="text-accent/70 text-[10px] font-bold uppercase tracking-widest mb-1">Ước Tính Hoàn Tiền</div>
            <div className="text-2xl font-black text-accent mt-1">{Number(estimatedRefundAmount).toLocaleString('vi-VN')}đ</div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-[#050505] p-6 custom-scrollbar">
          {totalAffectedBookings === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <CheckCircleOutlined className="text-4xl text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tuyệt vời! Không có lịch hẹn nào bị ảnh hưởng.</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                Nhân viên này chưa có bất kỳ lịch hẹn nào trong khoảng thời gian xin nghỉ. Bạn có thể tự tin xác nhận tạo kỳ nghỉ ngay bây giờ.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-4 items-start">
                <WarningOutlined className="text-orange-500 text-xl mt-0.5" />
                <div>
                  <h4 className="text-orange-500 font-bold mb-1">Cần Xử Lý Lịch Hẹn</h4>
                  <p className="text-orange-200/70 text-sm m-0 leading-relaxed">
                    Có {totalAffectedBookings} lịch hẹn trùng với thời gian nghỉ. Vui lòng chọn thợ thay thế cho khách. 
                    Nếu không chọn được thợ, hệ thống sẽ tự động gửi thông báo Hủy lịch và Hoàn tiền (nếu khách đã thanh toán).
                  </p>
                </div>
              </div>

              {/* BOOKING LIST */}
              <div className="space-y-3">
                {allBookings.map((r, i) => {
                  const hasAlternatives = r.alternatives && r.alternatives.length > 0;
                  const isPaid = r.status === 'PAID';
                  const isAssigned = !!assignments[r.bookingId];
                  
                  return (
                    <div key={r.bookingId} className={`relative overflow-hidden rounded-xl border ${hasAlternatives ? 'bg-[#111] border-gray-800' : 'bg-red-950/20 border-red-900/30'} p-4 transition-all hover:border-gray-600`}>
                      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-between">
                        
                        {/* Booking Info */}
                        <div className="flex items-start gap-4 min-w-[280px]">
                          <div className="w-12 h-12 rounded-xl bg-black border border-gray-800 flex flex-col items-center justify-center shrink-0">
                            <span className="text-accent text-[10px] font-bold uppercase leading-none mb-1">Code</span>
                            <span className="text-white font-black leading-none">#{r.bookingId}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-bold">{r.customerName}</span>
                              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isPaid ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                {isPaid ? 'Đã Thanh Toán' : r.status}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <span className="text-gray-400 flex items-center gap-1"><ClockCircleOutlined className="text-accent" /> {r.bookingTime} {dayjs(r.bookingDate).format('DD/MM/YYYY')}</span>
                              <span className="text-gray-400 flex items-center gap-1"><CheckCircleOutlined className="text-accent" /> {r.serviceName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[100px] hidden md:block">
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Giá trị</div>
                          <div className="text-white font-bold">{Number(r.totalPrice || 0).toLocaleString('vi-VN')}đ</div>
                        </div>

                        {/* Action Area */}
                        <div className="w-full md:w-[320px] shrink-0 border-t md:border-t-0 md:border-l border-gray-800 pt-3 md:pt-0 md:pl-4">
                          {!hasAlternatives ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                              <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                                <ExclamationCircleOutlined /> Không có thợ rảnh
                              </div>
                              <div className="text-red-300/70 text-xs">
                                {isPaid ? 'Sẽ hủy lịch & hoàn tiền 100%' : 'Sẽ hủy lịch do chưa thanh toán'}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 flex justify-between">
                                <span>Thợ Thay Thế:</span>
                                {isAssigned ? (
                                  <span className="text-green-500 flex items-center gap-1"><CheckCircleOutlined /> Đã chọn</span>
                                ) : (
                                  <span className="text-orange-500 flex items-center gap-1"><WarningOutlined /> Bỏ trống = Hủy đơn</span>
                                )}
                              </div>
                              <Select
                                style={{ width: '100%' }}
                                placeholder="Chọn thợ..."
                                allowClear
                                onChange={(val) => handleAssign(r.bookingId, val)}
                                value={assignments[r.bookingId]}
                                className="dark-select custom-select-arrow h-10"
                                popupMatchSelectWidth={false}
                              >
                                {r.alternatives.map(alt => (
                                  <Option key={alt.staffId} value={alt.staffId}>
                                    <div className="flex items-center justify-between">
                                      <span>👤 {alt.staffName}</span>
                                      <span className="text-xs text-gray-500">{alt.branch}</span>
                                    </div>
                                  </Option>
                                ))}
                              </Select>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER & SUMMARY */}
        <div className="bg-[#111] border-t border-gray-800 p-6 shrink-0">
          {totalAffectedBookings > 0 && (
            <div className="flex flex-wrap items-center gap-6 mb-6 px-4 py-3 bg-[#151515] rounded-xl border border-gray-800">
              <span className="text-white font-bold text-sm uppercase tracking-wider border-r border-gray-700 pr-6">Tóm tắt:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"><SwapOutlined /></div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Đổi Thợ</div>
                  <div className="text-green-400 font-bold">{assignedCount} đơn</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center"><DollarOutlined /></div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Hoàn Tiền</div>
                  <div className="text-orange-400 font-bold">{totalPaidRefunds} đơn</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center"><ExclamationCircleOutlined /></div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Hủy (Chưa thanh toán)</div>
                  <div className="text-red-400 font-bold">{totalUnpaidCancels} đơn</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button 
              onClick={onCancel}
              className="px-6 py-3 border-none outline-none cursor-pointer rounded-xl bg-transparent border border-gray-700 text-gray-300 font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ArrowLeftOutlined /> Quay lại chỉnh sửa
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="px-8 py-3 border-none outline-none cursor-pointer rounded-xl bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
            >
              {confirming ? 'Đang Xử Lý...' : 'Xác Nhận & Khóa Lịch Hẹn'} <CheckCircleOutlined />
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
}

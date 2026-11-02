import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, MessageSquare, ImageIcon, User, ShieldCheck, ArrowLeft, Calendar, RotateCcw, ChevronRight, AlertTriangle, Send } from 'lucide-react';

const CustomerChatHistoryModal = ({ isOpen, onClose }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  
  // Báo cáo
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const reportOptions = [
    "Thái độ không tốt - Thiếu chuyên nghiệp",
    "Ngôn từ không phù hợp (Nói tục, xúc phạm)",
    "Dẫn dụ giao dịch ngoài ứng dụng - Có dấu hiệu lừa đảo",
    "Nội dung rác (Spam) - Không liên quan đến công việc",
    "Khác (Nhập lý do chi tiết)"
  ];

  useEffect(() => {
    if (isOpen) {
      fetchChats();
      setSelectedChat(null);
      setFilterDate('');
      setIsReporting(false);
      setReportReason('');
      setReportDetails('');
    }
  }, [isOpen]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/chats/my-chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data);
    } catch (err) {
      console.error('Lỗi tải lịch sử tư vấn:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      alert('Vui lòng chọn lý do báo cáo');
      return;
    }
    if (reportReason === 'Khác (Nhập lý do chi tiết)' && !reportDetails.trim()) {
      alert('Vui lòng nhập lý do chi tiết');
      return;
    }

    try {
      setReportSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/chats/${selectedChat.id}/report`,
        { reason: reportReason, details: reportDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Đã gửi báo cáo thành công');
      
      // Update local state
      const updatedChat = { 
        ...selectedChat, 
        status: 'REPORTED', 
        reportReason, 
        reportDetails, 
        reportedAt: new Date().toISOString() 
      };
      setSelectedChat(updatedChat);
      setChats(chats.map(c => c.id === updatedChat.id ? updatedChat : c));
      setIsReporting(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi gửi báo cáo');
    } finally {
      setReportSubmitting(false);
    }
  };

  // Filter chats by selected date
  const filteredChats = chats.filter(chat => {
    if (!filterDate) return true;
    const chatDate = new Date(chat.createdAt).toISOString().split('T')[0];
    return chatDate === filterDate;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111] border border-[#222] rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col h-[85vh] max-h-[800px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] shrink-0 bg-[#151515]">
          <div className="flex items-center gap-3">
            {selectedChat ? (
              <button 
                onClick={() => setSelectedChat(null)}
                className="bg-[#222] hover:bg-[#333] p-2 rounded-lg text-gray-300 transition-colors border border-[#333] flex items-center justify-center mr-2"
                title="Quay lại danh sách"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="bg-accent/20 p-2 rounded-lg text-accent">
                <MessageSquare className="w-5 h-5" />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-heading font-bold text-accent">
                {selectedChat ? 'Chi tiết phiên tư vấn' : 'Lịch sử tư vấn'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {selectedChat ? `Cùng thợ ${selectedChat.barber?.name || 'HORNET ROYALE'}` : 'HORNET ROYALE'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors border border-[#333]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] flex flex-col [&::-webkit-scrollbar]:hidden">
          
          {/* VIEW: CHI TIẾT ĐOẠN CHAT */}
          {selectedChat ? (
            <div className="p-6 space-y-6">
              {/* Khách hàng nhắn */}
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0 border border-[#444]">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                    <span className="text-sm font-bold text-accent">Bạn</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent">KHÁCH HÀNG</span>
                  </div>
                  <div className="bg-gradient-to-br from-accent to-yellow-600 text-black font-medium rounded-2xl rounded-tr-none px-4 py-3 inline-block max-w-[85%] shadow-[0_4px_15px_rgba(212,175,55,0.2)]">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedChat.message}</p>
                    {selectedChat.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-black/20 inline-block">
                        <img 
                          src={selectedChat.imageUrl.startsWith('http') ? selectedChat.imageUrl : `http://localhost:8080${selectedChat.imageUrl}`} 
                          alt="Gửi ảnh đính kèm" 
                          className="max-w-[200px] h-auto object-cover" 
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-2 mr-1 flex items-center gap-1">
                    {new Date(selectedChat.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Thợ phản hồi */}
              {selectedChat.reply ? (
                <div className="flex items-start gap-3 mt-6">
                  <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center shrink-0 border border-[#444]">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{selectedChat.barber?.name || 'Thợ'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#222] border border-[#333] text-gray-400">THỢ PHẢN HỒI</span>
                    </div>
                    <div className="bg-[#222] border border-[#333] rounded-2xl rounded-tl-none px-4 py-3 inline-block max-w-[85%] shadow-sm">
                      <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">{selectedChat.reply}</p>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-2 ml-1 flex items-center gap-1">
                      {selectedChat.repliedAt ? new Date(selectedChat.repliedAt).toLocaleString('vi-VN') : 'Đã phản hồi'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center border-t border-dashed border-[#333] pt-4 mt-8">
                  <span className="text-xs text-gray-500 italic bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#222]">
                    Đang chờ thợ phản hồi...
                  </span>
                </div>
              )}

              {/* REPORT SECTION */}
              {selectedChat.status === 'REPORTED' ? (
                <div className="mt-8 bg-[#1a0f0f] border border-red-900/50 rounded-xl p-4 flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-red-500 font-bold text-sm mb-1">Đã báo cáo vi phạm</h4>
                    <p className="text-gray-300 text-sm">
                      <span className="text-gray-500">Lý do:</span> {selectedChat.reportReason}
                    </p>
                    {selectedChat.reportDetails && (
                      <p className="text-gray-300 text-sm mt-1">
                        <span className="text-gray-500">Chi tiết:</span> {selectedChat.reportDetails}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      Thời gian báo cáo: {selectedChat.reportedAt ? new Date(selectedChat.reportedAt).toLocaleString('vi-VN') : 'Không rõ'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 border-t border-[#222] pt-6">
                  {!isReporting ? (
                    <div className="flex justify-center">
                      <button 
                        onClick={() => setIsReporting(true)}
                        className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-2 transition-colors px-4 py-2 rounded-full hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
                      >
                        <AlertTriangle className="w-4 h-4" /> Báo cáo cuộc trò chuyện này
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#111] border border-[#333] rounded-xl p-5">
                      <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Gửi báo cáo vi phạm
                      </h4>
                      <div className="space-y-3 mb-4">
                        {reportOptions.map((opt, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors border border-transparent hover:border-[#333]">
                            <input 
                              type="radio" 
                              name="reportReason" 
                              value={opt}
                              checked={reportReason === opt}
                              onChange={(e) => setReportReason(e.target.value)}
                              className="w-4 h-4 text-red-500 bg-[#222] border-[#444] focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-300">{opt}</span>
                          </label>
                        ))}
                      </div>
                      
                      {reportReason === 'Khác (Nhập lý do chi tiết)' && (
                        <textarea
                          placeholder="Nhập chi tiết lý do bạn muốn báo cáo..."
                          value={reportDetails}
                          onChange={(e) => setReportDetails(e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-red-500 mb-4 h-24 [&::-webkit-scrollbar]:hidden"
                        />
                      )}

                      <div className="flex justify-end gap-3 mt-2">
                        <button 
                          onClick={() => setIsReporting(false)}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-[#222] hover:bg-[#333] transition-colors"
                        >
                          Hủy bỏ
                        </button>
                        <button 
                          onClick={handleReport}
                          disabled={reportSubmitting}
                          className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                        >
                          {reportSubmitting ? 'Đang gửi...' : <><Send className="w-4 h-4" /> Gửi báo cáo</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : 
          
          /* VIEW: DANH SÁCH CHAT */
          (
            <div className="flex flex-col h-full">
              {/* Filter Bar */}
              <div className="bg-[#111] p-4 border-b border-[#222] shrink-0 flex items-center gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-lg focus:ring-accent focus:border-accent block pl-10 p-2.5 outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={() => setFilterDate('')}
                  className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-gray-300 border border-[#444] px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:hidden">
                {loading ? (
                  <div className="text-center text-gray-500 py-10 animate-pulse font-medium">Đang tải lịch sử...</div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                    <MessageSquare className="w-12 h-12 mb-3 text-gray-700" />
                    <p className="font-medium text-lg text-gray-400">Không tìm thấy cuộc trò chuyện nào.</p>
                    {filterDate && <p className="text-sm mt-2">Thử chọn một ngày khác hoặc bấm Reset.</p>}
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div 
                      key={chat.id} 
                      onClick={() => setSelectedChat(chat)}
                      className="bg-[#161616] border border-[#2a2a2a] hover:border-accent/50 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:bg-[#1a1a1a] group"
                    >
                      {/* Avatar Thợ hoặc Mặc định */}
                      <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                         {chat.barber?.avatar ? (
                            <img 
                              src={chat.barber.avatar.startsWith('http') ? chat.barber.avatar : `http://localhost:8080${chat.barber.avatar}`}
                              alt={chat.barber.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                         ) : (
                           <ShieldCheck className="w-6 h-6 text-accent" />
                         )}
                      </div>
                      
                      {/* Tóm tắt */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-white text-base truncate pr-2">
                            {chat.barber ? `Tư vấn viên: ${chat.barber.name}` : 'Tư vấn viên HORNET'}
                          </h4>
                          <span className="text-xs text-gray-500 shrink-0">
                            {new Date(chat.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                           <p className="truncate max-w-[80%]">
                             {chat.reply ? <span className="text-gray-500">Phản hồi: {chat.reply}</span> : <span>Bạn: {chat.message}</span>}
                           </p>
                           {chat.imageUrl && <ImageIcon className="w-3.5 h-3.5 inline text-gray-500" />}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="text-[#333] group-hover:text-accent transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerChatHistoryModal;

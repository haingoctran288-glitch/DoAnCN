import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check, X, Sparkles, Calendar, Scissors, Tag, Clock, CreditCard, AlertCircle, MessageSquare } from 'lucide-react';
import NotificationDetailModal from './NotificationDetailModal';

// Helper to format date
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const pad = (num) => num.toString().padStart(2, '0');
  
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

const getNotificationStyle = (type) => {
  switch (type) {
    case 'cancel':
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        bgClass: 'bg-red-500/10 border-red-500/20 text-red-500',
        textClass: 'text-red-400',
        hoverBgClass: 'hover:bg-red-500/5'
      };
    case 'voucher':
      return {
        icon: <Tag className="w-4 h-4" />,
        bgClass: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
        textClass: 'text-yellow-400',
        hoverBgClass: 'hover:bg-white/[0.03]'
      };
    case 'booking':
      return {
        icon: <Calendar className="w-4 h-4" />,
        bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
        textClass: 'text-blue-400',
        hoverBgClass: 'hover:bg-white/[0.03]'
      };
    case 'payment':
    case 'approve':
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        bgClass: 'bg-[#38bdf8]/10 border-[#38bdf8]/20 text-[#38bdf8]',
        textClass: 'text-[#38bdf8]',
        hoverBgClass: 'hover:bg-white/[0.03]'
      };
    case 'chat_reply':
      return {
        icon: <MessageSquare className="w-4 h-4" />,
        bgClass: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500',
        textClass: 'text-indigo-400',
        hoverBgClass: 'hover:bg-white/[0.03]'
      };
    default:
      return {
        icon: <Bell className="w-4 h-4" />,
        bgClass: 'bg-accent/10 border-accent/20 text-accent',
        textClass: 'text-white',
        hoverBgClass: 'hover:bg-white/[0.03]'
      };
  }
};

const NotificationDropdown = ({ isOpen, onClose, onMarkAllRead, onMarkReadSingle, notifications = [], refreshData, bellRef }) => {
  const dropdownRef = useRef(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e) => {
      // Don't close if clicking inside the modal
      if (document.getElementById('notification-detail-modal')?.contains(e.target)) return;
      // Don't close if clicking the bell button (let handleToggle manage it)
      if (bellRef?.current && bellRef.current.contains(e.target)) return;

      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (noti) => {
    if (!noti.isRead && onMarkReadSingle) {
      onMarkReadSingle(noti.id);
    }
    if (noti.type === 'cancel' || noti.type === 'approve' || noti.type === 'system' || noti.type === 'chat_reply') {
      setSelectedNotification(noti);
      setIsModalOpen(true);
    }
  };

  if (!isOpen && !isModalOpen) return null;

  return (
    <>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-[320px] sm:w-[380px] max-h-[80vh] bg-[#0d0d0d] border border-gray-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/80 bg-[#111]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" />
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Thông báo</h3>
            </div>
            <button 
              onClick={onMarkAllRead}
              className="text-[10px] text-accent hover:text-white uppercase font-black tracking-widest transition-colors"
            >
              Đánh dấu đã đọc
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d0d0d]">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-800/50">
                {notifications.map((noti) => {
                  const style = getNotificationStyle(noti.type);
                  return (
                    <div 
                      key={noti.id}
                      onClick={() => handleNotificationClick(noti)}
                      className={`p-5 transition-all duration-300 cursor-pointer group relative ${!noti.isRead ? 'bg-white/[0.02]' : ''} ${style.hoverBgClass}`}
                    >
                      {!noti.isRead && (
                        <div className="absolute top-6 right-5 w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
                      )}
                      <div className="flex gap-4">
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${!noti.isRead ? style.bgClass : 'bg-gray-800/30 border-gray-800 text-gray-500'}`}>
                          {style.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold mb-1 transition-colors ${!noti.isRead ? style.textClass : 'text-gray-400 group-hover:text-gray-300'}`}>
                            {noti.title}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">
                            {noti.message}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold uppercase">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(noti.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center">
                <Bell className="w-10 h-10 text-gray-800 mx-auto mb-4 opacity-20" />
                <p className="text-gray-600 text-sm">Không có thông báo mới</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#111] border-t border-gray-800/80">
            <button 
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all text-xs font-bold uppercase tracking-widest"
            >
              Đóng
            </button>
          </div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #1a1a1a;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #d4af37;
            }
          `}</style>
        </div>
      )}

      {/* Modal is rendered outside the dropdown flow to cover the screen */}
      <div id="notification-detail-modal">
        <NotificationDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          notification={selectedNotification}
        />
      </div>
    </>
  );
};

export default NotificationDropdown;

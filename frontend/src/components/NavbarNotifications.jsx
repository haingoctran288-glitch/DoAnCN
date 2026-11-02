import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell } from 'lucide-react';
import ReactDOM from 'react-dom';
import { Bell as BellIcon, Check, X, Sparkles, Calendar, Tag, Clock, CreditCard, AlertCircle, MessageSquare } from 'lucide-react';
import NotificationDetailModal from './NotificationDetailModal';
import { getNotifications, getUnreadCount, markAllAsRead, markAsRead } from '../api/notifications';

// ── helpers ──────────────────────────────────────────────────────────────────
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
};

const getStyle = (type) => {
  switch (type) {
    case 'cancel':   return { icon: <AlertCircle className="w-4 h-4" />, bgClass: 'bg-red-500/10 border-red-500/20 text-red-500',    textClass: 'text-red-400',    hover: 'hover:bg-red-500/5' };
    case 'voucher':  return { icon: <Tag          className="w-4 h-4" />, bgClass: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500', textClass: 'text-yellow-400', hover: 'hover:bg-white/[0.03]' };
    case 'booking':  return { icon: <Calendar     className="w-4 h-4" />, bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500',   textClass: 'text-blue-400',   hover: 'hover:bg-white/[0.03]' };
    case 'payment':
    case 'approve':  return { icon: <CreditCard   className="w-4 h-4" />, bgClass: 'bg-green-500/10 border-green-500/20 text-green-500', textClass: 'text-green-400',  hover: 'hover:bg-white/[0.03]' };
    case 'chat_reply':return { icon: <MessageSquare className="w-4 h-4" />, bgClass: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500', textClass: 'text-indigo-400', hover: 'hover:bg-white/[0.03]' };
    default:         return { icon: <BellIcon     className="w-4 h-4" />, bgClass: 'bg-accent/10 border-accent/20 text-accent',          textClass: 'text-white',      hover: 'hover:bg-white/[0.03]' };
  }
};
// ─────────────────────────────────────────────────────────────────────────────

const NavbarNotifications = () => {
  const [isOpen, setIsOpen]             = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropPos, setDropPos]           = useState({ top: 0, right: 16 });
  const [selected, setSelected]         = useState(null);   // for detail modal
  const [isModalOpen, setIsModalOpen]   = useState(false);

  const bellRef     = useRef(null);
  const dropRef     = useRef(null);

  // ── fetch ────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const [count, list] = await Promise.all([getUnreadCount(), getNotifications()]);
      setUnreadCount(count);
      setNotifications(list);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, [fetchData]);

  // ── click-outside for dropdown ───────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e) => {
      if (bellRef.current?.contains(e.target)) return;          // let bell toggle handle it
      if (dropRef.current?.contains(e.target)) return;          // inside dropdown → ignore
      if (document.getElementById('notif-detail-portal')?.contains(e.target)) return; // inside modal
      setIsOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [isOpen]);

  // ── toggle bell ──────────────────────────────────────────────────────────
  const handleToggle = () => {
    if (!isOpen && bellRef.current) {
      const r = bellRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 8, right: Math.max(window.innerWidth - r.right, 16) });
    }
    setIsOpen(prev => !prev);
  };

  // ── mark all read ────────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try { await markAllAsRead(); setUnreadCount(0); fetchData(); } catch (e) { console.error(e); }
  };

  // ── click notification item ──────────────────────────────────────────────
  const handleNotifClick = (noti) => {
    if (!noti.isRead) markAsRead(noti.id).then(fetchData).catch(console.error);
    if (noti.type === 'cancel' || noti.type === 'approve' || noti.type === 'system' || noti.type === 'chat_reply') {
      setIsOpen(false);          // close dropdown first
      setSelected(noti);
      setIsModalOpen(true);
    }
  };

  // ── close all ────────────────────────────────────────────────────────────
  const handleCloseAll = () => { setIsOpen(false); setIsModalOpen(false); };

  // ── portal node ─────────────────────────────────────────────────────────
  const portalRoot = typeof document !== 'undefined' ? document.body : null;

  return (
    <>
      {/* Bell button */}
      <div className="relative">
        <button
          ref={bellRef}
          onClick={handleToggle}
          className={`relative p-2 rounded-xl transition-all duration-300 group ${isOpen ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:text-accent hover:bg-white/5'}`}
        >
          <Bell className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover:rotate-12'}`} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#000] shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Dropdown – rendered via Portal so it's NEVER clipped ── */}
      {portalRoot && isOpen && ReactDOM.createPortal(
        <div
          ref={dropRef}
          style={{ position: 'fixed', top: dropPos.top, right: dropPos.right, zIndex: 99999 }}
          className="w-[320px] sm:w-[380px] max-h-[80vh] bg-[#0d0d0d] border border-gray-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/80 bg-[#111] flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" />
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Thông báo</h3>
            </div>
            <button onClick={handleMarkAllRead} className="text-[10px] text-accent hover:text-white uppercase font-black tracking-widest transition-colors">
              Đánh dấu đã đọc
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1a1a1a transparent' }}>
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-800/50">
                {notifications.map((noti) => {
                  const s = getStyle(noti.type);
                  return (
                    <div
                      key={noti.id}
                      onClick={() => handleNotifClick(noti)}
                      className={`p-5 transition-all duration-200 cursor-pointer group relative ${!noti.isRead ? 'bg-white/[0.02]' : ''} ${s.hover}`}
                    >
                      {!noti.isRead && (
                        <div className="absolute top-6 right-5 w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                      )}
                      <div className="flex gap-4">
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${!noti.isRead ? s.bgClass : 'bg-gray-800/30 border-gray-800 text-gray-500'}`}>
                          {s.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold mb-1 transition-colors ${!noti.isRead ? s.textClass : 'text-gray-400 group-hover:text-gray-300'}`}>
                            {noti.title}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">{noti.message}</p>
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
          <div className="p-3 bg-[#111] border-t border-gray-800/80 flex-shrink-0">
            <button
              onClick={handleCloseAll}
              className="w-full py-2.5 rounded-xl border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all text-xs font-bold uppercase tracking-widest"
            >
              Đóng
            </button>
          </div>
        </div>,
        portalRoot
      )}

      {/* ── Detail Modal – also via Portal, on top of everything ── */}
      {portalRoot && ReactDOM.createPortal(
        <div id="notif-detail-portal">
          <NotificationDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            notification={selected}
          />
        </div>,
        portalRoot
      )}
    </>
  );
};

export default NavbarNotifications;

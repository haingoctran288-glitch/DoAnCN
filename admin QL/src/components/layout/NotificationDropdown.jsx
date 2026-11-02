import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Typography, Space, Button } from 'antd';
import { Bell, MessageSquare, Check, Info, AlertTriangle, CalendarClock, ShoppingCart, UserSquare2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../../api';

const { Text } = Typography;

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        notificationApi.getAll(),
        notificationApi.getUnreadCount()
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    
    const handleClickOutside = (e) => {
      const dropdown = document.getElementById('admin-notif-dropdown');
      const toggle = document.getElementById('admin-notif-toggle');
      if (dropdown && !dropdown.contains(e.target) && toggle && !toggle.contains(e.target)) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notif) => {
    handleMarkAsRead(notif.id);
    setVisible(false);
    
    // Navigate based on type
    if (notif.type === 'system' || notif.type === 'chat_request') {
      navigate('/chats');
    } else if (notif.type === 'chat') {
      navigate('/owner-chat');
    } else if (notif.type === 'booking') {
      navigate('/bookings');
    } else if (notif.type === 'order') {
      navigate('/orders');
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const pad = (n) => n.toString().padStart(2, '0');
      return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
    } catch(e) {
      return '';
    }
  };

  const getIcon = (item) => {
    const opacity = item.isRead ? '0.5' : '1';
    if (item.title === 'Khách hàng báo cáo vi phạm') return <AlertTriangle size={18} color={`rgba(239, 68, 68, ${opacity})`} />;
    if (item.type === 'booking') return <CalendarClock size={18} color={`rgba(74, 222, 128, ${opacity})`} />;
    if (item.type === 'order') return <ShoppingCart size={18} color={`rgba(249, 115, 22, ${opacity})`} />;
    if (item.type === 'chat') return <MessageSquare size={18} color={`rgba(212, 175, 55, ${opacity})`} />;
    if (item.type === 'system' || item.type === 'chat_request') return <UserSquare2 size={18} color={`rgba(59, 130, 246, ${opacity})`} />;
    return <Info size={18} color={`rgba(168, 162, 158, ${opacity})`} />;
  };

  const getIconBg = (item) => {
    const bgOpacity = item.isRead ? '0.05' : '0.15';
    if (item.title === 'Khách hàng báo cáo vi phạm') return `rgba(239, 68, 68, ${bgOpacity})`;
    if (item.type === 'booking') return `rgba(74, 222, 128, ${bgOpacity})`;
    if (item.type === 'order') return `rgba(249, 115, 22, ${bgOpacity})`;
    if (item.type === 'chat') return `rgba(212, 175, 55, ${bgOpacity})`;
    if (item.type === 'system' || item.type === 'chat_request') return `rgba(59, 130, 246, ${bgOpacity})`;
    return `rgba(168, 162, 158, ${bgOpacity})`;
  };

  const getTitleColor = (item) => {
    if (item.title === 'Khách hàng báo cáo vi phạm') return '#ef4444';
    return item.isRead ? '#888' : '#fff';
  };

  const content = (
    <div style={{ width: 340, maxHeight: 450, display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          .notif-item {
            padding: 20px;
            cursor: pointer;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            transition: all 0.3s ease;
            position: relative;
          }
          .notif-item:hover {
            background-color: rgba(255,255,255,0.03) !important;
          }
          .notif-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .notif-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .notif-scroll::-webkit-scrollbar-thumb {
            background: #1a1a1a;
            border-radius: 10px;
          }
          .notif-scroll::-webkit-scrollbar-thumb:hover {
            background: #d4af37;
          }
        `}
      </style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="#d4af37" />
          <Text strong style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>THÔNG BÁO</Text>
        </div>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllAsRead} style={{ color: '#d4af37', padding: 0, fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>
            ĐÁNH DẤU ĐÃ ĐỌC
          </Button>
        )}
      </div>
      
      <div style={{ overflowY: 'auto', flex: 1, backgroundColor: '#0d0d0d' }} className="notif-scroll">
        {notifications.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Bell size={40} color="#333" style={{ opacity: 0.2, marginBottom: '16px' }} />
            <span style={{ fontSize: '14px' }}>Không có thông báo mới</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((item) => (
              <div
                key={item.id}
                className="notif-item group"
                style={{ 
                  backgroundColor: item.isRead ? 'transparent' : 'rgba(255,255,255,0.02)'
                }}
                onClick={() => handleNotificationClick(item)}
              >
                {!item.isRead && (
                  <div style={{ position: 'absolute', top: '24px', right: '20px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d4af37', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }}></div>
                )}
                <div style={{ display: 'flex', width: '100%', gap: '16px' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '12px', 
                    backgroundColor: item.isRead ? 'rgba(255,255,255,0.05)' : getIconBg(item), 
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                  }}>
                    {getIcon(item)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Text strong style={{ color: item.isRead ? '#9ca3af' : getTitleColor(item), fontSize: '14px', marginBottom: '4px', transition: 'color 0.3s' }}>
                      {item.title}
                    </Text>
                    <Text style={{ color: '#6b7280', fontSize: '12px', display: 'block', marginBottom: '8px', lineHeight: '1.5', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.message}
                    </Text>
                    <Text style={{ color: '#4b5563', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {formatDateTime(item.createdAt)}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ padding: '12px', backgroundColor: '#111', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button 
          onClick={() => setVisible(false)}
          style={{ width: '100%', padding: '10px 0', borderRadius: '12px', border: '1px solid #333', background: 'transparent', color: '#666', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#555'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#333'; }}
        >
          Đóng
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
      <div 
        id="admin-notif-toggle"
        style={{ cursor: 'pointer', color: '#d4af37', display: 'flex', alignItems: 'center', padding: '0 12px', transition: 'opacity 0.2s', marginTop: '10px' }} 
        onClick={() => setVisible(!visible)}
      >
        <Badge count={unreadCount} size="small" color="#ef4444" style={{ boxShadow: '0 0 0 1px #111' }}>
          <Bell size={22} color="#d4af37" />
        </Badge>
      </div>

      {visible && (
        <div 
          id="admin-notif-dropdown"
          style={{ 
            position: 'absolute', 
            top: '100%', 
            right: 0, 
            marginTop: '8px', 
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {content}
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;

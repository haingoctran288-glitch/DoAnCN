import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { MessageSquare, Search, Clock, Reply, AlertTriangle, X, Send } from 'lucide-react';
import { Table, Tag, Input, Button, message } from 'antd';
import dayjs from 'dayjs';

const CustomerChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'ADMIN';
  const staffId = user.employeeId;
  const staffName = user.fullName;

  const removeAccents = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/chats');
      let data = response.data || [];
      if (userRole === 'EMPLOYEE' || userRole === 'BARBER') {
        data = data.filter(c => {
          const barberIdMatch = staffId && c.barber?.id === staffId;
          const barberNameMatch = c.barber?.name && staffName &&
            removeAccents(c.barber.name).trim().toLowerCase() === removeAccents(staffName).trim().toLowerCase();
          return barberIdMatch || barberNameMatch;
        });
      }
      if (userRole === 'EDITOR') {
        data = data.filter(c => c.barber?.branch === user.branch);
      }
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
      message.error('Không thể tải danh sách chat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChats(); }, [userRole]);

  const handleReply = async () => {
    if (!replyText.trim()) { message.warning('Vui lòng nhập nội dung phản hồi!'); return; }
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:8080/api/chats/${selectedChat.id}/reply`, { reply: replyText });
      message.success('Đã gửi phản hồi thành công!');
      setIsModalVisible(false);
      setReplyText('');
      fetchChats();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi phản hồi');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredChats = chats.filter(chat => {
    // Text search
    const matchSearch = chat.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      chat.customerContact?.toLowerCase().includes(searchText.toLowerCase()) ||
      chat.barber?.name?.toLowerCase().includes(searchText.toLowerCase());
    
    // Date filter
    const matchDate = filterDate ? dayjs(chat.createdAt).format('YYYY-MM-DD') === filterDate : true;

    // Branch filter
    const matchBranch = filterBranch ? chat.barber?.branch === filterBranch : true;

    return matchSearch && matchDate && matchBranch;
  });

  const getStatusBadge = (status, isRecalled) => {
    if (isRecalled) return <span style={{ background: '#374151', color: '#9ca3af', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Đã thu hồi</span>;
    const map = {
      PENDING: { bg: '#422006', color: '#fb923c', label: 'Chờ phản hồi' },
      REPLIED: { bg: '#052e16', color: '#4ade80', label: 'Đã phản hồi' },
      REPORTED: { bg: '#450a0a', color: '#f87171', label: 'Bị báo cáo' },
    };
    const s = map[status] || { bg: '#1f2937', color: '#9ca3af', label: status };
    return <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${s.color}33` }}>{s.label}</span>;
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: '700', color: '#f3f4f6' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {(userRole === 'ADMIN' || userRole === 'EDITOR') ? (record.user?.email || record.customerContact || 'Khách hàng') : 'Khách hàng'}
          </div>
        </div>
      ),
    },
    {
      title: 'Gửi tới Thợ',
      key: 'barberName',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '700', color: '#d4af37' }}>{record.barber?.name}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{record.barber?.branch}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => getStatusBadge(record.status, record.isRecalled),
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span style={{ fontSize: '13px', color: '#9ca3af' }}>{dayjs(date).format('DD/MM/YYYY HH:mm')}</span>,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <button
          onClick={() => { setSelectedChat(record); setIsModalVisible(true); setReplyText(''); }}
          style={{ background: 'linear-gradient(135deg, #d4af37, #b38e21)', color: '#000', border: 'none', padding: '7px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  const isMatchingStaff = (staffId && selectedChat?.barber?.id === staffId) ||
    (selectedChat?.barber?.name && staffName &&
      removeAccents(selectedChat.barber.name).trim().toLowerCase() === removeAccents(staffName).trim().toLowerCase());

  const canReply = (userRole === 'BARBER' || userRole === 'EMPLOYEE') &&
    isMatchingStaff && selectedChat?.status === 'PENDING' && !selectedChat?.isRecalled;

  const imgSrc = (url) => url?.startsWith('http') ? url : `http://localhost:8080${url}`;

  // The Custom Modal JSX is now inlined directly below to prevent re-mounting on keystrokes.

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#d4af37', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare style={{ width: '22px', height: '22px' }} />
          Tư vấn Khách hàng
        </h1>
        <p style={{ margin: '4px 0 0 32px', color: '#4b5563', fontSize: '13px' }}>Quản lý các yêu cầu tư vấn từ khách hàng gửi tới thợ</p>
      </div>

      {/* Table Card */}
      <div style={{ background: '#111', borderRadius: '14px', border: '1px solid #1f1f1f', overflow: 'hidden', flex: 1 }}>
        {/* Search bar & Filters */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '300px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '0 12px', transition: 'border-color 0.2s' }}>
            <Search style={{ width: '16px', height: '16px', color: '#4b5563', flexShrink: 0 }} />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Tìm theo tên khách, số điện thoại, tên thợ..."
              style={{ width: '100%', background: 'transparent', border: 'none', padding: '8px 10px', color: '#e5e7eb', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', color: '#e5e7eb', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
          />

          <select
            value={filterBranch}
            onChange={e => setFilterBranch(e.target.value)}
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', color: '#e5e7eb', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
          >
            <option value="">Tất cả chi nhánh</option>
            <option value="Quận 1">Quận 1</option>
            <option value="Quận 2">Quận 2</option>
            <option value="Quận 3">Quận 3</option>
            <option value="Quận 7">Quận 7</option>
            <option value="Gò Vấp">Gò Vấp</option>
          </select>

          <button
            onClick={() => {
              setSearchText('');
              setFilterDate('');
              setFilterBranch('');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#222', border: '1px solid #333', color: '#d1d5db', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#d1d5db'; }}
          >
            Làm mới
          </button>
        </div>

        {/* Table with dark theme via className override */}
        <style>{`
          .sf-chat-table .ant-table { background: transparent !important; }
          .sf-chat-table .ant-table-thead > tr > th { background: #0a0a0a !important; color: #6b7280 !important; border-bottom: 1px solid #1f1f1f !important; font-size: 11px !important; text-transform: uppercase !important; letter-spacing: 0.08em !important; font-weight: 700 !important; }
          .sf-chat-table .ant-table-tbody > tr > td { background: transparent !important; border-bottom: 1px solid #141414 !important; color: #e5e7eb !important; }
          .sf-chat-table .ant-table-tbody > tr:hover > td { background: #161616 !important; }
          .sf-chat-table .ant-pagination .ant-pagination-item { background: #1a1a1a !important; border-color: #2a2a2a !important; }
          .sf-chat-table .ant-pagination .ant-pagination-item a { color: #9ca3af !important; }
          .sf-chat-table .ant-pagination .ant-pagination-item-active { border-color: #d4af37 !important; }
          .sf-chat-table .ant-pagination .ant-pagination-item-active a { color: #d4af37 !important; }
          .sf-chat-table .ant-pagination .ant-pagination-prev button, .sf-chat-table .ant-pagination .ant-pagination-next button { color: #9ca3af !important; background: #1a1a1a !important; border-color: #2a2a2a !important; }
          .sf-chat-table .ant-spin-dot-item { background: #d4af37 !important; }
          .sf-chat-table .ant-table-cell-row-hover { background: #161616 !important; }
        `}</style>

        <Table
          className="sf-chat-table"
          columns={columns}
          dataSource={filteredChats}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, style: { padding: '12px 20px', background: '#0a0a0a', margin: 0, borderTop: '1px solid #1f1f1f' } }}
          scroll={{ x: 'max-content' }}
        />
      </div>

      {isModalVisible && selectedChat && ReactDOM.createPortal(
        <div
          onClick={() => setIsModalVisible(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '660px', background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.1)' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #1f1f1f', background: '#0a0a0a', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare style={{ width: '18px', height: '18px', color: '#d4af37' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: '#d4af37', fontSize: '15px', letterSpacing: '0.02em' }}>Chi tiết tư vấn</div>
                  <div style={{ fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hornet Royale</div>
                </div>
              </div>
              <button onClick={() => setIsModalVisible(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#6b7280'; }}>
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#0f0f0f' }}>

              {/* Customer bubble - LEFT */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '80%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', marginLeft: '4px' }}>
                  {selectedChat.user?.avatar ? (
                    <img src={imgSrc(selectedChat.user.avatar)} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} alt="avatar" />
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#9ca3af' }}>
                      {selectedChat.customerName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#e5e7eb' }}>{selectedChat.customerName}</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#6b7280', background: '#1f2937', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Khách hàng</span>
                </div>
                <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px', borderTopLeftRadius: '4px', padding: '14px 16px' }}>
                  <p style={{ margin: 0, color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedChat.message}</p>
                  {selectedChat.imageUrl && (
                    <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #2a2a2a', maxWidth: '280px', cursor: 'pointer' }}
                      onClick={() => window.open(imgSrc(selectedChat.imageUrl), '_blank')}>
                      <img src={imgSrc(selectedChat.imageUrl)} alt="Đính kèm" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '200px', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.target.style.opacity = '0.8'}
                        onMouseLeave={e => e.target.style.opacity = '1'} />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px', marginLeft: '4px', fontSize: '11px', color: '#4b5563' }}>
                  <Clock style={{ width: '11px', height: '11px' }} />
                  {dayjs(selectedChat.createdAt).format('HH:mm - DD/MM/YYYY')}
                </div>
              </div>

              {/* Barber reply bubble - RIGHT */}
              {selectedChat.reply && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '80%', alignSelf: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', marginRight: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#d4af37', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(212,175,55,0.25)' }}>Thợ phản hồi</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#d4af37' }}>{selectedChat.barber?.name}</span>
                    {selectedChat.barber?.avatar ? (
                      <img src={imgSrc(selectedChat.barber.avatar)} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(212,175,55,0.3)' }} alt="avatar" />
                    ) : (
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}>
                        {selectedChat.barber?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #d4af37, #b38e21)', borderRadius: '16px', borderTopRightRadius: '4px', padding: '14px 16px', boxShadow: '0 4px 20px rgba(212,175,55,0.2)' }}>
                    <p style={{ margin: 0, color: '#000', fontSize: '14px', lineHeight: '1.6', fontWeight: '600', whiteSpace: 'pre-wrap' }}>{selectedChat.reply}</p>
                  </div>
                  {selectedChat.repliedAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px', marginRight: '4px', fontSize: '11px', color: '#4b5563' }}>
                      <Clock style={{ width: '11px', height: '11px' }} />
                      {dayjs(selectedChat.repliedAt).format('HH:mm - DD/MM/YYYY')}
                    </div>
                  )}
                </div>
              )}

              {/* Report info */}
              {selectedChat.status === 'REPORTED' && (
                <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    <AlertTriangle style={{ width: '16px', height: '16px' }} />
                    Khách hàng báo cáo cuộc trò chuyện
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '700', color: '#6b7280', minWidth: '48px' }}>Lý do:</span>
                    <span style={{ color: '#f87171', fontWeight: '600' }}>{selectedChat.reportReason}</span>
                  </div>
                  {selectedChat.reportDetails && (
                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid rgba(239,68,68,0.1)' }}>
                      <span style={{ fontWeight: '700', color: '#6b7280', minWidth: '48px' }}>Chi tiết:</span>
                      <span style={{ color: '#d1d5db' }}>{selectedChat.reportDetails}</span>
                    </div>
                  )}
                  {selectedChat.reportedAt && (
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', marginTop: '8px', color: '#6b7280' }}>
                      <Clock style={{ width: '12px', height: '12px' }} />
                      Thời gian báo cáo: {dayjs(selectedChat.reportedAt).format('HH:mm - DD/MM/YYYY')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reply form or info bar */}
            <div style={{ borderTop: '1px solid #1f1f1f', padding: '16px 24px', background: '#0a0a0a', flexShrink: 0 }}>
              {!selectedChat.reply && canReply ? (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Reply style={{ width: '13px', height: '13px' }} /> Soạn phản hồi
                  </div>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Nhập nội dung tư vấn gửi cho khách hàng..."
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '10px 14px', color: '#e5e7eb', fontSize: '14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: '1.5', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#d4af37'}
                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button
                      onClick={handleReply}
                      disabled={submitting}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #d4af37, #b38e21)', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: submitting ? 'not-allowed' : 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: submitting ? 0.7 : 1, transition: 'all 0.2s' }}
                      onMouseEnter={e => !submitting && (e.currentTarget.style.transform = 'translateY(-1px)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <Send style={{ width: '15px', height: '15px' }} />
                      {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#4b5563', fontSize: '13px', padding: '4px 0' }}>
                  {selectedChat.reply
                    ? <span style={{ color: '#4ade80', fontWeight: '600' }}>✓ Đã phản hồi</span>
                    : selectedChat.isRecalled
                      ? 'Tin nhắn này đã bị thu hồi.'
                      : 'Chỉ thợ được chọn mới có quyền phản hồi tin nhắn này.'}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomerChats;

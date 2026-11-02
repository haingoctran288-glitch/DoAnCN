import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag, notification, Spin, Empty, Select, Popconfirm } from 'antd';
import { CalendarClock, User as UserIcon, Phone, Clock, PlayCircle, ChevronDown, ChevronUp, MessageSquare, RotateCcw, CheckCircle2 } from 'lucide-react';
import { workScheduleApi, staffApi, bookingApi } from '../api';

const { Title, Text } = Typography;

const WorkSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('today'); // today, tomorrow, week, month, all
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [fullStaffList, setFullStaffList] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedBookings, setExpandedBookings] = useState({});
  const [completingId, setCompletingId] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = (id) => {
    setExpandedBookings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      let res;
      if (currentUser.role === 'EMPLOYEE') {
        res = await workScheduleApi.getMySchedule();
      } else if (currentUser.role === 'EDITOR') {
        res = await workScheduleApi.getBranchSchedule();
      } else {
        res = await workScheduleApi.getAllSchedules();
      }
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      notification.error({ message: 'Lỗi', description: 'Không thể tải lịch làm việc.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await staffApi.getAll();
      setFullStaffList(res.data || []);
    } catch (err) {
      console.error('Không thể lấy danh sách nhân viên:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchStaff();
  }, []);

  const handleComplete = async (bookingId) => {
    setCompletingId(bookingId);
    try {
      await bookingApi.updateStatus(bookingId, 'COMPLETED');
      setSchedules(prev =>
        prev.map(s => s.id === bookingId ? { ...s, status: 'COMPLETED' } : s)
      );
      notification.success({
        message: 'Hoàn Thành',
        description: `Lịch hẹn #${bookingId} đã được đánh dấu hoàn thành.`,
        placement: 'topRight',
      });
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: err?.response?.data || 'Không thể cập nhật trạng thái. Vui lòng thử lại.',
        placement: 'topRight',
      });
    } finally {
      setCompletingId(null);
    }
  };

  // Timezone-safe date parser
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  };

  // Date check functions
  const isToday = (dateStr) => {
    const target = parseLocalDate(dateStr);
    if (!target) return false;
    const now = new Date();
    return target.getDate() === now.getDate() &&
      target.getMonth() === now.getMonth() &&
      target.getFullYear() === now.getFullYear();
  };

  const isTomorrow = (dateStr) => {
    const target = parseLocalDate(dateStr);
    if (!target) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return target.getDate() === tomorrow.getDate() &&
      target.getMonth() === tomorrow.getMonth() &&
      target.getFullYear() === tomorrow.getFullYear();
  };

  const isInCurrentWeek = (dateStr) => {
    const target = parseLocalDate(dateStr);
    if (!target) return false;
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return target >= monday && target <= sunday;
  };

  const isInCurrentMonth = (dateStr) => {
    const target = parseLocalDate(dateStr);
    if (!target) return false;
    const now = new Date();
    return target.getMonth() === now.getMonth() && target.getFullYear() === now.getFullYear();
  };

  // Format date helper
  const formatBookingDate = (dateStr) => {
    const target = parseLocalDate(dateStr);
    if (!target) return dateStr;
    const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const day = String(target.getDate()).padStart(2, '0');
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const year = target.getFullYear();
    return `${weekdays[target.getDay()]}, ${day}/${month}/${year}`;
  };

  // Stats calculation
  const stats = {
    today: schedules.filter(s => isToday(s.bookingDate) && s.status !== 'CANCELLED').length,
    tomorrow: schedules.filter(s => isTomorrow(s.bookingDate) && s.status !== 'CANCELLED').length,
    week: schedules.filter(s => isInCurrentWeek(s.bookingDate) && s.status !== 'CANCELLED').length,
    month: schedules.filter(s => isInCurrentMonth(s.bookingDate) && s.status !== 'CANCELLED').length,
  };

  // Extract unique filter options
  const branches = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Quận 9', 'Bình Thạnh'];
  const branchMap = {
    'CN 1': 'Quận 1',
    'CN 2': 'Quận 2',
    'CN 3': 'Quận 3',
    'CN 7': 'Quận 7',
    'CN 9': 'Quận 9',
    'CN BT': 'Bình Thạnh'
  };
  const editorBranchName = branchMap[currentUser.branch] || currentUser.branch;

  const staffList = [...new Set(
    fullStaffList
      .filter(s => {
        if (currentUser.role === 'ADMIN') {
          return selectedBranch === 'all' || s.branch === selectedBranch;
        } else if (currentUser.role === 'EDITOR') {
          return s.branch === editorBranchName;
        }
        return true;
      })
      .map(s => s.name)
      .filter(Boolean)
  )];

  // Reset staff filter when branch changes
  useEffect(() => {
    setSelectedStaff('all');
  }, [selectedBranch]);

  // Filter schedules
  const getFilteredSchedules = () => {
    return schedules.filter(s => {
      // Tab filter
      let matchTab = false;
      if (activeTab === 'today') matchTab = isToday(s.bookingDate);
      else if (activeTab === 'tomorrow') matchTab = isTomorrow(s.bookingDate);
      else if (activeTab === 'week') matchTab = isInCurrentWeek(s.bookingDate);
      else if (activeTab === 'month') matchTab = isInCurrentMonth(s.bookingDate);
      else matchTab = true; // all
      if (!matchTab) return false;

      // Branch filter
      if (selectedBranch !== 'all' && s.branch !== selectedBranch) return false;

      // Staff filter
      if (selectedStaff !== 'all' && s.staffName !== selectedStaff) return false;

      // Status filter
      if (selectedStatus === 'pending') {
        if (!['PENDING', 'PAID', 'IN_PROGRESS'].includes(s.status)) return false;
      } else if (selectedStatus === 'completed') {
        if (s.status !== 'COMPLETED') return false;
      } else if (selectedStatus === 'cancelled') {
        if (s.status !== 'CANCELLED') return false;
      }

      return true;
    });
  };

  const filteredList = getFilteredSchedules();

  // Group by date
  const groupedSchedules = {};
  filteredList.forEach(item => {
    const dateKey = item.bookingDate;
    if (!groupedSchedules[dateKey]) {
      groupedSchedules[dateKey] = [];
    }
    groupedSchedules[dateKey].push(item);
  });

  const sortedDates = Object.keys(groupedSchedules).sort((a, b) => {
    const da = parseLocalDate(a);
    const db = parseLocalDate(b);
    return db - da; // Luôn mới nhất lên đầu (Descending)
  });

  // Sắp xếp giờ giảm dần (Mới nhất lên đầu) trong cùng một ngày
  sortedDates.forEach(dateKey => {
    groupedSchedules[dateKey].sort((a, b) => {
      const ta = a.bookingTime || '00:00:00';
      const tb = b.bookingTime || '00:00:00';
      return tb.localeCompare(ta);
    });
  });

  const getStatusTag = (status) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="warning" style={{ margin: 0 }}>CHỜ THỰC HIỆN</Tag>;
      case 'IN_PROGRESS':
        return <Tag color="processing" icon={<PlayCircle size={12} style={{ marginRight: 2 }} />} style={{ margin: 0 }}>ĐANG THỰC HIỆN</Tag>;
      case 'PAID':
        return <Tag color="cyan" style={{ margin: 0 }}>ĐÃ THANH TOÁN</Tag>;
      case 'COMPLETED':
        return <Tag color="success" style={{ margin: 0 }}>HOÀN THÀNH</Tag>;
      case 'CANCELLED':
        return <Tag color="error" style={{ margin: 0 }}>ĐÃ HỦY</Tag>;
      default:
        return <Tag color="default" style={{ margin: 0 }}>{status}</Tag>;
    }
  };

  return (
    <div style={{ 
      padding: isMobile ? '12px' : '24px', 
      maxWidth: 900, 
      margin: '0 auto', 
      minHeight: '80vh', 
      backgroundColor: '#000' 
    }}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Title Header */}
      <div style={{ marginBottom: isMobile ? 20 : 32 }}>
        <Title level={isMobile ? 3 : 2} style={{ color: '#fff', margin: 0, fontFamily: '"Playfair Display", serif', letterSpacing: '1px' }}>
          LỊCH LÀM VIỆC <span style={{ color: '#d4af37' }}>ROYALE</span>
        </Title>
        <Text style={{ color: '#888', fontSize: isMobile ? 12 : 13, letterSpacing: '0.5px' }}>
          {currentUser.role === 'EMPLOYEE'
            ? `Lịch phân công cá nhân thợ (Role: ${currentUser.role})`
            : `Hệ thống quản lý lịch hẹn chi nhánh (Role: ${currentUser.role})`}
        </Text>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 10 : 16,
        marginBottom: isMobile ? 24 : 32
      }}>
        {[
          { label: 'HÔM NAY', count: stats.today, activeKey: 'today' },
          { label: 'NGÀY MAI', count: stats.tomorrow, activeKey: 'tomorrow' },
          { label: 'TUẦN NÀY', count: stats.week, activeKey: 'week' },
          { label: 'THÁNG NÀY', count: stats.month, activeKey: 'month' }
        ].map((item, index) => (
          <Card
            key={index}
            style={{
              backgroundColor: '#111',
              borderColor: activeTab === item.activeKey ? '#d4af37' : '#222',
              boxShadow: activeTab === item.activeKey ? '0 0 12px rgba(212,175,55,0.15)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            styles={{ body: { padding: isMobile ? '12px' : '24px' } }}
            onClick={() => setActiveTab(item.activeKey)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: isMobile ? 9 : 11, color: '#888', fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>{item.label}</span>
              <span style={{ fontSize: isMobile ? 16 : 24, fontWeight: 900, color: activeTab === item.activeKey ? '#d4af37' : '#fff' }}>{item.count} lịch</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: isMobile ? 24 : 32,
          borderBottom: '1px solid #222',
          paddingBottom: 12,
          overflowX: 'auto',
          width: '100%',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {[
          { key: 'today', label: 'Hôm Nay' },
          { key: 'tomorrow', label: 'Ngày Mai' },
          { key: 'week', label: 'Tuần Này' },
          { key: 'month', label: 'Tháng Này' },
          { key: 'all', label: 'Tất Cả' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: isMobile ? '6px 12px' : '8px 16px',
              backgroundColor: activeTab === tab.key ? '#d4af37' : 'transparent',
              color: activeTab === tab.key ? '#000' : '#888',
              border: activeTab === tab.key ? '1px solid #d4af37' : '1px solid #222',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: isMobile ? '12px' : '13px',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
        backgroundColor: '#111',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #222'
      }}>
        {currentUser.role === 'ADMIN' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 150 }}>
            <Text style={{ color: '#888', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Chi Nhánh</Text>
            <Select
              value={selectedBranch}
              onChange={setSelectedBranch}
              style={{ width: '100%' }}
              dropdownStyle={{ backgroundColor: '#222', color: '#fff' }}
              options={[
                { value: 'all', label: 'Tất cả chi nhánh' },
                ...branches.map(b => ({ value: b, label: b }))
              ]}
            />
          </div>
        )}

        {(currentUser.role === 'ADMIN' || currentUser.role === 'EDITOR') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 150 }}>
            <Text style={{ color: '#888', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Thợ Cắt</Text>
            <Select
              value={selectedStaff}
              onChange={setSelectedStaff}
              style={{ width: '100%' }}
              dropdownStyle={{ backgroundColor: '#222', color: '#fff' }}
              options={[
                { value: 'all', label: 'Tất cả thợ' },
                ...staffList.map(s => ({ value: s, label: s }))
              ]}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 150 }}>
          <Text style={{ color: '#888', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Trạng Thái</Text>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: '100%' }}
            dropdownStyle={{ backgroundColor: '#222', color: '#fff' }}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'pending', label: 'Chưa hoàn thành' },
              { value: 'completed', label: 'Hoàn thành' },
              { value: 'cancelled', label: 'Đã hủy' }
            ]}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', minWidth: 140 }}>
          <button
            onClick={() => {
              setSelectedBranch('all');
              setSelectedStaff('all');
              setSelectedStatus('all');
            }}
            style={{
              width: '100%',
              height: '32px',
              backgroundColor: 'transparent',
              color: '#d4af37',
              border: '1px solid #d4af37',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4af37';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d4af37';
            }}
          >
            <RotateCcw size={14} />
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* Schedule List Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : sortedDates.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span style={{ color: '#888' }}>Không có lịch làm việc nào được phân công.</span>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 24 : 32 }}>
          {sortedDates.map(dateKey => (
            <div key={dateKey} style={{ borderLeft: '3px solid #d4af37', paddingLeft: isMobile ? 12 : 20 }}>
              
              {/* Date Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <CalendarClock size={isMobile ? 14 : 16} color="#d4af37" />
                <span style={{ color: '#d4af37', fontWeight: 800, fontSize: isMobile ? '13px' : '15px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {formatBookingDate(dateKey)}
                </span>
              </div>

              {/* Day's Bookings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {groupedSchedules[dateKey].map((booking) => {
                  const isExpanded = expandedBookings[booking.id];
                  return (
                    <div
                      key={booking.id}
                      style={{
                        backgroundColor: '#111',
                        border: '1px solid #222',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        transition: 'all 0.3s ease',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#d4af37';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#222';
                      }}
                    >
                      {/* Top Row: Basic Info always visible */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                        gap: 12
                      }}>
                        <div style={{ display: 'flex', gap: isMobile ? 12 : 24, alignItems: 'center' }}>
                          {/* Time */}
                          <div style={{ textAlign: 'center', minWidth: 60 }}>
                            <span style={{ fontSize: '18px', fontWeight: 900, color: '#d4af37', display: 'block' }}>
                              {booking.bookingTime ? booking.bookingTime.substring(0, 5) : '—'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#666' }}>Bắt đầu</span>
                          </div>

                          {/* Divider line */}
                          {!isMobile && <div style={{ width: 1, height: 40, backgroundColor: '#222' }} />}

                          {/* Client Info Summary */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 10px' }}>
                              <UserIcon size={14} color="#d4af37" style={{ flexShrink: 0 }} />
                              <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap' }}>
                                {booking.customerName}
                              </span>
                              {currentUser.role !== 'EMPLOYEE' && (booking.customerPhone || booking.customerEmail) && (
                                <span style={{ color: '#888', fontSize: '12px', display: 'inline-flex', flexWrap: 'wrap', gap: '4px 8px' }}>
                                  {booking.customerPhone && <span>📞 {booking.customerPhone}</span>}
                                  {booking.customerEmail && <span>✉ {booking.customerEmail}</span>}
                                </span>
                              )}
                            </div>
                            <div style={{ color: '#888', fontSize: '13px' }}>
                              Dịch vụ: <span style={{ color: '#ccc' }}>
                                {booking.services?.[0] || 'Chưa chọn'}
                                {booking.services?.length > 1 ? ` (+${booking.services.length - 1} dịch vụ khác)` : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Tag, Complete button & Toggle button */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 8, 
                          width: isMobile ? '100%' : 'auto', 
                          justifyContent: isMobile ? 'space-between' : 'flex-end',
                          marginTop: isMobile ? 8 : 0,
                          flexWrap: 'wrap'
                        }}>
                          {getStatusTag(booking.status)}

                          {/* Complete button — only for ADMIN/EDITOR on PAID bookings */}
                          {(currentUser.role === 'ADMIN' || currentUser.role === 'EDITOR') &&
                           booking.status === 'PAID' && (
                            <Popconfirm
                              title="Xác nhận hoàn thành?"
                              description={`Đánh dấu lịch hẹn #${booking.id} là hoàn thành?`}
                              onConfirm={() => handleComplete(booking.id)}
                              okText="Hoàn thành"
                              cancelText="Huỷ"
                              okButtonProps={{ style: { background: '#16a34a', borderColor: '#16a34a' } }}
                            >
                              <button
                                disabled={completingId === booking.id}
                                style={{
                                  backgroundColor: completingId === booking.id ? '#052e16' : '#14532d',
                                  color: completingId === booking.id ? '#4ade80' : '#86efac',
                                  border: '1px solid #16a34a',
                                  borderRadius: '4px',
                                  padding: '4px 10px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  cursor: completingId === booking.id ? 'not-allowed' : 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  transition: 'all 0.2s ease',
                                  outline: 'none'
                                }}
                              >
                                <CheckCircle2 size={12} />
                                {completingId === booking.id ? 'Đang lưu...' : 'Hoàn thành'}
                              </button>
                            </Popconfirm>
                          )}

                          <button
                            onClick={() => toggleExpand(booking.id)}
                            style={{
                              backgroundColor: 'transparent',
                              color: '#d4af37',
                              border: '1px solid #d4af37',
                              borderRadius: '4px',
                              padding: '4px 12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                          >
                            {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </div>
                      </div>

                      {/* Dropdown / Collapsible detail section */}
                      {isExpanded && (
                        <div style={{
                          borderTop: '1px solid #222',
                          paddingTop: 16,
                          marginTop: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 14
                        }}>
                          {/* 1. Services */}
                          <div>
                            <div style={{ color: '#d4af37', fontWeight: 600, fontSize: '12px', marginBottom: 8, letterSpacing: '0.5px' }}>
                              DANH SÁCH DỊCH VỤ ĐÃ ĐẶT ({booking.services?.length || 0})
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {booking.services?.map((srv, idx) => (
                                <Tag key={idx} style={{ backgroundColor: '#161616', borderColor: '#d4af37', color: '#fff', margin: 0, padding: '3px 6px', fontSize: '12px' }}>
                                  {srv}
                                </Tag>
                              ))}
                            </div>
                          </div>

                          {/* 2. Details grid */}
                          <div style={{
                             display: 'grid',
                             gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                             gap: 12,
                             backgroundColor: '#161616',
                             padding: '12px',
                             borderRadius: '6px',
                             border: '1px solid #222'
                           }}>
                             <div>
                               <span style={{ color: '#888', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Giờ bắt đầu</span>
                               <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                                 {booking.bookingTime ? booking.bookingTime.substring(0, 5) : '—'}
                               </span>
                             </div>
                             <div>
                               <span style={{ color: '#888', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Tổng thời gian làm</span>
                               <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                                 {booking.totalDuration} phút
                               </span>
                             </div>
                             <div>
                               <span style={{ color: '#888', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Giờ hoàn thành dự kiến</span>
                               <span style={{ color: '#d4af37', fontSize: '14px', fontWeight: 'bold' }}>
                                 {booking.estimatedFinishTime ? booking.estimatedFinishTime.substring(0, 5) : '—'}
                               </span>
                             </div>
                             <div>
                               <span style={{ color: '#888', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Chi nhánh</span>
                               <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                                 {booking.branch || '—'}
                               </span>
                             </div>
                             <div style={{ gridColumn: isMobile ? 'span 2' : 'span 1' }}>
                               <span style={{ color: '#888', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Thợ thực hiện</span>
                               <span style={{ color: '#d4af37', fontSize: '14px', fontWeight: 'bold' }}>
                                 {booking.staffName || '—'}
                               </span>
                             </div>
                           </div>

                          {/* 3. Note/Ghi chú */}
                          {booking.note && (
                            <div style={{
                              backgroundColor: '#1b160a',
                              border: '1px dashed #d4af37',
                              borderRadius: '6px',
                              padding: '12px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 8,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word'
                            }}>
                              <MessageSquare size={16} color="#d4af37" style={{ marginTop: 2, flexShrink: 0 }} />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Ghi chú của khách hàng</span>
                                <span style={{ color: '#ccc', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                  {booking.note}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkSchedule;

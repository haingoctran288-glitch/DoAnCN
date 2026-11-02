import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Button, Space, Modal, Descriptions, message, Popconfirm, Input } from 'antd';
import { Check, X, Clock, Eye, Ban } from 'lucide-react';
import { bookingApi } from '../api';

const { Title } = Typography;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [progress, setProgress] = useState(0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  };

  const getDynamicState = (b) => {
    if (b.status === 'CANCELLED') return 'CANCELLED';
    
    const now = new Date();
    const startStr = `${b.bookingDate}T${b.bookingTime}`;
    const startTime = new Date(startStr);
    
    let endTime;
    if (b.endTime) {
      endTime = new Date(`${b.bookingDate}T${b.endTime}`);
    } else {
      endTime = new Date(startTime.getTime() + (b.duration || 30) * 60000);
    }
    
    if (now < startTime) return 'WAITING';
    if (now >= startTime && now <= endTime) return 'IN_PROGRESS';
    return 'COMPLETED';
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let timer;
    if (successModalVisible) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setSuccessModalVisible(false);
            clearInterval(timer);
            return 100;
          }
          return prev + (100 / (3000 / 50));
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [successModalVisible]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const params = user.role === 'EDITOR' ? { branch: user.branch } : {};
      const res = await bookingApi.getAll(params);
      setBookings(res.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách lịch đặt: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCancelBooking = async () => {
    if (!cancelReason) {
      message.error("Vui lòng chọn lý do hủy!");
      return;
    }
    try {
      setCancelling(true);
      await bookingApi.cancelBooking(cancelBookingId, {
        cancelReason: cancelReason,
        cancelledBy: "Admin Boss"
      });
      // Thay message.success bằng modal
      setSuccessData({ id: cancelBookingId, reason: cancelReason });
      setSuccessModalVisible(true);
      setProgress(0);
      
      setCancelModalVisible(false);
      setCancelReason(null);
      fetchBookings();
    } catch (error) {
      Modal.error({
        title: 'Lỗi Hủy Lịch',
        content: error.response?.data || error.message || 'Không thể hủy lịch. Vui lòng thử lại.',
        okText: 'Đóng',
      });
    } finally {
      setCancelling(false);
    }
  };

  const openCancelModal = (id) => {
    setCancelBookingId(id);
    setCancelReason(null);
    setCancelModalVisible(true);
  };

  const handleView = (record) => {
    setSelectedBooking(record);
    setViewModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã Đặt',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span style={{ color: '#d4af37', fontWeight: 'bold' }}>#{id}</span>,
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: 'Dịch Vụ',
      key: 'service',
      render: (_, record) => {
        const services = record.services && record.services.length > 0 ? record.services : (record.service ? [record.service] : []);
        if (services.length === 0) return 'N/A';
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '280px' }}>
            {services.map(s => (
              <Tag 
                key={s.id} 
                style={{ 
                  margin: 0, 
                  borderRadius: '12px', 
                  color: '#d4af37', 
                  background: 'rgba(212, 175, 55, 0.1)', 
                  borderColor: 'rgba(212, 175, 55, 0.3)' 
                }}
              >
                {s.name}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Thợ Cắt',
      key: 'staff',
      render: (_, record) => {
        if (!record.staff) return 'Không chọn thợ';
        const isAuto = record.note && record.note.includes('[Auto Assign]');
        if (isAuto) {
          return (
            <div>
              <div style={{ color: '#d4af37', fontWeight: 'bold' }}>{record.staff.name}</div>
              <Tag color="purple" style={{ marginTop: 4, border: '1px solid rgba(128,0,128,0.5)', background: 'rgba(128,0,128,0.1)' }}>Phân công tự động</Tag>
            </div>
          );
        }
        return record.staff.name;
      },
    },
    {
      title: 'Chi Nhánh',
      key: 'branch',
      render: (_, record) => {
        const branch = record.staff?.branch;
        if (!branch) return <Tag>Chưa xác định</Tag>;
        const colorMap = {
          'Quận 1': 'blue', 'Quận 2': 'cyan', 'Quận 3': 'geekblue',
          'Quận 7': 'purple', 'Quận 9': 'magenta', 'Bình Thạnh': 'orange',
        };
        return <Tag color={colorMap[branch] || 'default'}>{branch}</Tag>;
      },
    },
    {
      title: 'Thời Gian',
      key: 'time',
      render: (_, record) => `${record.bookingTime} - ${formatDate(record.bookingDate)}`,
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => {
        const status = getDynamicState(record);
        let color = 'orange';
        let icon = <Clock size={14} />;
        let text = status;

        if (status === 'COMPLETED') { color = 'green'; icon = <Check size={14} />; text = 'HOÀN THÀNH'; }
        else if (status === 'IN_PROGRESS') { color = 'orange'; icon = <Clock size={14} />; text = 'ĐANG THỰC HIỆN'; }
        else if (status === 'CANCELLED') { color = '#8b0000'; icon = <span style={{marginRight: 4}}>❌</span>; text = 'ĐÃ HỦY'; }
        else if (status === 'WAITING') { color = 'blue'; icon = <Clock size={14} />; text = 'CHỜ THỰC HIỆN'; }

        if (status === 'CANCELLED') {
           return (
            <Tag color="error" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 4, fontWeight: 'bold' }}>
              <span style={{ fontSize: 12 }}>❌</span> {text}
            </Tag>
          );
        }

        return (
          <Tag color={color} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 4 }}>
            {icon} {text}
          </Tag>
        );
      },
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" style={{ color: '#1890ff', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleView(record)}>
            <Eye size={16} /> Xem
          </Button>
          <Button 
            type="text" 
            danger 
            disabled={record.status === 'CANCELLED' || record.status === 'COMPLETED'}
            onClick={() => openCancelModal(record.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Ban size={16} /> Hủy
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>Lịch Đặt</Title>
          <p style={{ color: '#a0a0a0', marginTop: 4 }}>Quản lý các cuộc hẹn của khách hàng</p>
        </div>
        <Input.Search 
          placeholder="Tìm theo Mã Đặt..." 
          allowClear 
          onSearch={value => setSearchText(value)}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={bookings.filter(b => b.id.toString().includes(searchText))} 
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }} 
        scroll={{ x: 1000 }} 
      />

      <Modal
        title={
          <div style={{ color: '#d4af37', fontSize: '20px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
            Chi Tiết Lịch Đặt #{selectedBooking?.id}
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
        closeIcon={<X color="#fff" />}
        className="luxury-modal"
        styles={{
          header: { background: '#1a1a1a', padding: '20px 24px 0' },
          body: { background: '#1a1a1a', padding: '24px' },
          content: { background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }
        }}
      >
        {selectedBooking && (
          <Descriptions column={2} labelStyle={{ color: '#a0a0a0' }} contentStyle={{ color: '#fff', fontWeight: '500' }}>
            <Descriptions.Item label="Khách hàng" span={2}>{selectedBooking.customerName}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedBooking.customerPhone}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedBooking.customerEmail || 'Không có'}</Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">{formatDate(selectedBooking.bookingDate)}</Descriptions.Item>
            <Descriptions.Item label="Giờ đặt">{selectedBooking.bookingTime}</Descriptions.Item>
            <Descriptions.Item label="Giờ kết thúc">
              {(() => {
                if (selectedBooking.endTime) return selectedBooking.endTime.substring(0,5);
                const startStr = `${selectedBooking.bookingDate}T${selectedBooking.bookingTime}`;
                const startTime = new Date(startStr);
                const duration = selectedBooking.duration || selectedBooking.service?.duration || 30;
                const endTime = new Date(startTime.getTime() + duration * 60000);
                const pad = n => n.toString().padStart(2, '0');
                return `${pad(endTime.getHours())}:${pad(endTime.getMinutes())}`;
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Chi nhánh">{selectedBooking.staff?.branch || 'Không xác định'}</Descriptions.Item>
            <Descriptions.Item label="Thợ cắt" span={2}>
              {selectedBooking.staff ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{selectedBooking.staff.name} ({selectedBooking.staff.branch})</span>
                  {selectedBooking.note && selectedBooking.note.includes('[Auto Assign]') && (
                    <Tag color="purple" style={{ margin: 0, border: '1px solid rgba(128,0,128,0.5)', background: 'rgba(128,0,128,0.1)' }}>Phân công tự động</Tag>
                  )}
                </div>
              ) : 'Không chọn thợ'}
            </Descriptions.Item>
            <Descriptions.Item label="Dịch vụ" span={2}>
              {selectedBooking.services && selectedBooking.services.length > 0 
                ? <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {selectedBooking.services.map(s => <Tag color="gold" key={s.id}>{s.name}</Tag>)}
                  </div>
                : (selectedBooking.service?.name || 'N/A')}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian làm">{selectedBooking.duration ? `${selectedBooking.duration} phút` : (selectedBooking.service?.duration ? `${selectedBooking.service.duration} phút` : 'N/A')}</Descriptions.Item>
            <Descriptions.Item label="Thanh toán">
              {selectedBooking.paymentMethod === 'MOMO' ? (
                <span style={{ background: '#a50064', color: 'white', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,0,153,0.3)', boxShadow: '0 0 10px rgba(165,0,100,0.3)', fontWeight: '900', fontSize: '12px', letterSpacing: '1px' }}>MoMo</span>
              ) : selectedBooking.paymentMethod === 'VNPAY' ? (
                <Tag color="#005baa" style={{ fontWeight: 'bold', border: '1px solid #00a0e9', padding: '2px 8px' }}>VN<span style={{color: '#ff4d4f'}}>PAY</span></Tag>
              ) : (
                <Tag color="default">{selectedBooking.paymentMethod}</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <span style={{ color: '#d4af37', fontSize: '16px' }}>{selectedBooking.totalPrice?.toLocaleString()} đ</span>
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>{selectedBooking.note || 'Không có'}</Descriptions.Item>
            
            {selectedBooking.status === 'CANCELLED' && (
              <>
                <Descriptions.Item label="Lý do hủy" span={2}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                    {selectedBooking.cancelReason === 'late_customer' ? '❌ Bị hủy do không đúng giờ' : 
                     selectedBooking.cancelReason === 'STAFF_ON_LEAVE' ? '❌ Hủy do nhân viên nghỉ' :
                     '❌ Bị hủy bởi admin'}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian hủy" span={2}>
                  {selectedBooking.cancelledAt ? new Date(selectedBooking.cancelledAt).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric'}) : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Hoàn tiền" span={2}>
                  <span style={{ color: (selectedBooking.refundStatus === 'success' || selectedBooking.refundStatus === 'REFUNDED') ? '#22c55e' : selectedBooking.refundStatus === 'WAITING_REFUND' ? '#fbbf24' : '#ef4444', fontWeight: 'bold' }}>
                    {(selectedBooking.refundStatus === 'success' || selectedBooking.refundStatus === 'REFUNDED') ? 'Đã hoàn tiền' : 
                     selectedBooking.refundStatus === 'WAITING_REFUND' ? 'Đang xử lý (Lỗi API)' : 'Không hoàn tiền'}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Người thực hiện hủy" span={2}>{selectedBooking.cancelledBy === 'SYSTEM' ? 'Hệ thống tự động (Hủy theo lịch nghỉ)' : (selectedBooking.cancelledBy || 'Admin')}</Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button onClick={() => setViewModalVisible(false)} style={{ background: '#333', borderColor: '#444', color: '#fff' }}>
            Đóng
          </Button>
        </div>
      </Modal>
      {/* CANCEL MODAL */}
      <Modal
        title={
          <div style={{ color: '#ef4444', fontSize: '20px', borderBottom: '1px solid #333', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <Ban size={20} color="#ef4444" />
            </div>
            Xác Nhận Hủy Lịch
          </div>
        }
        open={cancelModalVisible}
        onCancel={() => !cancelling && setCancelModalVisible(false)}
        footer={null}
        width={500}
        closeIcon={<X color="#fff" />}
        className="luxury-modal"
        styles={{
          header: { background: '#111', padding: '20px 24px 0' },
          body: { background: '#111', padding: '24px' },
          content: { background: '#111', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 50px rgba(220,38,38,0.15)' }
        }}
      >
        <p style={{ color: '#a0a0a0', marginBottom: '24px', textAlign: 'center', fontSize: '14px' }}>
          Vui lòng chọn lý do hủy lịch đặt <strong style={{ color: '#ef4444' }}>#{cancelBookingId}</strong>.
        </p>

        <div 
          onClick={() => setCancelReason('admin_cancel')}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: cancelReason === 'admin_cancel' ? '1px solid #ef4444' : '1px solid #333',
            backgroundColor: cancelReason === 'admin_cancel' ? 'rgba(239, 68, 68, 0.1)' : '#1a1a1a',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            transition: 'all 0.3s'
          }}
        >
          <input 
            type="radio" 
            name="cancelReason" 
            checked={cancelReason === 'admin_cancel'} 
            readOnly
            style={{ marginTop: '4px', accentColor: '#ef4444', width: '16px', height: '16px' }}
          />
          <div>
            <h4 style={{ margin: 0, fontWeight: 'bold', color: cancelReason === 'admin_cancel' ? '#f87171' : '#d1d5db', fontSize: '15px' }}>Bị hủy bởi admin</h4>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#9ca3af' }}>Tiệm xin lỗi khách hàng vì sự cố ngoài mong muốn. Khách sẽ được hoàn tiền đầy đủ.</p>
          </div>
        </div>

        <div 
          onClick={() => setCancelReason('late_customer')}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: cancelReason === 'late_customer' ? '1px solid #ef4444' : '1px solid #333',
            backgroundColor: cancelReason === 'late_customer' ? 'rgba(239, 68, 68, 0.1)' : '#1a1a1a',
            cursor: 'pointer',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            transition: 'all 0.3s'
          }}
        >
          <input 
            type="radio" 
            name="cancelReason" 
            checked={cancelReason === 'late_customer'} 
            readOnly
            style={{ marginTop: '4px', accentColor: '#ef4444', width: '16px', height: '16px' }}
          />
          <div>
            <h4 style={{ margin: 0, fontWeight: 'bold', color: cancelReason === 'late_customer' ? '#f87171' : '#d1d5db', fontSize: '15px' }}>Bị hủy do không đúng giờ</h4>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#9ca3af' }}>Khách đến sai giờ hoặc quá thời gian đã đặt. Khoản thanh toán sẽ không được hoàn lại.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #333', paddingTop: '24px' }}>
          <Button 
            onClick={() => setCancelModalVisible(false)}
            disabled={cancelling}
            style={{ flex: 1, height: '48px', background: '#222', borderColor: '#333', color: '#a0a0a0', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Thoát
          </Button>
          <Button 
            onClick={submitCancelBooking}
            disabled={!cancelReason || cancelling}
            loading={cancelling}
            style={{ 
              flex: 1, 
              height: '48px', 
              background: !cancelReason ? 'rgba(153,27,27,0.3)' : '#dc2626', 
              borderColor: !cancelReason ? 'rgba(153,27,27,0.2)' : '#dc2626', 
              color: !cancelReason ? 'rgba(239,68,68,0.3)' : '#fff', 
              fontWeight: 'bold', 
              textTransform: 'uppercase' 
            }}
          >
            Xác Nhận Hủy
          </Button>
        </div>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        open={successModalVisible}
        onCancel={() => setSuccessModalVisible(false)}
        footer={null}
        closable={false}
        width={400}
        centered
        className="luxury-modal"
        styles={{
          content: { background: '#111', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.5)', padding: 0, overflow: 'hidden', boxShadow: '0 0 50px rgba(220,38,38,0.2)' },
          body: { padding: 0 }
        }}
      >
        <div style={{ padding: '32px 24px 24px 24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <Check size={32} color="#ef4444" />
          </div>
          <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            Hủy Lịch Thành Công
          </h3>
          
          <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '16px', marginBottom: '24px', border: '1px solid #333', textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px 0', color: '#a0a0a0', fontSize: '13px' }}>
              Mã đơn: <strong style={{ color: '#fff' }}>#{successData?.id}</strong>
            </p>
            <p style={{ margin: '0 0 8px 0', color: '#a0a0a0', fontSize: '13px' }}>
              Lý do: <strong style={{ color: '#f87171' }}>{successData?.reason === 'admin_cancel' ? 'Bị hủy bởi admin' : 'Bị hủy do không đúng giờ'}</strong>
            </p>
            <p style={{ margin: '0', color: successData?.reason === 'admin_cancel' ? '#22c55e' : '#fbbf24', fontSize: '13px', fontWeight: 'bold' }}>
              {successData?.reason === 'admin_cancel' ? 'Khách hàng đã được hoàn tiền.' : 'Đơn hàng không được hoàn tiền.'}
            </p>
          </div>

          <Button 
            onClick={() => setSuccessModalVisible(false)}
            style={{ 
              width: '100%', 
              height: '48px', 
              background: '#dc2626', 
              borderColor: '#dc2626', 
              color: '#fff', 
              fontWeight: 'bold', 
              textTransform: 'uppercase' 
            }}
          >
            Hoàn Thành
          </Button>
        </div>
        
        {/* Progress bar */}
        <div style={{ width: '100%', height: '4px', background: '#333' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#ef4444', transition: 'width 0.05s linear' }}></div>
        </div>
      </Modal>
    </div>
  );
};

export default Bookings;

import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Tag, Space, Modal, message, List, Divider, Select } from 'antd';
import { ShoppingCart, Eye, CheckCircle, XCircle, Truck, AlertTriangle } from 'lucide-react';
import { orderApi } from '../api';

const { Title, Text } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterCreator, setFilterCreator] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  const displayedOrders = orders.filter(o => {
    const isEditor = !!o.createdByEditor || (o.user && o.user.role === 'EDITOR');
    
    if (filterCreator === 'editor') {
      if (!isEditor) return false;
      if (filterBranch !== 'all') {
        const branch = o.orderBranch || (o.user && o.user.branch);
        if (branch !== filterBranch) return false;
      }
      return true;
    }
    
    if (filterCreator === 'customer') return !isEditor;
    
    return true;
  });

  // ── Confirm modals ──
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [confirmCancelRecord, setConfirmCancelRecord] = useState(null);
  const [confirmApproveId, setConfirmApproveId] = useState(null);
  const [confirmApproveRecord, setConfirmApproveRecord] = useState(null);
  const [confirmDeliverId, setConfirmDeliverId] = useState(null);
  const [confirmDeliverRecord, setConfirmDeliverRecord] = useState(null);

  // ── Success toast ──
  const [successMsg, setSuccessMsg] = useState(null); // { message, type: 'cancel'|'approve' }
  const [countdown, setCountdown] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const params = user.role === 'EDITOR' ? { branch: user.branch } : {};
      const res = await orderApi.getAll(params);
      setOrders(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── 3-second countdown for success toast ──
  useEffect(() => {
    if (!successMsg) return;
    setCountdown(3000);
    const tick = 30;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= tick) {
          clearInterval(timer);
          setSuccessMsg(null);
          return 0;
        }
        return prev - tick;
      });
    }, tick);
    return () => clearInterval(timer);
  }, [successMsg]);

  const handleConfirm = async (id) => {
    try {
      await orderApi.confirm(id);
      setSuccessMsg({
        message: `Đơn hàng mã số #${id} đã được duyệt thành công! Thông báo đã được gửi cho khách hàng.`,
        type: 'approve',
      });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'confirmed', paymentStatus: 'PAID' });
      }
    } catch (err) {
      message.error('Xác nhận đơn hàng thất bại');
    }
  };

  const handleCancel = async (id) => {
    try {
      await orderApi.cancel(id, 'Hủy bởi Admin');
      setSuccessMsg({
        message: `Đơn hàng mã số #${id} đã hủy thành công! Thông báo xin lỗi đã được gửi cho khách hàng.`,
        type: 'cancel',
      });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
      }
    } catch (err) {
      message.error('Hủy đơn hàng thất bại');
    }
  };

  const handleDeliver = async (id) => {
    try {
      await orderApi.deliver(id);
      setSuccessMsg({
        message: `Đơn hàng mã số #${id} đã được giao thành công!`,
        type: 'approve',
      });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'delivered' });
      }
    } catch (err) {
      message.error('Cập nhật trạng thái giao hàng thất bại');
    }
  };

  const showDetail = (record) => {
    setSelectedOrder(record);
    setDetailVisible(true);
  };

  const getStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Tag color="warning">CHỜ XÁC NHẬN</Tag>;
      case 'confirmed': return <Tag color="success">ĐÃ XÁC NHẬN</Tag>;
      case 'delivered': return <Tag color="purple">ĐÃ GIAO HÀNG</Tag>;
      case 'cancelled': return <Tag color="error">ĐÃ HỦY</Tag>;
      default: return <Tag color="default">{status?.toUpperCase()}</Tag>;
    }
  };

  const getPaymentStatusTag = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID': return <Tag color="success">ĐÃ THANH TOÁN</Tag>;
      case 'FAILED': return <Tag color="error">LỖI THANH TOÁN</Tag>;
      default: return <Tag color="default">CHƯA THANH TOÁN</Tag>;
    }
  };

  const columns = [
    {
      title: 'Mã Đơn', dataIndex: 'id', key: 'id',
      render: (id) => <span style={{ color: '#d4af37', fontWeight: 'bold' }}>#{id}</span>,
    },
    {
      title: 'Khách Hàng', dataIndex: 'name', key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#a0a0a0' }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Tài Khoản Đặt', dataIndex: 'user', key: 'user',
      render: (user, record) => {
        const isEditor = record.createdByEditor || (user && user.role === 'EDITOR');
        const username = record.createdByEditor || user?.username;
        if (isEditor) {
          return (
            <div>
              <div style={{ fontWeight: 'bold', color: '#d4af37' }}>@{username}</div>
              <Tag color="purple" style={{ marginTop: 4, fontSize: 10 }}>EDITOR ĐẶT</Tag>
            </div>
          );
        }
        return user ? (
          <div>
            <div style={{ fontWeight: 'bold', color: '#d4af37' }}>{user.username}</div>
            <div style={{ fontSize: 11, color: '#a0a0a0' }}>{user.fullName}</div>
          </div>
        ) : <Tag color="default">Khách vãng lai</Tag>;
      }
    },
    {
      title: 'Tổng Tiền', dataIndex: 'totalPrice', key: 'totalPrice',
      render: (price) => <span style={{ fontWeight: 'bold' }}>{price?.toLocaleString('vi-VN')}₫</span>,
    },
    {
      title: 'Phương Thức TT', dataIndex: 'paymentMethod', key: 'paymentMethod',
      render: (method) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: 'Trạng Thái', key: 'status', dataIndex: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Hành Động', key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" style={{ color: '#1890ff' }} icon={<Eye size={16} />} onClick={() => showDetail(record)}>Xem</Button>
          {record.status?.toLowerCase() === 'pending' && (
            <>
              <Button type="text" style={{ color: '#38bdf8' }} icon={<CheckCircle size={16} />}
                onClick={() => { setConfirmApproveId(record.id); setConfirmApproveRecord(record); }}>Duyệt</Button>
              <Button type="text" danger icon={<XCircle size={16} />}
                onClick={() => { setConfirmCancelId(record.id); setConfirmCancelRecord(record); }}>Hủy</Button>
            </>
          )}
          {record.status?.toLowerCase() === 'confirmed' && (
            <Button type="text" style={{ color: '#d4af37' }} icon={<Truck size={16} />}
              onClick={() => { setConfirmDeliverId(record.id); setConfirmDeliverRecord(record); }}>Đã Giao</Button>
          )}
        </Space>
      ),
    },
  ];

  // ── Inline styles for custom modals ──
  const overlayStyle = { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 10000 };
  const backdropStyle = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>Đơn Hàng</Title>
          <p style={{ color: '#a0a0a0', marginTop: 4 }}>Quản lý đơn hàng và trạng thái thanh toán</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {filterCreator === 'editor' && (
            <Select 
              value={filterBranch} 
              onChange={setFilterBranch} 
              style={{ width: 160 }}
              options={[
                { value: 'all', label: 'Tất cả chi nhánh' },
                { value: 'CN 1', label: 'Chi nhánh 1' },
                { value: 'CN 2', label: 'Chi nhánh 2' },
                { value: 'CN 3', label: 'Chi nhánh 3' },
                { value: 'CN 7', label: 'Chi nhánh 7' },
                { value: 'CN 9', label: 'Chi nhánh 9' },
                { value: 'CN BT', label: 'CN Bình Thạnh' },
              ]}
            />
          )}
          <Select 
            value={filterCreator} 
            onChange={setFilterCreator} 
            style={{ width: 180 }}
            options={[
              { value: 'all', label: 'Tất cả đơn hàng' },
              { value: 'customer', label: 'Khách hàng đặt' },
              { value: 'editor', label: 'Editor đặt' },
            ]}
          />
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={displayedOrders} 
        rowKey="id" 
        loading={loading} 
        pagination={{ pageSize: 10 }} 
      />

      {/* ───────── Detail Modal (Ant Design) ───────── */}
      <Modal
        title={`Chi Tiết Đơn Hàng #${selectedOrder?.id}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>Đóng</Button>,
          selectedOrder?.status?.toLowerCase() === 'pending' && (
            <Button key="cancel" danger onClick={() => {
              setConfirmCancelId(selectedOrder.id); setConfirmCancelRecord(selectedOrder); setDetailVisible(false);
            }}>Hủy Đơn</Button>
          ),
          selectedOrder?.status?.toLowerCase() === 'pending' && (
            <Button key="confirm" type="primary" style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000' }} onClick={() => {
              setConfirmApproveId(selectedOrder.id); setConfirmApproveRecord(selectedOrder); setDetailVisible(false);
            }}>Xác Nhận Đơn Hàng</Button>
          ),
          selectedOrder?.status?.toLowerCase() === 'confirmed' && (
            <Button key="deliver" type="primary" style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000' }} onClick={() => {
              setConfirmDeliverId(selectedOrder.id); setConfirmDeliverRecord(selectedOrder); setDetailVisible(false);
            }}>Đã Giao Xong</Button>
          ),
        ]}
        width={700}
      >
        {selectedOrder && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#1a1a1a', padding: 16, borderRadius: 8 }}>
                <Title level={5} style={{ color: '#d4af37', marginTop: 0 }}>Thông tin người nhận</Title>
                <p><strong>Tên:</strong> {selectedOrder.name}</p>
                <p><strong>SĐT:</strong> {selectedOrder.phone}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                {selectedOrder.user && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #333' }}>
                    <p style={{ color: '#d4af37', marginBottom: 4 }}><strong>Tài khoản hệ thống:</strong></p>
                    <p>ID: {selectedOrder.user.id} - @{selectedOrder.user.username}</p>
                    <p>Họ tên: {selectedOrder.user.fullName}</p>
                  </div>
                )}
              </div>
              <div style={{ background: '#1a1a1a', padding: 16, borderRadius: 8 }}>
                <Title level={5} style={{ color: '#d4af37', marginTop: 0 }}>Thông tin thanh toán</Title>
                <p><strong>Phương thức:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Trạng thái TT:</strong> {getPaymentStatusTag(selectedOrder.paymentStatus)}</p>
                <p><strong>Trạng thái đơn:</strong> {getStatusTag(selectedOrder.status)}</p>
                {selectedOrder.vnpTransactionNo && <p><strong>Mã giao dịch:</strong> {selectedOrder.vnpTransactionNo}</p>}
                {selectedOrder.cancelReason && <p><strong>Lý do hủy:</strong> <span style={{ color: '#ff4d4f' }}>{selectedOrder.cancelReason}</span></p>}
              </div>
            </div>

            <Divider style={{ borderColor: '#333' }} />
            <Title level={5} style={{ color: '#fff' }}>Sản phẩm đã đặt</Title>
            <List
              itemLayout="horizontal"
              dataSource={selectedOrder.items || []}
              renderItem={(item) => (
                <List.Item extra={<div style={{ fontWeight: 'bold', color: '#d4af37' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</div>}>
                  <List.Item.Meta
                    title={<span style={{ color: '#fff' }}>{item.productName}</span>}
                    description={<span style={{ color: '#a0a0a0' }}>{item.price.toLocaleString('vi-VN')}₫ x {item.quantity}</span>}
                  />
                </List.Item>
              )}
            />
            <Divider style={{ borderColor: '#333' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#a0a0a0' }}>Tạm tính:</Text>
              <Text style={{ color: '#fff' }}>{(selectedOrder.totalPrice - selectedOrder.shippingFee).toLocaleString('vi-VN')}₫</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ color: '#a0a0a0' }}>Phí vận chuyển:</Text>
              <Text style={{ color: '#fff' }}>{selectedOrder.shippingFee?.toLocaleString('vi-VN')}₫</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#1a1a1a', padding: '12px 16px', borderRadius: 8 }}>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>Tổng cộng:</Title>
              <Title level={4} style={{ color: '#d4af37', margin: 0 }}>{selectedOrder.totalPrice?.toLocaleString('vi-VN')}₫</Title>
            </div>
          </div>
        )}
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══  CUSTOM MODAL: XÁC NHẬN HỦY ĐƠN (MÀU ĐỎ)            ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {confirmCancelId && (
        <div style={overlayStyle}>
          <div style={backdropStyle} onClick={() => setConfirmCancelId(null)} />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 480,
            background: '#0a0a0a',
            border: '1px solid rgba(239,68,68,0.5)',
            borderRadius: 20,
            boxShadow: '0 0 80px rgba(239,68,68,0.25), 0 0 200px rgba(239,68,68,0.08)',
            overflow: 'hidden',
          }}>
            {/* Red glow top bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171, #ef4444, #dc2626)' }} />

            <div style={{ padding: '32px 28px 28px', textAlign: 'center' }}>
              {/* Icon */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <AlertTriangle size={36} color="#ef4444" />
              </div>

              <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Xác Nhận Hủy Đơn Hàng
              </h3>
              <p style={{ color: '#a0a0a0', fontSize: 14, lineHeight: 1.7, marginBottom: 28, padding: '0 8px' }}>
                Bạn có chắc chắn muốn <span style={{ color: '#ef4444', fontWeight: 700 }}>hủy đơn hàng #{confirmCancelId}</span>
                {confirmCancelRecord?.name ? ` của khách hàng ${confirmCancelRecord.name}` : ''}?
                {confirmCancelRecord?.paymentMethod && confirmCancelRecord.paymentMethod !== 'COD'
                  ? <><br /><span style={{ color: '#fbbf24' }}>⚠ Đơn thanh toán online sẽ được hoàn tiền tự động.</span></>
                  : null
                }
              </p>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setConfirmCancelId(null)}
                  style={{
                    flex: 1, padding: '14px 16px', borderRadius: 14,
                    border: '1px solid #333', background: 'transparent',
                    color: '#999', fontWeight: 700, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: 1,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { e.target.style.borderColor = '#555'; e.target.style.color = '#ccc'; }}
                  onMouseOut={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#999'; }}
                >
                  Thoát
                </button>
                <button
                  onClick={() => { const id = confirmCancelId; setConfirmCancelId(null); handleCancel(id); }}
                  style={{
                    flex: 1, padding: '14px 16px', borderRadius: 14,
                    border: 'none', background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: '#fff', fontWeight: 800, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: 1,
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
                  }}
                  onMouseOver={e => e.target.style.boxShadow = '0 8px 30px rgba(239,68,68,0.6)'}
                  onMouseOut={e => e.target.style.boxShadow = '0 4px 20px rgba(239,68,68,0.4)'}
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══  CUSTOM MODAL: XÁC NHẬN DUYỆT ĐƠN (MÀU XANH BIỂN)   ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {confirmApproveId && (
        <div style={overlayStyle}>
          <div style={backdropStyle} onClick={() => setConfirmApproveId(null)} />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 480,
            background: '#0a0a0a',
            border: '1px solid rgba(56,189,248,0.5)',
            borderRadius: 20,
            boxShadow: '0 0 80px rgba(56,189,248,0.2), 0 0 200px rgba(56,189,248,0.06)',
            overflow: 'hidden',
          }}>
            {/* Blue glow top bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #0284c7, #38bdf8, #7dd3fc, #38bdf8, #0284c7)' }} />

            <div style={{ padding: '32px 28px 28px', textAlign: 'center' }}>
              {/* Icon */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(56,189,248,0.12)', border: '2px solid rgba(56,189,248,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Truck size={36} color="#38bdf8" />
              </div>

              <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Xác Nhận Duyệt Đơn Hàng
              </h3>
              <p style={{ color: '#a0a0a0', fontSize: 14, lineHeight: 1.7, marginBottom: 28, padding: '0 8px' }}>
                Bạn có chắc chắn muốn <span style={{ color: '#38bdf8', fontWeight: 700 }}>duyệt đơn hàng #{confirmApproveId}</span>
                {confirmApproveRecord?.name ? ` của khách hàng ${confirmApproveRecord.name}` : ''}?
                Đơn hàng sẽ được chuyển sang trạng thái giao hàng.
              </p>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setConfirmApproveId(null)}
                  style={{
                    flex: 1, padding: '14px 16px', borderRadius: 14,
                    border: '1px solid #333', background: 'transparent',
                    color: '#999', fontWeight: 700, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: 1,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { e.target.style.borderColor = '#555'; e.target.style.color = '#ccc'; }}
                  onMouseOut={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#999'; }}
                >
                  Thoát
                </button>
                <button
                  onClick={() => { const id = confirmApproveId; setConfirmApproveId(null); handleConfirm(id); }}
                  style={{
                    flex: 1, padding: '14px 16px', borderRadius: 14,
                    border: 'none', background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#fff', fontWeight: 800, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: 1,
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(56,189,248,0.4)',
                  }}
                  onMouseOver={e => e.target.style.boxShadow = '0 8px 30px rgba(56,189,248,0.6)'}
                  onMouseOut={e => e.target.style.boxShadow = '0 4px 20px rgba(56,189,248,0.4)'}
                >
                  Xác nhận giao
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══  CUSTOM MODAL: XÁC NHẬN ĐÃ GIAO ĐƠN (MÀU VÀNG GIAO HÀNG)   ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {confirmDeliverId && (
        <div style={overlayStyle}>
          <div style={backdropStyle} onClick={() => setConfirmDeliverId(null)} />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 480,
            background: '#0a0a0a',
            border: '1px solid rgba(212,175,55,0.5)',
            borderRadius: 20,
            boxShadow: '0 0 80px rgba(212,175,55,0.2), 0 0 200px rgba(212,175,55,0.06)',
            overflow: 'hidden',
          }}>
            {/* Gold glow top bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #b8860b, #d4af37, #ffd700, #d4af37, #b8860b)' }} />

            <div style={{ padding: '32px 28px 28px', textAlign: 'center' }}>
              {/* Icon */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(212,175,55,0.12)', border: '2px solid rgba(212,175,55,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <CheckCircle size={36} color="#d4af37" />
              </div>

              <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Xác Nhận Đã Giao
              </h3>
              <p style={{ color: '#a0a0a0', fontSize: 14, lineHeight: 1.7, marginBottom: 28, padding: '0 8px' }}>
                Bạn có chắc chắn <span style={{ color: '#d4af37', fontWeight: 700 }}>đơn hàng #{confirmDeliverId}</span>
                {confirmDeliverRecord?.name ? ` của khách hàng ${confirmDeliverRecord.name}` : ''} đã giao thành công?
              </p>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setConfirmDeliverId(null)}
                  style={{
                    flex: 1, padding: '14px 16px', borderRadius: 14,
                    border: '1px solid #333', background: 'transparent',
                    color: '#999', fontWeight: 700, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: 1,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { e.target.style.borderColor = '#555'; e.target.style.color = '#ccc'; }}
                  onMouseOut={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#999'; }}
                >
                  Thoát
                </button>
                <button
                  onClick={() => { const id = confirmDeliverId; setConfirmDeliverId(null); handleDeliver(id); }}
                  style={{
                    flex: 1, padding: '14px 16px', borderRadius: 14,
                    border: 'none', background: 'linear-gradient(135deg, #b8860b, #d4af37)',
                    color: '#000', fontWeight: 800, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: 1,
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
                  }}
                  onMouseOver={e => e.target.style.boxShadow = '0 8px 30px rgba(212,175,55,0.6)'}
                  onMouseOut={e => e.target.style.boxShadow = '0 4px 20px rgba(212,175,55,0.4)'}
                >
                  Xác nhận giao
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══  THÔNG BÁO THÀNH CÔNG + THANH CHẠY 3 GIÂY              ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {successMsg && (
        <div style={{ ...overlayStyle, zIndex: 20000 }}>
          <div style={backdropStyle} />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 460,
            background: '#0a0a0a',
            border: `1px solid ${successMsg.type === 'cancel' ? 'rgba(239,68,68,0.5)' : 'rgba(56,189,248,0.5)'}`,
            borderRadius: 20,
            boxShadow: successMsg.type === 'cancel'
              ? '0 0 80px rgba(239,68,68,0.3)'
              : '0 0 80px rgba(56,189,248,0.3)',
            overflow: 'hidden',
          }}>
            {/* Color bar */}
            <div style={{
              height: 4,
              background: successMsg.type === 'cancel'
                ? 'linear-gradient(90deg, #dc2626, #ef4444, #f87171, #ef4444, #dc2626)'
                : 'linear-gradient(90deg, #0284c7, #38bdf8, #7dd3fc, #38bdf8, #0284c7)',
            }} />

            <div style={{ padding: '36px 28px 24px', textAlign: 'center' }}>
              {/* Animated icon */}
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: successMsg.type === 'cancel' ? 'rgba(239,68,68,0.12)' : 'rgba(56,189,248,0.12)',
                border: `2px solid ${successMsg.type === 'cancel' ? 'rgba(239,68,68,0.4)' : 'rgba(56,189,248,0.4)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                animation: 'pulse 2s infinite',
              }}>
                {successMsg.type === 'cancel'
                  ? <XCircle size={40} color="#ef4444" />
                  : <CheckCircle size={40} color="#38bdf8" />
                }
              </div>

              <h3 style={{
                color: successMsg.type === 'cancel' ? '#ef4444' : '#38bdf8',
                fontSize: 20, fontWeight: 800, marginBottom: 12,
                letterSpacing: 1, textTransform: 'uppercase',
              }}>
                {successMsg.type === 'cancel' ? 'Đã Hủy Đơn Hàng' : 'Đã Duyệt Đơn Hàng'}
              </h3>

              <p style={{ color: '#d4d4d4', fontSize: 14, lineHeight: 1.8, marginBottom: 28, padding: '0 4px' }}>
                {successMsg.message}
              </p>

              {/* Button */}
              <button
                onClick={() => setSuccessMsg(null)}
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 14,
                  border: '1px solid #333', background: '#111',
                  color: '#ccc', fontWeight: 700, fontSize: 13,
                  textTransform: 'uppercase', letterSpacing: 1,
                  cursor: 'pointer', transition: 'all 0.2s',
                  marginBottom: 16,
                }}
                onMouseOver={e => { e.target.style.borderColor = '#555'; e.target.style.color = '#fff'; e.target.style.background = '#1a1a1a'; }}
                onMouseOut={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#ccc'; e.target.style.background = '#111'; }}
              >
                Hoàn thành
              </button>

              {/* Countdown progress bar */}
              <div style={{ width: '100%', height: 5, background: '#1a1a1a', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(countdown / 3000) * 100}%`,
                  background: successMsg.type === 'cancel'
                    ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                    : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                  borderRadius: 10,
                  transition: 'width 30ms linear',
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

export default Orders;

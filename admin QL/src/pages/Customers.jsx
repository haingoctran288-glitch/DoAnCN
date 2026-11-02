import React, { useState, useEffect } from 'react';
import { Table, Typography, Avatar, Spin, Alert, Input, Select, Button, Modal, notification, Space, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { User, Search, RotateCcw, Lock, Unlock, Ban, AlertTriangle, Trash2 } from 'lucide-react';
import { customerApi } from '../api';

const { Title } = Typography;
const { Option } = Select;

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  return `http://localhost:8080${avatar}`;
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [rank, setRank] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [codModalVisible, setCodModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [blockReason, setBlockReason] = useState('');

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getAll({ page, sort, rank, search, status });
      if (res.data && Array.isArray(res.data.data)) {
        setCustomers(res.data.data);
        setTotal(res.data.total);
      } else {
        // Fallback in case backend not fully updated yet
        setCustomers(Array.isArray(res.data) ? res.data : []);
        setTotal(Array.isArray(res.data) ? res.data.length : 0);
      }
    } catch (err) {
      setError('Không thể tải danh sách khách hàng. Hãy kiểm tra backend đang chạy!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300); // 300ms debounce for search
    return () => clearTimeout(delayDebounceFn);
  }, [page, sort, rank, search, status]);

  const handleResetFilters = () => {
    setSort('newest');
    setRank('all');
    setStatus('all');
    setSearch('');
    setPage(1);
  };

  const notifySuccess = (action, msg, color = '#d4af37') => {
    notification.success({
      message: <span style={{ color: color, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{action}</span>,
      description: <span style={{ color: '#e5e5e5' }}>{msg}</span>,
      placement: 'top',
      style: { 
        background: '#111', 
        border: `1px solid ${color}`, 
        boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${color}33`,
        borderRadius: '12px',
        padding: '16px 20px'
      }
    });
  };

  const notifyError = (msg) => {
    notification.error({
      message: <span style={{ color: '#ef4444', fontWeight: '900', textTransform: 'uppercase' }}>THẤT BẠI</span>,
      description: <span style={{ color: '#e5e5e5' }}>{msg}</span>,
      placement: 'top',
      style: { background: '#2a1215', border: '1px solid #ef4444', borderRadius: '12px' }
    });
  };

  const openCodModal = (customer, e) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setCodModalVisible(true);
  };

  const confirmLockCOD = async () => {
    try {
      await customerApi.lockCashPayment(selectedCustomer.id);
      setCodModalVisible(false);
      notifySuccess('Khóa COD', `Đã khóa chức năng COD đối với tài khoản ${selectedCustomer.name}.`, '#f59e0b');
      fetchCustomers();
    } catch (err) {
      notifyError('Không thể thao tác!');
    }
  };

  const handleUnlockCOD = async (id, e) => {
    e.stopPropagation();
    try {
      await customerApi.unlockCashPayment(id);
      notifySuccess('Mở COD', 'Đã mở chức năng thanh toán COD đối với khách hàng này.', '#38bdf8');
      fetchCustomers();
    } catch (err) {
      notifyError('Không thể thao tác!');
    }
  };

  const openBlockModal = (customer, e) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setBlockReason('');
    setBlockModalVisible(true);
  };

  const submitBlockCustomer = async () => {
    if (!blockReason.trim()) {
      notifyError('Vui lòng nhập lý do khóa!');
      return;
    }
    try {
      await customerApi.blockCustomer(selectedCustomer.id, { reason: blockReason });
      setBlockModalVisible(false);
      notifySuccess('Khóa Tài Khoản', `Đã khóa tài khoản ${selectedCustomer.name} thành công.`, '#f87171');
      fetchCustomers();
    } catch (err) {
      notifyError('Không thể thao tác!');
    }
  };

  const handleUnblockCustomer = async (id, name, e) => {
    e.stopPropagation();
    try {
      await customerApi.unblockCustomer(id);
      notifySuccess('Mở Khóa Tài Khoản', `Đã mở khóa tài khoản ${name}.`, '#4ade80');
      fetchCustomers();
    } catch (err) {
      notifyError('Không thể thao tác!');
    }
  };

  const openDeleteModal = (customer, e) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setDeleteModalVisible(true);
  };

  const submitDeleteCustomer = async () => {
    try {
      await customerApi.delete(selectedCustomer.id);
      setDeleteModalVisible(false);
      notifySuccess('Xóa Tài Khoản', `Đã xóa tài khoản ${selectedCustomer.name} thành công.`, '#ef4444');
      fetchCustomers();
    } catch (err) {
      notifyError(err.response?.data?.message || 'Không thể thao tác!');
    }
  };

  const columns = [
    {
      title: 'Khách Hàng',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        const isBlocked = record.isBlocked;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', opacity: isBlocked ? 0.5 : 1 }}>
            <Avatar
              src={getAvatarUrl(record.avatar)}
              icon={!record.avatar && <User size={20} />}
              size={48}
              style={{
                backgroundColor: '#1a1a1a',
                border: isBlocked ? '1px solid #ef4444' : '1px solid #d4af37',
                color: isBlocked ? '#ef4444' : '#d4af37',
                boxShadow: isBlocked ? 'none' : '0 0 10px rgba(212,175,55,0.2)',
                filter: isBlocked ? 'grayscale(100%)' : 'none'
              }}
            />
            <div>
              <div style={{ fontWeight: 'bold', color: isBlocked ? '#ff4d4f' : '#fff', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {record.name || 'N/A'}
                {isBlocked && <Tag color="error" style={{ margin: 0, fontSize: '10px' }}>ĐÃ KHÓA</Tag>}
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '13px', marginTop: '4px' }}>{record.email || '—'}</div>
              {record.isCashPaymentLocked && (
                <div style={{ color: '#faad14', fontSize: '11px', marginTop: '4px', fontStyle: 'italic' }}>
                  * Bị khóa COD
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Ngày Tham Gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => <span style={{ color: '#a0a0a0' }}>{text}</span>,
    },
    {
      title: 'Hạng Mức',
      key: 'tier',
      render: (_, record) => (
        <span style={{ color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', border: '1px solid #d4af37', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'rgba(212,175,55,0.1)', whiteSpace: 'nowrap', display: 'inline-block' }}>
          {record.tier || 'Ngôi Sao Mới'}
        </span>
      ),
    },
    {
      title: 'Tổng Đã Chi',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (value) => (
        <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '15px' }}>
          {Number(value || 0).toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      title: 'Số Lần Đặt',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      render: (val) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '15px' }}>{val || 0} lần</span>
      ),
    },
    {
      title: 'Lần Đến Cuối',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      render: (text) => <span style={{ color: '#a0a0a0' }}>{text}</span>,
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          {/* Nút COD */}
          {record.isCashPaymentLocked ? (
            <Button 
              size="small" 
              onClick={(e) => handleUnlockCOD(record.id, e)}
              className="hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #0c2b3d, #164e63)', borderColor: '#0284c7', color: '#38bdf8', width: '105px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 10px rgba(56,189,248,0.2)' }}
            >
              <Unlock size={14} style={{ marginRight: 4 }} /> Mở COD
            </Button>
          ) : (
            <Button 
              size="small" 
              onClick={(e) => openCodModal(record, e)}
              className="hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #331500, #4d2300)', borderColor: '#d97706', color: '#f59e0b', width: '105px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 10px rgba(217,119,6,0.2)' }}
            >
              <AlertTriangle size={14} style={{ marginRight: 4 }} /> Khóa COD
            </Button>
          )}

          {/* Nút Tài Khoản */}
          {record.isBlocked ? (
            <Button 
              size="small" 
              onClick={(e) => handleUnblockCustomer(record.id, record.name, e)}
              className="hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #0d2a13, #133a1b)', borderColor: '#22c55e', color: '#4ade80', width: '105px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 10px rgba(34,197,94,0.2)' }}
            >
              <Unlock size={14} style={{ marginRight: 4 }} /> Mở TK
            </Button>
          ) : (
            <Button 
              size="small" 
              danger
              onClick={(e) => openBlockModal(record, e)}
              className="hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #3b0a0a, #4a0d0d)', borderColor: '#ef4444', color: '#f87171', width: '105px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 10px rgba(239,68,68,0.2)' }}
            >
              <Ban size={14} style={{ marginRight: 4 }} /> Khóa TK
            </Button>
          )}

          {/* Nút Xóa Khách Hàng */}
          <Button 
            size="small" 
            danger
            onClick={(e) => openDeleteModal(record, e)}
            className="hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #222, #111)', borderColor: '#888', color: '#a0a0a0', width: '105px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Trash2 size={14} style={{ marginRight: 4 }} /> Xóa KH
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>
            Khách Hàng
          </Title>
          <p style={{ color: '#a0a0a0', marginTop: 4 }}>
            {!loading && `Tổng cộng ${total} khách hàng`}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Select
            value={sort}
            onChange={(val) => { setSort(val); setPage(1); }}
            style={{ width: 200 }}
            className="custom-select custom-select-dropdown"
          >
            <Option value="newest">Mới nhất → Cũ nhất</Option>
            <Option value="oldest">Cũ nhất → Mới nhất</Option>
          </Select>

          <Select
            value={rank}
            onChange={(val) => { setRank(val); setPage(1); }}
            style={{ width: 180 }}
            className="custom-select custom-select-dropdown"
          >
            <Option value="all">Tất cả hạng mức</Option>
            <Option value="Ngôi Sao Mới">Ngôi Sao Mới</Option>
            <Option value="Người Của Công Chúng">Người Của Công Chúng</Option>
            <Option value="Sát Thủ Lịch Lãm">Sát Thủ Lịch Lãm</Option>
            <Option value="Biểu Tượng Thời Đại">Biểu Tượng Thời Đại</Option>
            <Option value="Vũ Trụ Nhan Sắc">Vũ Trụ Nhan Sắc</Option>
          </Select>

          <Select
            value={status}
            onChange={(val) => { setStatus(val); setPage(1); }}
            style={{ width: 170 }}
            className="custom-select custom-select-dropdown"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="locked_cod">Bị khóa COD</Option>
            <Option value="locked_account">Bị khóa tài khoản</Option>
          </Select>

          <Input
            placeholder="Tìm kiếm tên hoặc email..."
            prefix={<Search size={16} color="#a0a0a0" />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              width: 250,
              background: '#1a1a1a',
              borderColor: '#333',
              color: '#fff',
            }}
          />

          <Button 
            onClick={handleResetFilters}
            style={{ background: '#222', borderColor: '#444', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={16} /> Đặt lại
          </Button>
        </div>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      <Spin spinning={loading}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table
            columns={columns}
            dataSource={customers.map((c) => ({ ...c, key: c.id }))}
            pagination={{ 
              current: page,
              pageSize: 10,
              total: total,
              onChange: (p) => setPage(p),
              showSizeChanger: false
            }}
            rowClassName="customer-row"
            onRow={(record) => ({
              onClick: () => navigate(`/customers/${record.id}`),
              style: { cursor: 'pointer', transition: 'all 0.3s ease' },
            })}
            locale={{ emptyText: loading ? '' : 'Chưa có khách hàng nào' }}
            scroll={{ x: 1000 }}
          />
        </div>
      </Spin>

      {/* Block Account Modal */}
      <Modal
        open={blockModalVisible}
        onCancel={() => setBlockModalVisible(false)}
        footer={null}
        closable={false}
        wrapClassName="dark-luxury-modal-wrap"
        styles={{ 
          mask: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          body: { padding: 0, backgroundColor: 'transparent' }
        }}
        width={400}
      >
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #ef4444',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100px', height: '10px', background: '#ef4444', filter: 'blur(20px)', borderRadius: '50%'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ margin: 0, color: '#ef4444', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Khóa Tài Khoản
            </h3>
          </div>

          <p style={{ color: '#e5e5e5', marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>
            Bạn có chắc muốn khóa tài khoản <strong>{selectedCustomer?.name}</strong> không?
            <br/><br/>
            Sau khi khóa, khách hàng sẽ <strong>không thể đăng nhập</strong>, không thể đặt lịch hay thanh toán.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Lý do khóa:
            </label>
            <Input.TextArea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Ví dụ: Vi phạm quy tắc cộng đồng..."
              rows={3}
              style={{
                backgroundColor: '#111',
                borderColor: '#333',
                color: '#fff',
                borderRadius: '8px',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button 
              onClick={() => setBlockModalVisible(false)}
              style={{ background: '#222', borderColor: '#444', color: '#a0a0a0', borderRadius: '8px' }}
            >
              Hủy
            </Button>
            <Button 
              danger 
              type="primary" 
              onClick={submitBlockCustomer}
              style={{ background: '#ef4444', borderColor: '#ef4444', borderRadius: '8px', fontWeight: 'bold' }}
            >
              Xác Nhận Khóa
            </Button>
          </div>
        </div>
      </Modal>
      {/* Lock COD Modal */}
      <Modal
        open={codModalVisible}
        onCancel={() => setCodModalVisible(false)}
        footer={null}
        closable={false}
        wrapClassName="dark-luxury-modal-wrap"
        styles={{ 
          mask: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          body: { padding: 0, backgroundColor: 'transparent' }
        }}
        width={400}
      >
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #fa8c16',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 0 40px rgba(250, 140, 22, 0.2)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100px', height: '10px', background: '#fa8c16', filter: 'blur(20px)', borderRadius: '50%'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(250, 140, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fa8c16' }}>
              <Lock size={24} />
            </div>
            <h3 style={{ margin: 0, color: '#fa8c16', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Xác Nhận Khóa COD
            </h3>
          </div>

          <p style={{ color: '#e5e5e5', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
            Bạn có chắc muốn khóa chức năng thanh toán COD đối với <strong>{selectedCustomer?.name}</strong>?
            <br/><br/>
            Khách hàng này sẽ chỉ có thể thanh toán qua các cổng trực tuyến (VNPay, MoMo) cho các đơn hàng tiếp theo.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button 
              onClick={() => setCodModalVisible(false)}
              style={{ background: '#222', borderColor: '#444', color: '#a0a0a0', borderRadius: '8px' }}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={confirmLockCOD}
              style={{ background: '#fa8c16', borderColor: '#fa8c16', borderRadius: '8px', fontWeight: 'bold', color: '#fff' }}
            >
              Khóa COD
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Customer Modal */}
      <Modal
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
        closable={false}
        wrapClassName="dark-luxury-modal-wrap"
        styles={{ 
          mask: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          body: { padding: 0, backgroundColor: 'transparent' }
        }}
        width={400}
      >
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #ef4444',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100px', height: '10px', background: '#ef4444', filter: 'blur(20px)', borderRadius: '50%'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ margin: 0, color: '#ef4444', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Xóa Hoàn Toàn
            </h3>
          </div>

          <p style={{ color: '#e5e5e5', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
            Bạn có chắc chắn muốn xóa khách hàng <strong>{selectedCustomer?.name}</strong> vĩnh viễn?
            <br/><br/>
            Hành động này <strong style={{color:'#ef4444'}}>không thể hoàn tác</strong>. Mọi lịch sử đặt lịch và đơn hàng sẽ bị mất liên kết với tài khoản này.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button 
              onClick={() => setDeleteModalVisible(false)}
              style={{ background: '#222', borderColor: '#444', color: '#a0a0a0', borderRadius: '8px' }}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              danger
              onClick={submitDeleteCustomer}
              style={{ background: '#ef4444', borderColor: '#ef4444', borderRadius: '8px', fontWeight: 'bold' }}
            >
              Xác Nhận Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Customers;

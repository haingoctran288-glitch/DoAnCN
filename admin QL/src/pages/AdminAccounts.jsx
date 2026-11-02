import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Space, Modal, Form, Input, Select, Tag, Popconfirm, notification } from 'antd';
import { PlusCircle, Edit, Trash2, UserCog, ShieldCheck } from 'lucide-react';
import { adminAccountApi, staffApi } from '../api';

const { Title, Text } = Typography;

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [staffList, setStaffList] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  const filteredAccounts = accounts.filter(acc => {
    const matchRole = filterRole === 'all' || acc.role === filterRole;
    const matchBranch = filterRole === 'ADMIN' || filterBranch === 'all' || acc.branch === filterBranch;
    return matchRole && matchBranch;
  });

  const fetchStaff = async () => {
    try {
      const res = await staffApi.getAll();
      setStaffList(res.data);
    } catch (err) {
      console.error("Fetch Staff Error:", err);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await adminAccountApi.getAll();
      setAccounts(res.data);
    } catch (err) {
      console.error("Fetch Accounts Error:", err.response?.data);
      notification.error({ message: 'Lỗi', description: err.response?.data?.message || 'Không thể tải danh sách tài khoản quản lý.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchStaff();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      username: record.username,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      role: record.role,
      branch: record.branch,
      employeeId: record.employeeId,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminAccountApi.delete(id);
      notification.success({
        message: 'ĐÃ XÓA TÀI KHOẢN',
        description: 'Tài khoản đã được xóa khỏi hệ thống.',
        icon: <Trash2 color="#ff4d4f" />,
        style: { backgroundColor: '#fff2f0', border: '1px solid #ffccc7' },
      });
      fetchAccounts();
    } catch (err) {
      notification.error({ message: 'Lỗi', description: err.response?.data?.message || 'Không thể xóa tài khoản.' });
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await adminAccountApi.update(editingId, values);
        
        // Sync header if editing the currently logged-in user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id === editingId) {
          const updated = { 
            ...currentUser, 
            fullName: values.fullName, 
            username: values.username, 
            role: values.role 
          };
          localStorage.setItem('user', JSON.stringify(updated));
          window.dispatchEvent(new Event('userUpdated'));
        }

        notification.success({ message: 'CẬP NHẬT THÀNH CÔNG' });
      } else {
        await adminAccountApi.create(values);
        notification.success({ message: 'THÊM THÀNH CÔNG' });
      }
      setModalVisible(false);
      fetchAccounts();
    } catch (err) {
      notification.error({ message: 'Lỗi', description: err.response?.data?.message || 'Không thể lưu tài khoản.' });
    }
  };

  const columns = [
    {
      title: 'Họ Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => <Text strong style={{ color: '#fff' }}>{text}</Text>,
    },
    {
      title: 'Tên Đăng Nhập',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <Text style={{ color: '#d4af37' }}>@{text}</Text>,
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Tag color={role === 'ADMIN' ? 'gold' : role === 'EDITOR' ? 'blue' : 'green'} icon={role === 'ADMIN' ? <ShieldCheck size={14} style={{ marginRight: 4 }} /> : <UserCog size={14} style={{ marginRight: 4 }} />}>
            {role}
          </Tag>
          {role === 'EDITOR' && record.branch && (
            <span style={{ fontSize: 11, color: '#a0a0a0', marginTop: 4 }}>
              CN: {record.branch}
            </span>
          )}
          {role === 'EMPLOYEE' && record.employeeId && (
            <span style={{ fontSize: 11, color: '#a0a0a0', marginTop: 4 }}>
              NV: {staffList.find(s => s.id === record.employeeId)?.name || record.employeeId}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'SĐT / Email',
      key: 'contact',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ color: '#ccc', fontSize: 13 }}>{record.phone || '—'}</Text>
          <Text style={{ color: '#888', fontSize: 12 }}>{record.email || '—'}</Text>
        </div>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" style={{ color: '#d4af37' }} icon={<Edit size={16} />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa tài khoản?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleResetSystemData = async () => {
    try {
      setLoading(true);
      await adminAccountApi.resetSystemData();
      notification.success({
        message: 'RESET DỮ LIỆU THÀNH CÔNG',
        description: 'Toàn bộ dữ liệu khách hàng, lịch đặt, đơn hàng và voucher đã phát đã được làm sạch.',
      });
      fetchAccounts();
      setResetModalVisible(false);
    } catch (err) {
      notification.error({
        message: 'Reset Thất Bại',
        description: err.response?.data?.message || 'Không thể reset dữ liệu hệ thống.',
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>Tài Khoản Quản Lý</Title>
          <Text type="secondary">Quản lý tài khoản truy cập Admin Panel</Text>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button 
            danger
            type="primary"
            style={{ fontWeight: 'bold', backgroundColor: '#a61d24', borderColor: '#a61d24' }}
            onClick={() => setResetModalVisible(true)}
          >
            Reset Dữ Liệu Hệ Thống
          </Button>
          <Button 
            type="primary" 
            icon={<PlusCircle size={20} />} 
            style={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold' }}
            onClick={handleAdd}
          >
            Thêm Tài Khoản
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <Select
          value={filterRole}
          onChange={(val) => {
            setFilterRole(val);
            if (val === 'ADMIN') setFilterBranch('all');
          }}
          style={{ width: 180 }}
          placeholder="Lọc vai trò"
        >
          <Select.Option value="all">Tất cả vai trò</Select.Option>
          <Select.Option value="ADMIN">ADMIN</Select.Option>
          <Select.Option value="EDITOR">EDITOR</Select.Option>
          <Select.Option value="EMPLOYEE">EMPLOYEE</Select.Option>
        </Select>

        {filterRole === 'EMPLOYEE' && (
          <Select
            value={filterBranch}
            onChange={setFilterBranch}
            style={{ width: 180 }}
            placeholder="Lọc chi nhánh"
          >
            <Select.Option value="all">Tất cả chi nhánh</Select.Option>
            <Select.Option value="Quận 1">Quận 1</Select.Option>
            <Select.Option value="Quận 2">Quận 2</Select.Option>
            <Select.Option value="Quận 3">Quận 3</Select.Option>
            <Select.Option value="Quận 7">Quận 7</Select.Option>
            <Select.Option value="Quận 9">Quận 9</Select.Option>
            <Select.Option value="Bình Thạnh">Bình Thạnh</Select.Option>
          </Select>
        )}
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredAccounts} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => `Tổng ${total} tài khoản` }}
      />

      <Modal
        title={<span style={{ color: '#d4af37' }}>{editingId ? 'SỬA TÀI KHOẢN' : 'THÊM TÀI KHOẢN'}</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="fullName" label="Họ Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Tên Đăng Nhập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item 
            name="password" 
            label={editingId ? "Mật khẩu (Bỏ trống nếu không đổi)" : "Mật khẩu"} 
            rules={[{ required: !editingId, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Vai Trò" rules={[{ required: true }]}>
            <Select onChange={() => form.validateFields(['branch'])}>
              <Select.Option value="ADMIN">Admin (Toàn quyền)</Select.Option>
              <Select.Option value="EDITOR">Editor (Chi nhánh)</Select.Option>
              <Select.Option value="EMPLOYEE">Nhân viên (Xem lịch làm)</Select.Option>
            </Select>
          </Form.Item>
          
          {/* Component Item được bọc trong một hàm Form.Item phụ thuộc `role` */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role || prevValues.branch !== currentValues.branch}
          >
            {({ getFieldValue }) => {
              const role = getFieldValue('role');
              if (role === 'EDITOR') {
                return (
                  <Form.Item
                    name="branch"
                    label="Chi Nhánh Quản Lý"
                    rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
                  >
                    <Select placeholder="Chọn chi nhánh">
                      <Select.Option value="Quận 1">Quận 1</Select.Option>
                      <Select.Option value="Quận 2">Quận 2</Select.Option>
                      <Select.Option value="Quận 3">Quận 3</Select.Option>
                      <Select.Option value="Quận 7">Quận 7</Select.Option>
                      <Select.Option value="Quận 9">Quận 9</Select.Option>
                      <Select.Option value="Bình Thạnh">Bình Thạnh</Select.Option>
                    </Select>
                  </Form.Item>
                );
              } else if (role === 'EMPLOYEE') {
                const selectedBranch = getFieldValue('branch');
                const filteredStaff = selectedBranch ? staffList.filter(s => s.branch === selectedBranch) : [];
                return (
                  <>
                    <Form.Item
                      name="branch"
                      label="Chi Nhánh"
                      rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
                    >
                      <Select 
                        placeholder="Chọn chi nhánh"
                        onChange={() => form.setFieldsValue({ employeeId: undefined })}
                      >
                        <Select.Option value="Quận 1">Quận 1</Select.Option>
                        <Select.Option value="Quận 2">Quận 2</Select.Option>
                        <Select.Option value="Quận 3">Quận 3</Select.Option>
                        <Select.Option value="Quận 7">Quận 7</Select.Option>
                        <Select.Option value="Quận 9">Quận 9</Select.Option>
                        <Select.Option value="Bình Thạnh">Bình Thạnh</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="employeeId"
                      label="Nhân viên liên kết"
                      rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                    >
                      <Select placeholder={selectedBranch ? "Chọn nhân viên" : "Vui lòng chọn chi nhánh trước"} showSearch filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())} disabled={!selectedBranch}>
                        {filteredStaff.map(s => (
                          <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                );
              }
              return null;
            }}
          </Form.Item>
          <Button type="primary" htmlType="submit" block style={{ background: '#d4af37', color: '#000', fontWeight: 'bold' }}>
            Lưu
          </Button>
        </Form>
      </Modal>

      {/* CUSTOM RESET WARNING MODAL */}
      <Modal
        open={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        footer={null}
        width={550}
        centered
        closeIcon={<span style={{ color: '#888', fontSize: '18px' }}>×</span>}
        className="premium-modal"
        styles={{ 
          content: { 
            backgroundColor: '#111', 
            border: '1px solid #ff4d4f', 
            boxShadow: '0 0 30px rgba(255, 77, 79, 0.2)',
            padding: 0,
            overflow: 'hidden'
          } 
        }}
      >
        <div style={{ backgroundColor: '#2b1216', padding: '24px', borderBottom: '1px solid #ff4d4f40' }}>
          <Title level={4} style={{ color: '#ff4d4f', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span> CẢNH BÁO MẤT DỮ LIỆU NGHIÊM TRỌNG
          </Title>
        </div>
        
        <div style={{ padding: '24px' }}>
          <Text style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            Hành động này sẽ <span style={{ color: '#ff4d4f', textDecoration: 'underline' }}>XÓA VĨNH VIỄN</span> các dữ liệu vận hành sau:
          </Text>
          
          <ul style={{ paddingLeft: '24px', marginBottom: '24px', color: '#ff7875', lineHeight: '2', fontSize: '14px' }}>
            <li>Toàn bộ hồ sơ <strong style={{ color: '#fff' }}>Khách Hàng</strong> và lịch sử giao dịch.</li>
            <li>Toàn bộ <strong style={{ color: '#fff' }}>Lịch Đặt (Bookings)</strong> của tất cả chi nhánh.</li>
            <li>Toàn bộ <strong style={{ color: '#fff' }}>Đơn Hàng (Orders)</strong> & Doanh thu tương ứng.</li>
            <li>Toàn bộ <strong style={{ color: '#fff' }}>Voucher</strong> đã được phát hoặc sử dụng.</li>
          </ul>
          
          <div style={{ backgroundColor: '#1f0d10', padding: '16px', borderRadius: '8px', border: '1px dashed #ff4d4f', textAlign: 'center', marginBottom: '32px' }}>
            <Text style={{ margin: 0, fontWeight: 'bold', color: '#ff4d4f', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Dữ liệu đã xóa sẽ KHÔNG THỂ KHÔI PHỤC!
            </Text>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button 
              size="large"
              style={{ backgroundColor: '#222', borderColor: '#444', color: '#a0a0a0', fontWeight: 'bold', width: '160px' }}
              onClick={() => setResetModalVisible(false)}
            >
              HỦY BỎ AN TOÀN
            </Button>
            <Button 
              size="large"
              type="primary" 
              danger
              loading={loading}
              onClick={handleResetSystemData}
              style={{ fontWeight: 'bold', backgroundColor: '#d9363e', borderColor: '#d9363e', width: '200px' }}
            >
              XÁC NHẬN XÓA SẠCH
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminAccounts;

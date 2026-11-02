import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, Typography, message, Space, Popconfirm, Card } from 'antd';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const BASE_URL = 'http://localhost:8080';

const Penalty = () => {
  const [data, setData] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchStaff();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.get(`${BASE_URL}/api/penalties`, { headers });
      setData(res.data);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải dữ liệu vi phạm');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/staff/all`);
      setStaffList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const showModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        staffId: record.staff?.id,
        penaltyType: record.penaltyType,
        amount: record.amount,
        penaltyDate: dayjs(record.penaltyDate),
        notes: record.notes
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ penaltyDate: dayjs() });
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        staff: { id: values.staffId },
        penaltyType: values.penaltyType,
        amount: values.amount,
        penaltyDate: values.penaltyDate.format('YYYY-MM-DD'),
        notes: values.notes
      };

      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      if (editingId) {
        await axios.put(`${BASE_URL}/api/penalties/${editingId}`, payload, { headers });
        message.success('Cập nhật thành công');
      } else {
        await axios.post(`${BASE_URL}/api/penalties`, payload, { headers });
        message.success('Thêm mới thành công');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.delete(`${BASE_URL}/api/penalties/${id}`, { headers });
      message.success('Xóa thành công');
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi xóa');
    }
  };

  const columns = [
    { 
      title: 'Ngày vi phạm', 
      dataIndex: 'penaltyDate', 
      key: 'penaltyDate', 
      render: (val) => dayjs(val).format('DD/MM/YYYY'),
      width: 120
    },
    { 
      title: 'Nhân viên', 
      dataIndex: 'staff', 
      key: 'staffName', 
      render: (staff) => staff ? <span style={{ fontWeight: 'bold' }}>{staff.name} <br/><span style={{fontSize: 12, color: '#888', fontWeight: 'normal'}}>{staff.branch}</span></span> : '—' 
    },
    { 
      title: 'Loại vi phạm', 
      dataIndex: 'penaltyType', 
      key: 'penaltyType',
      render: (val) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{val}</span>
    },
    { 
      title: 'Số tiền phạt (VNĐ)', 
      dataIndex: 'amount', 
      key: 'amount', 
      align: 'right',
      render: (val) => <b style={{ color: '#ff4d4f', fontSize: 16 }}>{val?.toLocaleString()} ₫</b> 
    },
    { 
      title: 'Ghi chú', 
      dataIndex: 'notes', 
      key: 'notes' 
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<Edit size={18} />} onClick={() => showModal(record)} style={{ color: '#1890ff', padding: 0 }} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<Trash2 size={18} />} style={{ padding: 0 }} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ color: '#d4af37', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Quản lý Vi phạm</Title>
        <Button type="primary" danger icon={<Plus size={18} />} onClick={() => showModal()} size="large" style={{ fontWeight: 'bold', border: 'none' }}>
          GHI NHẬN VI PHẠM
        </Button>
      </div>

      <Card bordered={false} style={{ background: '#111', border: '1px solid #333', borderRadius: 16 }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 15 }}
          scroll={{ x: 800 }}
          className="premium-table"
        />
      </Card>

      <Modal 
        title={
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 900, color: '#ff4d4f', textTransform: 'uppercase', letterSpacing: 1, paddingBottom: 10 }}>
            {editingId ? 'CẬP NHẬT VI PHẠM' : 'GHI NHẬN VI PHẠM'}
          </div>
        } 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="LƯU BIÊN BẢN"
        cancelText="HỦY"
        centered
        width={500}
        okButtonProps={{ danger: true, size: 'large', style: { fontWeight: 'bold', border: 'none', padding: '0 24px' } }}
        cancelButtonProps={{ size: 'large' }}
        styles={{ 
          body: { backgroundColor: '#111', padding: '24px' },
          header: { backgroundColor: '#111', borderBottom: '1px solid #333' },
          content: { backgroundColor: '#111', border: '1px solid #333', borderRadius: 16 }
        }}
        closeIcon={<span style={{color:'#fff'}}>X</span>}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="staffId" label={<span style={{color: '#fff'}}>Nhân viên</span>} rules={[{ required: true, message: 'Chọn nhân viên' }]}>
            <Select 
              showSearch 
              optionFilterProp="children" 
              placeholder="Chọn nhân viên"
              size="large"
              style={{ width: '100%' }}
              dropdownStyle={{ backgroundColor: '#222', color: '#fff' }}
            >
              {staffList.map(s => (
                <Option key={s.id} value={s.id} style={{ color: '#fff' }}>
                  <span style={{ fontWeight: 'bold' }}>{s.name}</span> <span style={{ color: '#888' }}>({s.branch})</span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="penaltyType" label={<span style={{color: '#fff'}}>Loại vi phạm</span>} rules={[{ required: true, message: 'Nhập loại vi phạm' }]}>
            <Input placeholder="VD: Đi trễ, Nghỉ không phép, Thái độ..." size="large" style={{ backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} />
          </Form.Item>

          <Form.Item name="amount" label={<span style={{color: '#fff'}}>Số tiền phạt (VNĐ)</span>} rules={[{ required: true, message: 'Nhập số tiền' }]}>
            <InputNumber 
              min={0} 
              style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} 
              size="large" 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
              parser={value => value.replace(/\$\s?|(,*)/g, '')} 
              addonAfter={<span style={{color: '#ff4d4f'}}>VNĐ</span>}
            />
          </Form.Item>

          <Form.Item name="penaltyDate" label={<span style={{color: '#fff'}}>Ngày vi phạm</span>} rules={[{ required: true, message: 'Chọn ngày' }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" />
          </Form.Item>

          <Form.Item name="notes" label={<span style={{color: '#fff'}}>Ghi chú (Tùy chọn)</span>}>
            <Input.TextArea rows={3} style={{ backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} placeholder="Chi tiết vi phạm..." />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .premium-table .ant-table {
          background-color: transparent !important;
        }
        .premium-table .ant-table-thead > tr > th {
          background-color: #1a1a1a !important;
          color: #d4af37 !important;
          border-bottom: 1px solid #333 !important;
          font-weight: 800 !important;
        }
        .premium-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #222 !important;
          color: #fff !important;
        }
        .premium-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(212, 175, 55, 0.05) !important;
        }
        .ant-picker-input > input {
          color: #fff !important;
        }
        .ant-select-selection-item {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default Penalty;

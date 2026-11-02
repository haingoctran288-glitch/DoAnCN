import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Table, Typography, message, Space, Popconfirm, Row, Col, Modal } from 'antd';
import axios from 'axios';
import { Save, Plus, Trash2, Edit } from 'lucide-react';

const { Title, Text } = Typography;
const BASE_URL = 'http://localhost:8080';

const SalarySettings = () => {
  const [form] = Form.useForm();
  const [expForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [settings, setSettings] = useState(null);
  const [expSalaries, setExpSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [res1, res2] = await Promise.all([
        axios.get(`${BASE_URL}/api/salary-settings`, { headers }),
        axios.get(`${BASE_URL}/api/experience-salaries`, { headers })
      ]);
      setSettings(res1.data);
      form.setFieldsValue(res1.data);
      setExpSalaries(res2.data);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải cấu hình lương');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (values) => {
    setSavingSettings(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${BASE_URL}/api/salary-settings`, values, { headers });
      message.success('Đã lưu cấu hình chung');
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi lưu cấu hình');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddExpSalary = async (values) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post(`${BASE_URL}/api/experience-salaries`, values, { headers });
      message.success('Đã thêm mốc kinh nghiệm');
      expForm.resetFields();
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi thêm mốc kinh nghiệm');
    }
  };

  const openEditModal = (record) => {
    setEditingId(record.id);
    editForm.setFieldsValue(record);
    setIsEditModalOpen(true);
  };

  const handleEditExpSalary = async () => {
    try {
      const values = await editForm.validateFields();
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${BASE_URL}/api/experience-salaries/${editingId}`, values, { headers });
      message.success('Cập nhật mốc kinh nghiệm thành công');
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi cập nhật');
    }
  };

  const handleDeleteExpSalary = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.delete(`${BASE_URL}/api/experience-salaries/${id}`, { headers });
      message.success('Đã xóa mốc kinh nghiệm');
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi xóa');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', overflowX: 'hidden' }}>
      <Title level={2} style={{ color: '#d4af37', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '1px' }}>
        Cài đặt Lương & Hoa hồng
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#d4af37', fontWeight: 900, fontSize: 16 }}>CẤU HÌNH CHUNG</span>} 
            bordered={false} 
            style={{ background: '#111', border: '1px solid #333', borderRadius: 16 }}
            headStyle={{ borderBottom: '1px solid #333' }}
          >
            <Form form={form} layout="vertical" onFinish={handleSaveSettings}>
              <Form.Item label={<span style={{color: '#fff'}}>Hoa hồng dịch vụ (%)</span>} name="commissionRate" rules={[{ required: true }]}>
                <InputNumber min={0} max={100} style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" addonAfter={<span style={{color: '#d4af37'}}>%</span>} />
              </Form.Item>
              <Form.Item label={<span style={{color: '#fff'}}>Mức trừ tiền lương ngày: Nghỉ CÓ phép (%)</span>} name="permittedLeaveDeductionRate" rules={[{ required: true }]} tooltip="Ví dụ: 70% nghĩa là nhân viên chỉ bị trừ 70% lương ngày khi nghỉ có phép">
                <InputNumber min={0} max={100} style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" addonAfter={<span style={{color: '#d4af37'}}>%</span>} />
              </Form.Item>
              <Form.Item label={<span style={{color: '#fff'}}>Mức trừ tiền lương ngày: Nghỉ KHÔNG phép (%)</span>} name="unpermittedLeaveDeductionRate" rules={[{ required: true }]}>
                <InputNumber min={0} max={100} style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" addonAfter={<span style={{color: '#d4af37'}}>%</span>} />
              </Form.Item>
              <Form.Item label={<span style={{color: '#fff'}}>Tiền phạt nghỉ KHÔNG phép (VNĐ)</span>} name="unpermittedLeavePenalty" rules={[{ required: true }]} tooltip="Ngoài bị trừ lương ngày, còn bị phạt thêm bao nhiêu">
                <InputNumber min={0} style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" addonAfter={<span style={{color: '#d4af37'}}>VNĐ</span>} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
              </Form.Item>
              <Form.Item label={<span style={{color: '#fff'}}>Phạt đi trễ mặc định (VNĐ)</span>} name="latePenalty" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" addonAfter={<span style={{color: '#d4af37'}}>VNĐ</span>} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<Save size={18} />} loading={savingSettings} size="large" style={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', width: '100%', marginTop: 10, border: 'none', height: 45 }}>
                LƯU CẤU HÌNH CHUNG
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#d4af37', fontWeight: 900, fontSize: 16 }}>MỨC LƯƠNG THEO KINH NGHIỆM</span>} 
            bordered={false} 
            style={{ background: '#111', border: '1px solid #333', borderRadius: 16 }}
            headStyle={{ borderBottom: '1px solid #333' }}
          >
            <Form form={expForm} layout="inline" onFinish={handleAddExpSalary} style={{ marginBottom: 24, display: 'flex', gap: '8px' }}>
              <Form.Item name="yearsOfExperience" rules={[{ required: true, message: 'Nhập số năm' }]} style={{ margin: 0, flex: 1 }}>
                <InputNumber min={0} placeholder="Số năm" style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" />
              </Form.Item>
              <Form.Item name="baseSalary" rules={[{ required: true, message: 'Nhập lương' }]} style={{ margin: 0, flex: 2 }}>
                <InputNumber min={0} placeholder="Lương cơ bản (VNĐ)" style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <Button type="primary" htmlType="submit" icon={<Plus size={18} />} style={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', border: 'none', height: 40 }}>
                  Thêm
                </Button>
              </Form.Item>
            </Form>

            <Table 
              dataSource={expSalaries} 
              rowKey="id" 
              loading={loading}
              pagination={false}
              scroll={{ y: 450 }}
              size="middle"
              className="premium-table"
              columns={[
                { title: 'Kinh nghiệm (Năm)', dataIndex: 'yearsOfExperience', key: 'yearsOfExperience', align: 'center', sorter: (a, b) => a.yearsOfExperience - b.yearsOfExperience, defaultSortOrder: 'ascend' },
                { title: 'Lương cơ bản (VNĐ)', dataIndex: 'baseSalary', key: 'baseSalary', align: 'right', render: (val) => <b style={{ color: '#d4af37', fontSize: 16 }}>{val?.toLocaleString()} ₫</b> },
                { title: 'Hành động', key: 'action', align: 'center', width: 100, render: (_, record) => (
                  <Space>
                    <Button type="text" icon={<Edit size={16} />} onClick={() => openEditModal(record)} style={{ color: '#1890ff', padding: 0 }} />
                    <Popconfirm title="Xóa mốc này?" onConfirm={() => handleDeleteExpSalary(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                      <Button type="text" danger icon={<Trash2 size={16} />} style={{ padding: 0 }} />
                    </Popconfirm>
                  </Space>
                )}
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={<span style={{ color: '#d4af37', fontWeight: 900 }}>CẬP NHẬT MỨC LƯƠNG</span>}
        open={isEditModalOpen}
        onOk={handleEditExpSalary}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', border: 'none' } }}
        styles={{ 
          body: { backgroundColor: '#111', padding: '24px' },
          header: { backgroundColor: '#111', borderBottom: '1px solid #333' },
          content: { backgroundColor: '#111', border: '1px solid #333' }
        }}
        closeIcon={<span style={{color:'#fff'}}>X</span>}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="yearsOfExperience" label={<span style={{color: '#fff'}}>Kinh nghiệm (Năm)</span>} rules={[{ required: true, message: 'Nhập số năm' }]}>
            <InputNumber min={0} style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" />
          </Form.Item>
          <Form.Item name="baseSalary" label={<span style={{color: '#fff'}}>Lương cơ bản (VNĐ)</span>} rules={[{ required: true, message: 'Nhập lương' }]}>
            <InputNumber min={0} style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} size="large" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
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
      `}</style>
    </div>
  );
};

export default SalarySettings;

import React, { useState, useEffect } from 'react';
import { 
  Table, Typography, Button, Modal, Form, Input, InputNumber, 
  Select, DatePicker, Switch, Space, Popconfirm, Tag, message, 
  Row, Col, Alert, notification
} from 'antd';
import { PlusCircle, Edit, Trash2, RefreshCw, Calendar, Sparkles, CheckCircle } from 'lucide-react';
import { voucherApi } from '../api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const TRIGGER_TYPES = {
  NEW_REGISTER: 'Đăng Ký Thành Viên Mới',
  FIRST_BOOKING_COMPLETED: 'Hoàn Thành Lịch Hẹn Đầu Tiên',
  FIRST_PRODUCT_ORDER: 'Hoàn Thành Đơn Hàng Đầu Tiên',
  BOOKING_COUNT_X: 'Số Lần Đặt Lịch Đạt Mốc X',
  COMPLETED_HAIRCUTS_X: 'Số Lần Cắt Tóc Đạt Mốc X',
  MEMBERSHIP_TIER: 'Đạt Hạng Thành Viên VIP',
  BIRTHDAY: 'Quà Tặng Sinh Nhật Khách Hàng',
  ORDER_VALUE_OVER_X: 'Giá Trị Đơn Hàng Đạt Mốc X'
};

const VoucherCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form] = Form.useForm();
  const [selectedTrigger, setSelectedTrigger] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campaignsRes, vouchersRes] = await Promise.all([
        voucherApi.getCampaigns(),
        voucherApi.getAll()
      ]);
      setCampaigns(campaignsRes.data || []);
      setVouchers(vouchersRes.data || []);
    } catch (error) {
      message.error('Không thể tải dữ liệu chiến dịch');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingCampaign(null);
    setSelectedTrigger(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCampaign(record);
    setSelectedTrigger(record.triggerType);
    form.setFieldsValue({
      ...record,
      dateRange: [
        record.startDate ? dayjs(record.startDate) : null,
        record.endDate ? dayjs(record.endDate) : null,
      ]
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const campaignToDelete = campaigns.find(c => c.id === id);
    try {
      await voucherApi.deleteCampaign(id);
      notification.open({
        message: 'ĐÃ XÓA CHIẾN DỊCH',
        description: `Chiến dịch "${campaignToDelete?.name || ''}" đã được xóa thành công.`,
        icon: <Trash2 color="#ff4d4f" size={24} />,
        style: {
          backgroundColor: '#fff1f0',
          border: '1px solid #ffa39e',
        },
      });
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa chiến dịch');
    }
  };

  const handleToggleStatus = async (id) => {
    const campaign = campaigns.find(c => c.id === id);
    const newStatus = !campaign?.isActive;
    const statusText = newStatus ? 'Kích hoạt' : 'Tạm ngưng';
    try {
      await voucherApi.toggleCampaignStatus(id);
      notification.success({
        message: 'CẬP NHẬT TRẠNG THÁI',
        description: `Chiến dịch "${campaign?.name || ''}" đã được chuyển sang trạng thái: ${statusText}.`,
        icon: <CheckCircle color="#52c41a" size={24} />,
        style: {
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
        },
      });
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleSaveCampaign = async (values) => {
    try {
      const [startDate, endDate] = values.dateRange || [null, null];
      const payload = {
        ...values,
        startDate: startDate ? startDate.format('YYYY-MM-DDTHH:mm:ss') : null,
        endDate: endDate ? endDate.format('YYYY-MM-DDTHH:mm:ss') : null,
        isActive: values.isActive ?? true,
      };
      delete payload.dateRange;

      if (editingCampaign) {
        await voucherApi.updateCampaign(editingCampaign.id, payload);
        notification.success({
          message: 'CẬP NHẬT THÀNH CÔNG',
          description: `Thông tin chiến dịch "${payload.name}" đã được cập nhật thành công.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      } else {
        await voucherApi.createCampaign(payload);
        notification.success({
          message: 'THÊM THÀNH CÔNG',
          description: `Chiến dịch mới "${payload.name}" đã được tạo thành công.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi lưu chiến dịch');
    }
  };

  const getVoucherLabel = (voucherId) => {
    const v = vouchers.find(item => item.id === voucherId);
    return v ? `${v.name} (${v.code})` : `ID: ${voucherId}`;
  };

  const columns = [
    {
      title: 'Tên Chiến Dịch',
      key: 'name',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{record.name}</div>
          <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
            ID: {record.id}
          </div>
        </div>
      )
    },
    {
      title: 'Quy Tắc Kích Hoạt (Trigger)',
      key: 'trigger',
      render: (_, record) => {
        const typeName = TRIGGER_TYPES[record.triggerType] || record.triggerType;
        const val = record.triggerValue;
        return (
          <div>
            <Tag color="geekblue" style={{ fontWeight: 'bold' }}>{typeName}</Tag>
            {val && (
              <div style={{ color: '#d4af37', fontSize: '13px', marginTop: '4px', fontWeight: 'bold' }}>
                Giá trị mốc: {val}
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: 'Voucher Tặng Kèm',
      dataIndex: 'voucherId',
      key: 'voucherId',
      render: (vid) => (
        <span style={{ color: '#d4af37', fontWeight: 'bold' }}>
          {getVoucherLabel(vid)}
        </span>
      )
    },
    {
      title: 'Thời Hạn Chạy',
      key: 'duration',
      render: (_, record) => {
        const start = record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY') : 'Vô hạn';
        const end = record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : 'Vô hạn';
        return (
          <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
            {start} → {end}
          </span>
        );
      }
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id)}
          checkedChildren="Đang chạy"
          unCheckedChildren="Tạm ngưng"
        />
      )
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            size="small"
            style={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }}
            icon={<Edit size={14} />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa chiến dịch này đồng nghĩa dừng hoàn toàn quy tắc tặng voucher tự động này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              size="small"
              danger
              icon={<Trash2 size={14} />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="campaign-page animate-fade-in" style={{ padding: '8px' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
            Chiến Dịch <span style={{ color: '#d4af37' }}>Phát Voucher</span>
          </Title>
          <p style={{ color: '#666', marginTop: 4, fontWeight: 500 }}>
            Tự động hóa việc gửi tặng voucher cho khách hàng theo sự kiện hoặc hành vi
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button 
            style={{ background: '#222', borderColor: '#444', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: 6, height: 44, borderRadius: 12 }}
            onClick={fetchData}
          >
            <RefreshCw size={16} /> Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusCircle size={18} />} 
            onClick={handleAdd}
            style={{ 
              backgroundColor: '#d4af37', 
              color: '#000', 
              fontWeight: 'bold', 
              borderColor: '#d4af37',
              height: 44,
              padding: '0 24px',
              borderRadius: 12,
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
            }}
          >
            THÊM CHIẾN DỊCH
          </Button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#111', 
        borderRadius: 24, 
        border: '1px solid #222',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <Table 
          columns={columns}
          dataSource={campaigns.map(c => ({ ...c, key: c.id }))}
          loading={loading}
          locale={{ emptyText: 'Chưa có chiến dịch khuyến mãi nào.' }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Campaign Form Modal */}
      <Modal
        open={modalVisible}
        title={<span style={{ color: '#d4af37', fontWeight: 900, fontSize: '18px' }}>{editingCampaign ? 'CẬP NHẬT CHIẾN DỊCH' : 'TẠO CHIẾN DỊCH MỚI'}</span>}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        centered
        wrapClassName="dark-luxury-modal-wrap"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCampaign}
          initialValues={{
            isActive: true
          }}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label={<span style={{ color: '#a0a0a0' }}>Tên Chiến Dịch</span>}
            rules={[{ required: true, message: 'Nhập tên chiến dịch!' }]}
          >
            <Input placeholder="Ví dụ: Tri ân khách hàng sinh nhật tháng" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="triggerType"
                label={<span style={{ color: '#a0a0a0' }}>Hành Vi Kích Hoạt (Trigger)</span>}
                rules={[{ required: true, message: 'Vui lòng chọn loại trigger!' }]}
              >
                <Select onChange={(val) => setSelectedTrigger(val)} placeholder="Chọn quy tắc">
                  {Object.entries(TRIGGER_TYPES).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              {(selectedTrigger === 'BOOKING_COUNT_X' || 
                selectedTrigger === 'COMPLETED_HAIRCUTS_X' || 
                selectedTrigger === 'ORDER_VALUE_OVER_X') && (
                <Form.Item
                  name="triggerValue"
                  label={<span style={{ color: '#a0a0a0' }}>Giá Trị Mốc Đạt Được</span>}
                  rules={[{ required: true, message: 'Nhập giá trị mốc!' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder="Ví dụ: 5 (lần) hoặc 500000 (₫)" />
                </Form.Item>
              )}

              {selectedTrigger === 'MEMBERSHIP_TIER' && (
                <Form.Item
                  name="triggerValue"
                  label={<span style={{ color: '#a0a0a0' }}>Hạng Thành Viên VIP</span>}
                  rules={[{ required: true, message: 'Chọn hạng VIP!' }]}
                >
                  <Select placeholder="Chọn hạng">
                    <Option value="Người Của Công Chúng">Người Của Công Chúng</Option>
                    <Option value="Sát Thủ Lịch Lãm">Sát Thủ Lịch Lãm</Option>
                    <Option value="Biểu Tượng Thời Đại">Biểu Tượng Thời Đại</Option>
                    <Option value="Vũ Trụ Nhan Sắc">Vũ Trụ Nhan Sắc</Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="voucherId"
                label={<span style={{ color: '#a0a0a0' }}>Voucher Tặng Kèm</span>}
                rules={[{ required: true, message: 'Chọn voucher để tặng!' }]}
              >
                <Select placeholder="Chọn voucher">
                  {vouchers.map(v => (
                    <Option key={v.id} value={v.id}>
                      {v.name} ({v.code})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label={<span style={{ color: '#a0a0a0' }}>Thời Gian Chạy Chiến Dịch</span>}
              >
                <DatePicker.RangePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isActive" valuePropName="checked">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Switch />
              <span style={{ color: '#fff', fontWeight: 600 }}>Kích Hoạt Ngay</span>
            </div>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={() => setModalVisible(false)} style={{ background: '#222', borderColor: '#444', color: '#a0a0a0' }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000', fontWeight: 'bold' }}>
              Lưu Chiến Dịch
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherCampaigns;

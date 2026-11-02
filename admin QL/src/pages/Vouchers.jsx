import React, { useState, useEffect } from 'react';
import { 
  Table, Typography, Button, Modal, Form, Input, InputNumber, 
  Select, DatePicker, Switch, Space, Popconfirm, Tag, message, 
  Card, Row, Col, Alert, notification, Tabs
} from 'antd';
import { PlusCircle, Edit, Trash2, Gift, Search, RefreshCw, Ticket, CheckCircle2, ChevronDown, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { voucherApi, customerApi } from '../api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vModalVisible, setVModalVisible] = useState(false);
  const [gModalVisible, setGModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [selectedVoucherForGift, setSelectedVoucherForGift] = useState(null);
  const [expiredModalVisible, setExpiredModalVisible] = useState(false);
  const [expiredVoucherToEdit, setExpiredVoucherToEdit] = useState(null);
  const [form] = Form.useForm();
  const [giftForm] = Form.useForm();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewData, setPreviewData] = useState({ discountType: 'PERCENTAGE', applyTo: 'ALL', isActive: true, issueType: 'MANUAL' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filterApplyTo, setFilterApplyTo] = useState('ALL_FILTER');
  const [filterIssueType, setFilterIssueType] = useState('ALL_FILTER');
  const [activeTab, setActiveTab] = useState('all');

  const handleApplyToFilterChange = (value) => {
    setFilterApplyTo(value);
    if (value === 'ALL_FILTER') {
      setFilterIssueType('ALL_FILTER');
    }
  };

  const filteredDataSource = vouchers.filter(v => {
    const matchApply = filterApplyTo === 'ALL_FILTER' || v.applyTo === filterApplyTo;
    const matchIssue = filterIssueType === 'ALL_FILTER' || v.issueType === filterIssueType;
    
    const now = dayjs();
    const isExpired = v.endDate && dayjs(v.endDate).isBefore(now);
    const isPublished = v.issueType && v.issueType !== 'MANUAL';
    
    let matchTab = true;
    if (activeTab === 'published') {
      matchTab = isPublished && !isExpired;
    } else if (activeTab === 'expired') {
      matchTab = isExpired;
    }
    
    return matchApply && matchIssue && matchTab;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.code) {
      const uppercaseCode = changedValues.code
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]/g, '');
      form.setFieldsValue({ code: uppercaseCode });
      allValues.code = uppercaseCode;
    }
    setPreviewData(allValues);
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await voucherApi.getAll();
      setVouchers(res.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách voucher');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await customerApi.getAll({ page: 1, limit: 1000 });
      if (res.data && Array.isArray(res.data.data)) {
        setCustomers(res.data.data);
      } else {
        setCustomers(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách khách hàng:', error);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchCustomers();
  }, []);

  const handleAdd = () => {
    setEditingVoucher(null);
    form.resetFields();
    const initialValues = {
      discountType: 'PERCENTAGE',
      applyTo: 'ALL',
      maxUses: 0,
      userLimit: 1,
      isActive: true,
      minOrderValue: 0,
      maxDiscountAmount: 0,
      issueType: 'MANUAL'
    };
    form.setFieldsValue(initialValues);
    setPreviewData(initialValues);
    setShowAdvanced(false);
    vModalVisible || setVModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingVoucher(record);
    const formValues = {
      name: record.name,
      code: record.code,
      discountType: record.voucherType,
      discountValue: record.value,
      maxDiscountAmount: record.maxDiscount,
      minOrderValue: record.minOrderValue,
      applyTo: record.applyTo,
      maxUses: record.totalQuantity,
      isActive: record.status === 'ACTIVE',
      expiryDateRange: [
        record.startDate ? dayjs(record.startDate) : null,
        record.endDate ? dayjs(record.endDate) : null,
      ],
      issueType: record.issueType || 'MANUAL',
      membershipLevel: record.membershipLevel,
      campaignDateRange: [
        record.campaignStartDate ? dayjs(record.campaignStartDate) : null,
        record.campaignEndDate ? dayjs(record.campaignEndDate) : null,
      ],
      notificationTitle: record.notificationTitle,
      notificationMessage: record.notificationMessage,
      userLimit: record.userLimit || 1
    };
    form.setFieldsValue(formValues);
    setPreviewData(formValues);
    setShowAdvanced(false);
    vModalVisible || setVModalVisible(true);
  };

  const handleDelete = async (id) => {
    const voucherToDelete = vouchers.find(v => v.id === id);
    try {
      await voucherApi.delete(id);
      notification.open({
        message: 'ĐÃ XÓA VOUCHER',
        description: `Voucher "${voucherToDelete?.name || ''}" (${voucherToDelete?.code || ''}) đã được xóa thành công.`,
        icon: <Trash2 color="#ff4d4f" size={24} />,
        style: {
          backgroundColor: '#fff1f0',
          border: '1px solid #ffa39e',
        },
      });
      fetchVouchers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa voucher');
    }
  };

  const handleToggleStatus = async (id) => {
    const voucher = vouchers.find(v => v.id === id);
    const newStatus = voucher?.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const statusText = newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Tạm ngưng';

    if (newStatus === 'ACTIVE' && voucher?.endDate) {
      if (dayjs(voucher.endDate).isBefore(dayjs())) {
        setExpiredVoucherToEdit(voucher);
        setExpiredModalVisible(true);
        return;
      }
    }

    try {
      await voucherApi.toggleStatus(id);
      notification.success({
        message: 'CẬP NHẬT TRẠNG THÁI',
        description: `Trạng thái voucher "${voucher?.name || ''}" (${voucher?.code || ''}) đã được chuyển thành: ${statusText}.`,
        icon: <CheckCircle color="#52c41a" size={24} />,
        style: {
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
        },
      });
      fetchVouchers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleSaveVoucher = async (values) => {
    try {
      const [startDate, endDate] = values.expiryDateRange || [null, null];
      const payload = {
        name: values.name,
        code: values.code,
        voucherType: values.discountType || 'PERCENTAGE',
        value: (values.discountValue !== undefined && values.discountValue !== null) ? values.discountValue : 0,
        maxDiscount: values.maxDiscountAmount || 0,
        minOrderValue: values.minOrderValue || 0,
        applyTo: values.applyTo || 'ALL',
        startDate: startDate ? startDate.format('YYYY-MM-DDTHH:mm:ss') : null,
        endDate: endDate ? endDate.format('YYYY-MM-DDTHH:mm:ss') : null,
        totalQuantity: values.maxUses || 0,
        status: (values.isActive === undefined || values.isActive === null || values.isActive) ? 'ACTIVE' : 'PAUSED',
        issueType: editingVoucher ? editingVoucher.issueType : 'MANUAL',
        membershipLevel: editingVoucher ? editingVoucher.membershipLevel : null,
        birthMonth: editingVoucher ? editingVoucher.birthMonth : null,
        campaignStartDate: editingVoucher ? editingVoucher.campaignStartDate : null,
        campaignEndDate: editingVoucher ? editingVoucher.campaignEndDate : null,
        notificationTitle: values.notificationTitle || null,
        notificationMessage: values.notificationMessage || null,
        userLimit: values.userLimit || 1
      };

      if (editingVoucher) {
        await voucherApi.update(editingVoucher.id, payload);
        notification.success({
          message: 'CẬP NHẬT THÀNH CÔNG',
          description: `Thông tin voucher "${payload.name}" (${payload.code}) đã được cập nhật thành công.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      } else {
        await voucherApi.create(payload);
        notification.success({
          message: 'TẠO VOUCHER THÀNH CÔNG',
          description: `Voucher mới "${payload.name}" (${payload.code}) đã được thêm vào hệ thống.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      }
      setVModalVisible(false);
      fetchVouchers();
    } catch (error) {
      notification.error({
        message: 'LỖI TẠO VOUCHER',
        description: error.response?.data?.message || 'Đã có lỗi xảy ra khi lưu voucher.',
        style: {
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          color: '#000',
        },
      });
    }
  };

  const handleOpenGiftModal = (record) => {
    if (record.endDate && dayjs(record.endDate).isBefore(dayjs())) {
      message.error('Voucher đã hết thời hạn sử dụng. Vui lòng sửa lại thời gian kết thúc trước khi phát hành!');
      return;
    }
    setSelectedVoucherForGift(record);
    setGModalVisible(true);
    
    // Đảm bảo modal và form đã render xong trước khi set giá trị,
    // đặc biệt cho các trường bị ẩn bởi điều kiện (shouldUpdate)
    setTimeout(() => {
      giftForm.resetFields();
      giftForm.setFieldsValue({
        issueType: record.issueType || 'MANUAL',
        membershipLevel: record.membershipLevel,
        birthMonth: record.birthMonth,
        quantity: 1,
        note: ''
      });
    }, 100);
  };

  const handleGiftVoucherSubmit = async (values) => {
    try {
      const issueStartDate = selectedVoucherForGift.startDate;
      const issueEndDate = selectedVoucherForGift.endDate;
      
      const updatePayload = {
        name: selectedVoucherForGift.name,
        code: selectedVoucherForGift.code,
        voucherType: selectedVoucherForGift.voucherType,
        value: selectedVoucherForGift.value,
        maxDiscount: selectedVoucherForGift.maxDiscount || 0,
        minOrderValue: selectedVoucherForGift.minOrderValue || 0,
        applyTo: selectedVoucherForGift.applyTo,
        startDate: issueStartDate,
        endDate: issueEndDate,
        totalQuantity: selectedVoucherForGift.totalQuantity || 0,
        status: selectedVoucherForGift.status,
        userLimit: selectedVoucherForGift.userLimit || 1,
        notificationTitle: selectedVoucherForGift.notificationTitle || null,
        notificationMessage: selectedVoucherForGift.notificationMessage || null,
        
        issueType: values.issueType,
        membershipLevel: values.issueType === 'MEMBERSHIP' ? values.membershipLevel : null,
        birthMonth: values.issueType === 'BIRTHDAY' ? values.birthMonth : null,
        campaignStartDate: null,
        campaignEndDate: null
      };
      
      await voucherApi.update(selectedVoucherForGift.id, updatePayload);

      if (values.issueType === 'MANUAL') {
        const payload = {
          userId: values.userId,
          quantity: values.quantity,
          note: values.note,
          voucherId: selectedVoucherForGift.id,
          startDate: issueStartDate,
          endDate: issueEndDate
        };
        await voucherApi.giftManually(payload);
        
        const targetCustomer = customers.find(c => c.id === values.userId);
        const customerName = targetCustomer ? (targetCustomer.name || targetCustomer.fullName || targetCustomer.phone) : `ID: ${values.userId}`;
        
        notification.success({
          message: 'TẶNG VOUCHER THÀNH CÔNG',
          description: `Voucher "${selectedVoucherForGift?.name}" đã được tặng thành công cho khách hàng "${customerName}".`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      } else if (values.issueType === 'BIRTHDAY') {
        const payload = {
          voucherId: selectedVoucherForGift.id,
          month: values.birthMonth
        };
        const response = await voucherApi.giftBirthday(payload);
        const count = response.data?.data?.length || 0;
        
        notification.success({
          message: 'PHÁT HÀNH VOUCHER SINH NHẬT THÀNH CÔNG',
          description: `Đã phát hành voucher sinh nhật cho ${count} khách hàng sinh vào tháng ${values.birthMonth}.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      } else {
        notification.success({
          message: 'CẤU HÌNH PHÁT HÀNH THÀNH CÔNG',
          description: `Voucher "${selectedVoucherForGift?.name}" đã được chuyển cấu hình phát hành thành công sang chế độ tự động.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      }
      
      setGModalVisible(false);
      fetchVouchers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi xử lý phát hành voucher');
    }
  };

  const columns = [
    {
      title: 'Thông Tin Voucher',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {record.name}
            <Tag color="#d4af37" style={{ margin: 0, fontWeight: 'bold' }}>{record.code}</Tag>
          </div>
          <div style={{ color: '#a0a0a0', fontSize: '13px', marginTop: '4px' }}>
            Áp dụng cho: <strong>{record.applyTo === 'ALL' ? 'Tất cả' : record.applyTo === 'SERVICE' ? 'Dịch vụ' : 'Sản phẩm'}</strong>
          </div>
        </div>
      ),
    },
    {
      title: 'Sự Kiện',
      key: 'issueType',
      render: (_, record) => {
        const typeMap = {
          'MANUAL': '🎁 Tặng Riêng',
          'NEW_CUSTOMER': '🆕 Khách Hàng Mới',
          'BIRTHDAY': '🎂 Sinh Nhật',
          'MEMBERSHIP': '⭐ Hội Viên',
          'ALL_CUSTOMERS': '🌎 Toàn Bộ Khách Hàng',
          'CLAIMABLE': '🔖 Nhận Thủ Công'
        };
        const levelMap = {
          'NGOI_SAO_MOI': 'Ngôi Sao Mới',
          'NGUOI_CUA_CONG_CHUNG': 'Người Của Công Chúng',
          'SAT_THU_LICH_LAM': 'Sát Thủ Lịch Lãm',
          'BIEU_TUONG_THOI_DAI': 'Biểu Tượng Thời Đại',
          'VU_TRU_NHAN_SAC': 'Vũ Trụ Nhan Sắc'
        };
        let text = typeMap[record.issueType || 'MANUAL'] || '🎁 Tặng Riêng';
        if (record.issueType === 'MEMBERSHIP' && record.membershipLevel) {
          text += ` (${levelMap[record.membershipLevel] || record.membershipLevel})`;
        } else if (record.issueType === 'BIRTHDAY' && record.birthMonth) {
          text += ` (Tháng ${record.birthMonth})`;
        }
        return <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{text}</span>;
      }
    },
    {
      title: 'Mức Giảm Giá',
      key: 'discount',
      render: (_, record) => {
        const isPercent = record.voucherType === 'PERCENTAGE';
        return (
          <div>
            <span style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '15px' }}>
              {record.voucherType === 'FREE_SERVICE'
                ? 'Miễn phí dịch vụ'
                : isPercent
                  ? `${record.value || 0}%`
                  : `${Number(record.value || 0).toLocaleString('vi-VN')} ₫`
              }
            </span>
            {isPercent && record.maxDiscount > 0 && (
              <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                Tối đa: {Number(record.maxDiscount).toLocaleString('vi-VN')} ₫
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Điều Kiện Tối Thiểu',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      render: (val) => (
        <span style={{ color: '#fff' }}>
          {val > 0 ? `${Number(val).toLocaleString('vi-VN')} ₫` : 'Không có'}
        </span>
      ),
    },
    {
      title: 'THỐNG KÊ (ĐÃ NHẬN / TỔNG)',
      key: 'usage',
      render: (_, record) => {
        const used = record.usedQuantity || 0;
        const limit = record.totalQuantity || 0;
        return (
          <span style={{ color: '#fff', fontWeight: 'bold' }}>
            {limit > 0 ? `${used} / ${limit} (Còn ${limit - used})` : `${used} voucher`}
          </span>
        );
      }
    },
    {
      title: 'Thời Gian Hiệu Lực',
      key: 'date',
      render: (_, record) => {
        const start = record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY HH:mm') : '—';
        const end = record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY HH:mm') : '—';
        return (
          <div style={{ fontSize: '12px', color: '#a0a0a0' }}>
            <div>Bắt đầu: {start}</div>
            <div>Kết thúc: {end}</div>
          </div>
        );
      },
    },
    {
      title: 'TRẠNG THÁI PHÁT HÀNH',
      key: 'status',
      render: (_, record) => {
        const isActive = record.status === 'ACTIVE';
        return (
          <Space direction="vertical" size="small" style={{ alignItems: 'flex-start' }}>
            <span style={{ 
              fontWeight: 'bold', 
              color: isActive ? '#52c41a' : '#8c8c8c',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}>
              {isActive ? '🟢 Đang Phát Hành' : '⚪ Chưa Phát Hành'}
            </span>
            <Switch 
              checked={isActive} 
              onChange={() => handleToggleStatus(record.id)}
              checkedChildren="Bật"
              unCheckedChildren="Tắt"
            />
          </Space>
        );
      },
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button 
              size="small"
              style={{ backgroundColor: 'rgba(212,175,55,0.15)', borderColor: '#d4af37', color: '#d4af37' }}
              icon={<Gift size={14} />}
              onClick={() => handleOpenGiftModal(record)}
              disabled={record.status !== 'ACTIVE'}
            >
              Tặng
            </Button>
          <Button 
            size="small"
            style={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }}
            icon={<Edit size={14} />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa voucher này không?"
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
        );
      },
    },
  ];

  return (
    <div className="vouchers-page animate-fade-in" style={{ padding: '8px' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
            Hệ Thống <span style={{ color: '#d4af37' }}>Voucher</span>
          </Title>
          <p style={{ color: '#666', marginTop: 4, fontWeight: 500 }}>Thiết lập và quản lý các mã giảm giá cho Hornet Royale</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button 
            style={{ background: '#222', borderColor: '#444', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: 6, height: 44, borderRadius: 12 }}
            onClick={fetchVouchers}
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
            TẠO VOUCHER MỚI
          </Button>
        </div>
      </div>

      {/* Bộ Lọc Nâng Cao */}
      <div style={{ 
        background: '#111', 
        border: '1px solid #222', 
        borderRadius: '16px', 
        padding: '16px 24px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
          <div style={{ minWidth: '200px', flex: '1 1 0%' }}>
            <div style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '0.5px' }}>
              PHẠM VI ÁP DỤNG
            </div>
            <Select 
              value={filterApplyTo} 
              onChange={handleApplyToFilterChange} 
              style={{ width: '100%' }}
              dropdownStyle={{ background: '#111' }}
            >
              <Option value="ALL_FILTER">Tất Cả</Option>
              <Option value="SERVICE">Dịch Vụ</Option>
              <Option value="PRODUCT">Sản Phẩm</Option>
              <Option value="ALL">Dịch Vụ + Sản Phẩm</Option>
            </Select>
          </div>
          
          {filterApplyTo !== 'ALL_FILTER' && (
            <div style={{ minWidth: '200px', flex: '1 1 0%' }}>
              <div style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '0.5px' }}>
                HÌNH THỨC PHÁT HÀNH
              </div>
              <Select 
                value={filterIssueType} 
                onChange={setFilterIssueType} 
                style={{ width: '100%' }}
                dropdownStyle={{ background: '#111' }}
              >
                <Option value="ALL_FILTER">Tất Cả</Option>
                <Option value="NEW_CUSTOMER">Khách Hàng Mới</Option>
                <Option value="BIRTHDAY">Sinh Nhật</Option>
                <Option value="MEMBERSHIP">Hội Viên</Option>
                <Option value="MANUAL">Tặng Riêng</Option>
                <Option value="ALL_CUSTOMERS">Toàn Bộ Khách Hàng</Option>
                <Option value="CLAIMABLE">Nhận Thủ Công (Bài viết)</Option>
              </Select>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '20px' }}>
            <Button 
              onClick={() => {
                setFilterApplyTo('ALL_FILTER');
                setFilterIssueType('ALL_FILTER');
              }}
              style={{ 
                background: '#222', 
                borderColor: '#444', 
                color: '#aaa',
                borderRadius: '8px',
                height: '38px',
                fontWeight: 'bold'
              }}
            >
              Reset Bộ Lọc
            </Button>
          </div>
        </div>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
        items={[
          { key: 'all', label: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Tất Cả ({vouchers.length})</span> },
          { key: 'published', label: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Đã Phát Hành ({vouchers.filter(v => v.issueType && v.issueType !== 'MANUAL' && (!v.endDate || !dayjs(v.endDate).isBefore(dayjs()))).length})</span> },
          { key: 'expired', label: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Đã Hết Hạn ({vouchers.filter(v => v.endDate && dayjs(v.endDate).isBefore(dayjs())).length})</span> }
        ]}
      />

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredDataSource.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#666', background: '#111', borderRadius: 16, border: '1px solid #222' }}>
              Chưa có voucher nào được tìm thấy.
            </div>
          ) : (
            filteredDataSource.map(v => {
              // Determine issue type label
              let issueTypeLabel = 'Thủ Công';
              if (v.issueType === 'NEW_CUSTOMER') issueTypeLabel = 'Khách Hàng Mới';
              else if (v.issueType === 'BIRTHDAY') issueTypeLabel = `Sinh Nhật${v.birthMonth ? ` (Tháng ${v.birthMonth})` : ''}`;
              else if (v.issueType === 'MEMBERSHIP') {
                const levels = { 'NGOI_SAO_MOI': 'Ngôi Sao Mới', 'NGUOI_CUA_CONG_CHUNG': 'Người Của Công Chúng', 'SAT_THU_LICH_LAM': 'Sát Thủ Lịch Lãm', 'BIEU_TUONG_THOI_DAI': 'Biểu Tượng Thời Đại', 'VU_TRU_NHAN_SAC': 'Vũ Trụ Nhan Sắc' };
                issueTypeLabel = `Hội Viên (${levels[v.membershipLevel] || v.membershipLevel})`;
              }
              else if (v.issueType === 'ALL_CUSTOMERS') issueTypeLabel = 'Toàn Bộ Khách Hàng';
              else if (v.issueType === 'CLAIMABLE') issueTypeLabel = 'Nhận Thủ Công (Bài viết)';

              // Determine status and style
              let statusText = 'Đang chạy';
              let statusColor = '#52c41a';
              if (v.status !== 'ACTIVE') {
                statusText = 'Chưa kích hoạt';
                statusColor = '#ff4d4f';
              } else {
                const now = dayjs();
                if (v.startDate && now.isBefore(dayjs(v.startDate))) {
                  statusText = 'Chưa bắt đầu';
                  statusColor = '#1890ff';
                } else if (v.endDate && now.isAfter(dayjs(v.endDate))) {
                  statusText = 'Đã kết thúc';
                  statusColor = '#ff4d4f';
                }
              }

              // Determine discount label
              const discountLabel = v.voucherType === 'PERCENTAGE' 
                ? `${v.value}% (Tối đa ${v.maxDiscount?.toLocaleString('vi-VN')}đ)`
                : `${v.value?.toLocaleString('vi-VN')}đ`;

              return (
                <div 
                  key={v.id}
                  style={{
                    background: 'rgba(20, 20, 20, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #222',
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Status Indicator */}
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 'bold', 
                      color: statusColor, 
                      background: `${statusColor}15`, 
                      padding: '4px 8px', 
                      borderRadius: 6,
                      border: `1px solid ${statusColor}30`
                    }}>
                      {statusText}
                    </span>
                  </div>

                  {/* Header */}
                  <div style={{ marginBottom: 12, paddingRight: 90 }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
                      {v.name}
                    </div>
                    <span style={{ 
                      display: 'inline-block',
                      color: '#000', 
                      background: 'linear-gradient(135deg, #d4af37 0%, #aa841c 100%)', 
                      padding: '2px 8px', 
                      borderRadius: 4, 
                      fontWeight: 'bold', 
                      fontSize: '12px', 
                      letterSpacing: '1px',
                      boxShadow: '0 2px 8px rgba(212,175,55,0.2)'
                    }}>
                      {v.code}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px 8px', 
                    borderTop: '1px solid #222', 
                    borderBottom: '1px solid #222',
                    padding: '12px 0',
                    marginBottom: 16,
                    fontSize: '13px'
                  }}>
                    <div>
                      <div style={{ color: '#666', fontSize: '11px', marginBottom: 2 }}>GIẢM GIÁ</div>
                      <div style={{ color: '#fff', fontWeight: 'bold' }}>{discountLabel}</div>
                    </div>
                    <div>
                      <div style={{ color: '#666', fontSize: '11px', marginBottom: 2 }}>HÌNH THỨC PHÁT HÀNH</div>
                      <div style={{ color: '#d4af37', fontWeight: 'bold' }}>{issueTypeLabel}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ color: '#666', fontSize: '11px', marginBottom: 2 }}>THỜI GIAN HIỆU LỰC</div>
                      <div style={{ color: '#aaa' }}>
                        {v.startDate ? dayjs(v.startDate).format('DD/MM/YYYY HH:mm') : '—'} 
                        {' đến '} 
                        {v.endDate ? dayjs(v.endDate).format('DD/MM/YYYY HH:mm') : '—'}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#666', fontSize: '11px', marginBottom: 2 }}>ĐÃ DÙNG</div>
                      <div style={{ color: '#fff' }}>{v.usedQuantity || 0}/{v.totalQuantity || 'Vô hạn'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#666', fontSize: '11px', marginBottom: 2 }}>ĐIỀU KIỆN</div>
                      <div style={{ color: '#fff' }}>Tối thiểu {v.minOrderValue?.toLocaleString('vi-VN')}đ</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button 
                      type="primary" 
                      ghost
                      style={{ 
                        flex: 1, 
                        height: 44, 
                        borderColor: '#d4af37', 
                        color: '#d4af37',
                        fontWeight: 'bold',
                        borderRadius: 8
                      }}
                      icon={<Edit size={16} />}
                      onClick={() => handleEdit(v)}
                    >
                      Sửa
                    </Button>
                    
                    <Button 
                      type="primary"
                      disabled={v.status !== 'ACTIVE'}
                      style={{ 
                        flex: 1.5, 
                        height: 44, 
                        backgroundColor: v.status === 'ACTIVE' ? '#d4af37' : '#222', 
                        borderColor: v.status === 'ACTIVE' ? '#d4af37' : '#444',
                        color: v.status === 'ACTIVE' ? '#000' : '#666',
                        fontWeight: 'bold',
                        borderRadius: 8
                      }}
                      icon={<Gift size={16} />}
                      onClick={() => handleOpenGiftModal(v)}
                    >
                      Phát Hành
                    </Button>

                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa voucher này?"
                      onConfirm={() => handleDelete(v.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button 
                        danger
                        style={{ 
                          height: 44, 
                          width: 44,
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 8
                        }}
                        icon={<Trash2 size={18} />}
                      />
                    </Popconfirm>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div style={{ 
          backgroundColor: '#111', 
          borderRadius: 24, 
          border: '1px solid #222',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <Table 
            columns={columns}
            dataSource={filteredDataSource.map(v => ({ ...v, key: v.id }))}
            loading={loading}
            locale={{ emptyText: 'Chưa có voucher nào được tìm thấy.' }}
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}

      <Modal
        open={vModalVisible}
        title={null}
        closable={false}
        onCancel={() => setVModalVisible(false)}
        footer={null}
        centered
        width={isMobile ? '95%' : 960}
        wrapClassName="dark-luxury-modal-wrap"
        styles={{
          body: { padding: 0, overflow: 'hidden', borderRadius: '16px', background: '#0a0a0a' }
        }}
      >
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', minHeight: isMobile ? 'auto' : '600px' }}>
          {/* CỘT TRÁI: FORM */}
          <div style={{ 
            flex: '1', 
            padding: isMobile ? '16px' : '24px', 
            overflowY: 'auto', 
            maxHeight: isMobile ? '50vh' : '80vh',
            display: 'flex',
            flexDirection: 'column'
          }} className="custom-scrollbar">
            <h2 style={{ color: '#d4af37', fontWeight: 900, fontSize: '20px', marginBottom: '24px', borderBottom: '1px solid #222', paddingBottom: '16px' }}>
              {editingVoucher ? 'CẬP NHẬT VOUCHER' : 'TẠO VOUCHER MỚI'}
            </h2>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveVoucher}
              onValuesChange={handleValuesChange}
              preserve={true}
            >
              {/* PHẦN 1: THÔNG TIN CHÍNH */}
              <div style={{ marginBottom: '24px' }}>
                <Form.Item
                  name="name"
                  label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Tên Voucher <span style={{color: 'red'}}>*</span></span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]}
                >
                  <Input placeholder="Ví dụ: Giảm 50K Khách Thân Thiết" style={{ background: '#111', borderColor: '#333', color: '#fff' }} />
                </Form.Item>

                <Form.Item
                  name="code"
                  label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Mã Voucher <span style={{color: 'red'}}>*</span></span>}
                  rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
                >
                  <Input placeholder="Ví dụ: VIP50" style={{ background: '#111', borderColor: '#333', color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase' }} />
                </Form.Item>

                <Form.Item
                  name="expiryDateRange"
                  label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Thời Gian Hiệu Lực <span style={{color: 'red'}}>*</span></span>}
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian hiệu lực!' }]}
                >
                  <DatePicker.RangePicker 
                    showTime={{ format: 'HH:mm' }}
                    format="DD/MM/YYYY HH:mm"
                    style={{ width: '100%', background: '#111', borderColor: '#333' }} 
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                  />
                </Form.Item>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>
                    PHẠM VI ÁP DỤNG <span style={{color: 'red'}}>*</span>
                  </label>
                  <Row gutter={[12, 12]}>
                    {[
                      { value: 'SERVICE', title: 'DỊCH VỤ', desc: 'Đặt lịch cắt tóc, chăm sóc, nhuộm, uốn...' },
                      { value: 'PRODUCT', title: 'SẢN PHẨM', desc: 'Mua hàng trong cửa hàng' },
                      { value: 'ALL', title: 'TẤT CẢ', desc: 'Dịch vụ + sản phẩm' }
                    ].map((item) => {
                      const isSelected = previewData.applyTo === item.value;
                      return (
                        <Col span={isMobile ? 24 : 8} key={item.value}>
                          <div 
                            onClick={() => {
                              form.setFieldsValue({ applyTo: item.value });
                              setPreviewData({...previewData, applyTo: item.value});
                            }}
                            style={{
                              border: isSelected ? '2px solid #d4af37' : '1px solid #333',
                              background: isSelected ? 'rgba(212, 175, 55, 0.1)' : '#111',
                              padding: '12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              position: 'relative',
                              height: '100%',
                              transition: 'all 0.2s'
                            }}
                          >
                            {isSelected && (
                              <CheckCircle2 size={16} color="#d4af37" style={{ position: 'absolute', top: '8px', right: '8px' }} />
                            )}
                            <div style={{ color: isSelected ? '#d4af37' : '#fff', fontWeight: 'bold', marginBottom: '4px' }}>[{item.title}]</div>
                            <div style={{ color: '#888', fontSize: '11px', lineHeight: '1.4' }}>Áp dụng cho:<br/>{item.desc}</div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                  
                  {previewData.applyTo === 'ALL' && (
                    <div style={{ marginTop: '30px', marginBottom: '35px', padding: '12px 16px', background: 'rgba(255, 77, 79, 0.1)', borderLeft: '4px solid #ff4d4f', borderRadius: '4px' }}>
                      <span style={{ color: '#ff4d4f', fontSize: '12px', fontWeight: 'bold', lineHeight: '1.5', display: 'block' }}>
                        CẢNH BÁO: Voucher này sẽ áp dụng cho cả dịch vụ và sản phẩm. Hãy kiểm tra kỹ để tránh phát sinh ưu đãi ngoài mong muốn.
                      </span>
                    </div>
                  )}
                  <Form.Item name="applyTo" hidden><Input /></Form.Item>
                </div>

                {/* Removed issueType fields from here to place in Gifting Modal */}

                <Row gutter={[16, 16]}>
                  <Col span={isMobile ? 24 : 12}>
                    <Form.Item
                      name="discountType"
                      label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Loại Giảm Giá <span style={{color: 'red'}}>*</span></span>}
                    >
                      <Select style={{ width: '100%' }}>
                        <Option value="FIXED">Giảm tiền mặt</Option>
                        <Option value="PERCENTAGE">Giảm %</Option>
                        <Option value="FREE_SERVICE">Tặng dịch vụ miễn phí</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={isMobile ? 24 : 12}>
                    <Form.Item
                      name="discountValue"
                      label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Giá Trị Giảm <span style={{color: 'red'}}>*</span></span>}
                      rules={[{ required: true, message: 'Nhập giá trị giảm!' }]}
                    >
                      <InputNumber 
                        style={{ width: '100%', background: '#111', borderColor: '#333', color: '#fff' }} 
                        min={1} 
                        placeholder={previewData.discountType === 'PERCENTAGE' ? "Ví dụ: 10" : "Ví dụ: 50000"} 
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {previewData.discountType === 'PERCENTAGE' && (
                  <Form.Item
                    name="maxDiscountAmount"
                    label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Giảm Tối Đa (tùy chọn)</span>}
                  >
                    <InputNumber style={{ width: '100%', background: '#111', borderColor: '#333', color: '#fff' }} min={0} placeholder="Bỏ trống hoặc nhập 0 nếu không giới hạn" />
                  </Form.Item>
                )}

              </div>

              {/* PHẦN 3: NỘI DUNG THÔNG BÁO TÙY CHỈNH */}
              <div style={{ marginBottom: '32px' }}>
                <Title level={5} style={{ color: '#d4af37', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase' }}>
                  Nội Dung Thông Báo (Tùy Chọn)
                </Title>
                <Alert 
                  message="Mặc định hệ thống sẽ tự động tạo thông báo dựa trên thông tin voucher. Nếu bạn điền vào đây, hệ thống sẽ sử dụng nội dung bạn cung cấp để gửi cho khách."
                  type="info"
                  showIcon
                  style={{ background: '#111', borderColor: '#222', color: '#a0a0a0', marginBottom: 16 }}
                />
                <Form.Item name="notificationTitle" label={<span style={{ color: '#a0a0a0' }}>Tiêu đề thông báo</span>}>
                  <Input placeholder="Ví dụ: 🎁 Quà Tặng 8/3 Dành Cho Bạn!" style={{ background: '#111', borderColor: '#333', color: '#fff' }} />
                </Form.Item>
                <Form.Item name="notificationMessage" label={<span style={{ color: '#a0a0a0' }}>Nội dung thông báo</span>}>
                  <Input.TextArea 
                    placeholder="Viết nội dung thông báo muốn gửi đến khách hàng..." 
                    rows={4} 
                    style={{ background: '#111', borderColor: '#333', color: '#fff' }} 
                  />
                </Form.Item>
              </div>

              {/* PHẦN 4: CÀI ĐẶT NÂNG CAO */}
              <div style={{ marginBottom: '32px' }}>
                <div 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                    padding: '12px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333'
                  }}
                >
                  {showAdvanced ? <ChevronDown size={18} color="#d4af37" /> : <ChevronRight size={18} color="#d4af37" />}
                  <span style={{ color: '#d4af37', fontWeight: 'bold' }}>Cài đặt nâng cao</span>
                </div>
                {showAdvanced && (
                  <div style={{ padding: '16px', background: '#111', border: '1px solid #222', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                    <Row gutter={[16, 16]}>
                      <Col span={isMobile ? 24 : 12}>
                        <Form.Item name="minOrderValue" label={<span style={{ color: '#a0a0a0' }}>Đơn hàng tối thiểu (₫)</span>}>
                          <InputNumber style={{ width: '100%', background: '#0a0a0a', borderColor: '#222', color: '#fff' }} min={0} placeholder="Ví dụ: 100000" />
                        </Form.Item>
                      </Col>
                      <Col span={isMobile ? 24 : 12}>
                        <Form.Item name="maxUses" label={<span style={{ color: '#a0a0a0' }}>Số lượng voucher phát hành</span>}>
                          <InputNumber style={{ width: '100%', background: '#0a0a0a', borderColor: '#222', color: '#fff' }} min={0} placeholder="0 = Vô hạn" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span={isMobile ? 24 : 12}>
                        <Form.Item name="userLimit" label={<span style={{ color: '#a0a0a0' }}>Lượt dùng tối đa mỗi khách</span>}>
                          <InputNumber style={{ width: '100%', background: '#0a0a0a', borderColor: '#222', color: '#fff' }} min={1} placeholder="Ví dụ: 1" />
                        </Form.Item>
                      </Col>
                      <Col span={isMobile ? 24 : 12} style={{ display: 'flex', alignItems: 'center', paddingTop: isMobile ? 8 : 28 }}>
                        <Form.Item name="isActive" valuePropName="checked">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Switch />
                            <span style={{ color: '#fff' }}>Kích hoạt ngay</span>
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>

              {/* FOOTER NÚT (STICKY) */}
              <div style={{ 
                display: 'flex', 
                justify: 'flex-end', 
                gap: 12, 
                borderTop: '1px solid #222', 
                paddingTop: '20px',
                position: 'sticky',
                bottom: 0,
                background: '#0a0a0a',
                zIndex: 10,
                marginTop: 'auto'
              }}>
                <Button onClick={() => setVModalVisible(false)} style={{ background: '#222', borderColor: '#444', color: '#fff', height: '40px', padding: '0 24px' }}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000', fontWeight: 'bold', height: '40px', padding: '0 32px' }}>
                  Lưu Voucher
                </Button>
              </div>
            </Form>
          </div>

          {/* CỘT PHẢI: PREVIEW */}
          <div style={{ 
            width: isMobile ? '100%' : '320px', 
            background: '#111', 
            borderLeft: isMobile ? 'none' : '1px solid #222', 
            borderBottom: isMobile ? '1px solid #222' : 'none',
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ color: '#888', fontSize: '14px', marginBottom: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>XEM TRƯỚC</h3>
            
            <div style={{ 
              width: '100%', 
              maxWidth: '280px',
              background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)', 
              border: '1px solid #d4af37', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              position: 'relative',
              boxSizing: 'border-box'
            }}>
              <div style={{ position: 'absolute', left: '-6px', top: '0', bottom: '0', width: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                {[...Array(10)].map((_, i) => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#111' }} />)}
              </div>

              <div style={{ padding: '20px 16px 20px 24px' }}>
                <div style={{ color: '#d4af37', fontWeight: 900, fontSize: '22px', lineHeight: '1.2', marginBottom: '4px' }}>
                  {previewData.discountType === 'PERCENTAGE' 
                    ? `GIẢM ${previewData.discountValue || 0}%` 
                    : previewData.discountType === 'FREE_SERVICE'
                      ? 'DỊCH VỤ MIỄN PHÍ'
                      : `GIẢM ${Number(previewData.discountValue || 0).toLocaleString('vi-VN')}đ`
                  }
                </div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500', marginBottom: '16px', opacity: 0.9 }}>
                  {previewData.name || 'Tên Voucher'}
                </div>

                <div style={{ borderTop: '1px dashed rgba(212,175,55,0.3)', margin: '16px 0' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#888', fontSize: '12px' }}>Mã:</span>
                    <span style={{ color: '#000', background: '#d4af37', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' }}>
                      {previewData.code || 'CODE'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888', fontSize: '12px' }}>Áp dụng:</span>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>
                      {previewData.applyTo === 'ALL' ? 'TẤT CẢ' : previewData.applyTo === 'SERVICE' ? 'DỊCH VỤ' : 'SẢN PHẨM'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4px' }}>
                    <span style={{ color: '#888', fontSize: '12px' }}>Hiệu lực:</span>
                    <span style={{ color: '#fff', fontSize: '11px' }}>
                      {previewData.expiryDateRange && previewData.expiryDateRange[0] && previewData.expiryDateRange[1]
                        ? `${previewData.expiryDateRange[0].format('DD/MM/YYYY')} - ${previewData.expiryDateRange[1].format('DD/MM/YYYY')}`
                        : 'Chưa thiết lập'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '16px', textAlign: 'center', color: '#666', fontSize: '12px', padding: '0 16px' }}>
              Hiển thị xem trước để bạn dễ dàng hình dung voucher khi khách hàng nhìn thấy.
            </div>
          </div>
        </div>
      </Modal>

      {/* Manual Gift Modal */}
      <Modal
        open={gModalVisible}
        title={<span style={{ color: '#d4af37', fontWeight: 900, fontSize: '18px' }}>TẶNG / PHÁT HÀNH VOUCHER</span>}
        onCancel={() => setGModalVisible(false)}
        footer={null}
        width={550}
        wrapClassName="dark-luxury-modal-wrap"
      >
        <Alert 
          message={<span style={{ color: '#d4af37', fontWeight: 'bold' }}>Voucher phát hành: {selectedVoucherForGift?.name} ({selectedVoucherForGift?.code})</span>}
          type="info" 
          showIcon 
          style={{ marginBottom: 20, backgroundColor: 'rgba(212,175,55,0.08)', borderColor: '#d4af37' }} 
        />
        <Form
          form={giftForm}
          layout="vertical"
          onFinish={handleGiftVoucherSubmit}
          initialValues={{ issueType: 'MANUAL', quantity: 1 }}
        >
          <Form.Item
            name="issueType"
            label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Hình Thức Phát Hành <span style={{color: 'red'}}>*</span></span>}
            rules={[{ required: true, message: 'Vui lòng chọn hình thức phát hành!' }]}
          >
            <Select style={{ width: '100%' }}>
              <Option value="MANUAL">Thủ Công (Tặng khách cụ thể)</Option>
              <Option value="NEW_CUSTOMER">Khách Hàng Mới (Tự động cấp khi đăng ký)</Option>
              <Option value="BIRTHDAY">Sinh Nhật (Tự động cấp ngày sinh nhật)</Option>
              <Option value="MEMBERSHIP">Hội Viên (Tự động cấp theo hạng thành viên)</Option>
              <Option value="ALL_CUSTOMERS">Toàn Bộ Khách Hàng (Phát ngay cho mọi khách)</Option>
              <Option value="CLAIMABLE">Nhận Thủ Công (Khách tự lấy từ Bài viết)</Option>
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.issueType !== currentValues.issueType}>
            {({ getFieldValue }) => {
              const issueType = getFieldValue('issueType');
              
              if (issueType === 'MANUAL') {
                return (
                  <>
                    <Form.Item
                      name="userId"
                      label={<span style={{ color: '#a0a0a0' }}>Chọn Khách Hàng</span>}
                      rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
                    >
                      <Select 
                        showSearch 
                        placeholder="Tìm kiếm bằng tên hoặc email..."
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                          const name = option?.name || '';
                          const email = option?.email || '';
                          return (name + ' ' + email).toLowerCase().includes(input.toLowerCase());
                        }}
                      >
                        {customers.map(c => (
                          <Option key={c.id} value={c.id} name={c.name} email={c.email}>
                            {c.name} ({c.email || 'Không có email'})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="quantity"
                          label={<span style={{ color: '#a0a0a0' }}>Số Lượng Tặng</span>}
                          rules={[{ required: true, message: 'Nhập số lượng!' }]}
                        >
                          <InputNumber min={1} max={10} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="note"
                          label={<span style={{ color: '#a0a0a0' }}>Lý Do / Ghi Chú</span>}
                        >
                          <Input placeholder="Ví dụ: Tặng quà sinh nhật VIP" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                );
              }

              if (issueType === 'BIRTHDAY') {
                return (
                  <Form.Item
                    name="birthMonth"
                    label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Chọn Tháng Sinh Áp Dụng <span style={{color: 'red'}}>*</span></span>}
                    rules={[{ required: true, message: 'Vui lòng chọn tháng sinh!' }]}
                  >
                    <Select style={{ width: '100%' }} placeholder="Chọn tháng sinh...">
                      {[...Array(12)].map((_, i) => (
                        <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              }

              if (issueType === 'MEMBERSHIP') {
                return (
                  <Form.Item
                    name="membershipLevel"
                    label={<span style={{ color: '#fff', fontWeight: 'bold' }}>Cấp Hội Viên Áp Dụng <span style={{color: 'red'}}>*</span></span>}
                    rules={[{ required: true, message: 'Vui lòng chọn cấp hội viên!' }]}
                  >
                    <Select style={{ width: '100%' }}>
                      <Option value="NGOI_SAO_MOI">Ngôi Sao Mới</Option>
                      <Option value="NGUOI_CUA_CONG_CHUNG">Người Của Công Chúng</Option>
                      <Option value="SAT_THU_LICH_LAM">Sát Thủ Lịch Lãm</Option>
                      <Option value="BIEU_TUONG_THOI_DAI">Biểu Tượng Thời Đại</Option>
                      <Option value="VU_TRU_NHAN_SAC">Vũ Trụ Nhan Sắc</Option>
                    </Select>
                  </Form.Item>
                );
              }

              return null;
            }}
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={() => setGModalVisible(false)} style={{ background: '#222', borderColor: '#444', color: '#a0a0a0' }}>
              Hủy
            </Button>
            {(() => {
              const isAlreadyPublished = selectedVoucherForGift?.issueType && selectedVoucherForGift?.issueType !== 'MANUAL';
              const isAlreadyExpired = selectedVoucherForGift?.endDate && dayjs(selectedVoucherForGift?.endDate).isBefore(dayjs());
              const isPublishDisabled = isAlreadyPublished && !isAlreadyExpired;
              return (
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  disabled={isPublishDisabled}
                  style={{ 
                    backgroundColor: isPublishDisabled ? '#222' : '#d4af37', 
                    borderColor: isPublishDisabled ? '#444' : '#d4af37', 
                    color: isPublishDisabled ? '#666' : '#000', 
                    fontWeight: 'bold' 
                  }}
                >
                  Xác Nhận Phát Hành
                </Button>
              );
            })()}
          </div>
        </Form>
      </Modal>

      {/* Expired Voucher Warning Modal */}
      <Modal
        open={expiredModalVisible}
        onCancel={() => setExpiredModalVisible(false)}
        footer={null}
        closable={false}
        centered
        wrapClassName="dark-luxury-modal-wrap"
        styles={{ 
          mask: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          body: { padding: 0, backgroundColor: 'transparent' }
        }}
        width={420}
      >
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #fa8c16',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 0 40px rgba(250, 140, 22, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '120px', height: '12px', background: '#fa8c16', filter: 'blur(20px)', borderRadius: '50%'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(250, 140, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fa8c16' }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ margin: 0, color: '#fa8c16', fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Đã hết hiệu lực
            </h3>
          </div>

          <p style={{ color: '#e5e5e5', marginBottom: '28px', fontSize: '15px', lineHeight: '1.6' }}>
            Voucher <strong style={{ color: '#d4af37' }}>{expiredVoucherToEdit?.name}</strong> đã hết thời gian hiệu lực. 
            <br/><br/>
            Vui lòng sửa lại thời gian kết thúc trước khi tiếp tục phát hành hoặc kích hoạt lại voucher này.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button 
              onClick={() => setExpiredModalVisible(false)}
              style={{ background: '#222', borderColor: '#444', color: '#a0a0a0', borderRadius: '8px', height: '40px', padding: '0 20px' }}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={() => {
                setExpiredModalVisible(false);
                if (expiredVoucherToEdit) {
                  handleEdit(expiredVoucherToEdit);
                }
              }}
              style={{ background: '#fa8c16', borderColor: '#fa8c16', borderRadius: '8px', fontWeight: 'bold', color: '#fff', height: '40px', padding: '0 24px', boxShadow: '0 4px 12px rgba(250, 140, 22, 0.3)' }}
            >
              Chỉnh Sửa Ngay
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Vouchers;

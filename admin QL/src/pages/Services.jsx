import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Tag, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Upload, notification } from 'antd';
import { PlusCircle, Edit, Trash2, Clock, Image as ImageIcon, ArrowUpToLine, ArrowUp, ArrowDown, ArrowDownToLine, Camera, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { serviceApi } from '../api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const API_URL = 'http://localhost:8080/api/services';

const Services = () => {


  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modelTypes, setModelTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modelTypeFilter, setModelTypeFilter] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const selectedCategoryId = Form.useWatch('categoryId', form);

  const fetchCategoriesAndModels = async () => {
    try {
      const catRes = await axios.get(`${API_URL}/categories`);
      setCategories(catRes.data);
      const modRes = await axios.get(`${API_URL}/model-types`);
      setModelTypes(modRes.data);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
    }
  };


  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/all`);
      setServices(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách dịch vụ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services
    .filter(s => categoryFilter === 'all' || s.modelType?.category?.id === Number(categoryFilter))
    .filter(s => modelTypeFilter === 'all' || s.modelType?.id === Number(modelTypeFilter))
    .sort((a, b) => {
      if (modelTypeFilter !== 'all') {
        return (a.modelSortOrder || 0) - (b.modelSortOrder || 0);
      }
      if (categoryFilter === 'all') {
        // Use dedicated globalSortOrder — independent of per-category sortOrder
        return (a.globalSortOrder || 0) - (b.globalSortOrder || 0);
      }
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });

  const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE);
  const pagedServices = filteredServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeModels = Array.from(new Set(
    services
      .filter(s => categoryFilter === 'all' || s.modelType?.category?.id === Number(categoryFilter))
      .map(s => JSON.stringify(s.modelType))
  )).filter(m => m).map(m => JSON.parse(m)).filter(m => m !== null);

  useEffect(() => {
    fetchServices();
    fetchCategoriesAndModels();
  }, []);



  const handleAdd = () => {
    setEditingService(null);
    form.resetFields();
    setPreviewUrl(null);
    setImageFile(null);
    setModalVisible(true);
  };

  const handleEdit = async (record) => {
    setEditingService(record);
    form.setFieldsValue({
      ...record,
      categoryId: record.modelType?.category?.id,
      modelTypeName: record.modelType?.name ? [record.modelType.name] : [],
    });
    setPreviewUrl(normalizeImageUrl(record.image));
    setImageFile(null);
    setModalVisible(true);
  };

    const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      
      notification.open({
        message: 'ĐÃ XÓA DỊCH VỤ',
        description: 'Dịch vụ đã được xóa khỏi hệ thống thành công.',
        icon: <Trash2 color="#ff4d4f" size={24} />,
        style: {
          backgroundColor: '#fff1f0',
          border: '1px solid #ffa39e',
        },
      });

      if (selectedRowKeys.includes(id)) {
        setSelectedRowKeys([]);
      }
      fetchServices();
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        Modal.error({
          title: 'Không thể xóa',
          content: err.response.data,
        });
      } else {
        message.error('Lỗi khi xóa dịch vụ');
      }
    }
  };

  const handleSelectImage = (info) => {
    const file = info.file;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const onFinish = async (values) => {
    const finalValues = { ...values };
    
    if (Array.isArray(finalValues.modelTypeName) && finalValues.modelTypeName.length > 0) {
      finalValues.modelTypeName = finalValues.modelTypeName[0];
    } else if (Array.isArray(finalValues.modelTypeName) && finalValues.modelTypeName.length === 0) {
      finalValues.modelTypeName = null;
    }

    setUploading(true);
    try {
      if (imageFile) {
        try {
          const uploadRes = await serviceApi.uploadImage(imageFile);
          finalValues.image = uploadRes.data.url;
        } catch (err) {
          message.error('Lỗi khi tải ảnh lên server');
          setUploading(false);
          return;
        }
      } else if (editingService?.image) {
        finalValues.image = editingService.image;
      }

      if (editingService) {
        await axios.put(`${API_URL}/${editingService.id}`, finalValues);
        notification.success({
          message: 'CẬP NHẬT THÀNH CÔNG',
          description: 'Thông tin dịch vụ đã được cập nhật.',
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      } else {
        await axios.post(API_URL, finalValues);
        notification.success({
          message: 'THÊM THÀNH CÔNG',
          description: 'Dịch vụ mới đã được thêm vào hệ thống.',
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      }
      setModalVisible(false);
      fetchServices();
      fetchCategoriesAndModels(); // Refresh in case a new modelType was created
    } catch (err) {
      message.error('Lỗi khi lưu dịch vụ');
    } finally {
      setUploading(false);
    }
  };

  const handleReorder = async (action) => {
    if (selectedRowKeys.length === 0) return;
    const serviceId = selectedRowKeys[0];
    try {
      setLoading(true);
      await axios.patch(`${API_URL}/reorder`, {
        serviceId,
        action,
        filterContext: categoryFilter === 'all' ? 'global' : (modelTypeFilter === 'all' ? 'mainCategory' : 'modelType')
      });
      message.success('Đã cập nhật thứ tự dịch vụ');
      await fetchServices();
    } catch (err) {
      message.error('Lỗi khi thay đổi thứ tự');
      setLoading(false);
    }
  };

  const FRONTEND_URL = window.location.port === '5173' ? 'http://localhost:5174' : 'http://localhost:5173';

  const normalizeImageUrl = (url) => {
    if (!url) return 'https://placehold.co/100x100?text=Barber';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    let normalized = url.replace(/\\/g, '/');
    if (!normalized.startsWith('/')) normalized = '/' + normalized;
    if (normalized.startsWith('/uploads/')) {
      return `http://localhost:8080${normalized}`;
    }
    return `${FRONTEND_URL}${normalized}`;
  };

  const columns = [
    {
      title: 'Tên Dịch Vụ',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <Space size="middle">
          <img 
            src={normalizeImageUrl(record.image)} 
            alt={text} 
            style={{ width: 45, height: 45, borderRadius: 8, objectFit: 'cover', border: '1px solid #333' }}
            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Barber'; }}
          />
          <Text strong style={{ fontSize: 14, color: '#fff' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Danh mục',
      key: 'category',
      width: 160,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text style={{ color: '#d4af37', fontSize: 12, fontWeight: 600 }}>{record.modelType?.category?.name || 'Chưa phân loại'}</Text>
          <Text style={{ color: '#888', fontSize: 11 }}>{record.modelType?.name || ''}</Text>
        </div>
      )
    },
    {
      title: 'Thời Gian',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (min) => (
        <Tag color="blue" icon={<Clock size={12} style={{ marginRight: 4 }} />} style={{ borderRadius: 4 }}>
          {min} phút
        </Tag>
      )
    },
    {
      title: 'Giá Tiền',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => (
        <Text strong style={{ color: '#d4af37', fontSize: 15 }}>
          {Number(price).toLocaleString('vi-VN')}₫
        </Text>
      ),
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      dataIndex: 'status',
      width: 110,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'} style={{ borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
          {status === 'active' ? 'ĐANG MỞ' : 'TẠM NGƯNG'}
        </Tag>
      ),
    },

    {
      title: 'Hành Động',
      key: 'action',
      width: 110,
      render: (_, record) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return (
          <Space size="small">
            <Button 
              type="text" 
              style={{ color: '#d4af37' }} 
              icon={<Edit size={16} />} 
              onClick={() => handleEdit(record)}
            />
            {user.role !== 'EDITOR' && (
              <Popconfirm
                title="Xóa dịch vụ?"
                description="Bạn có chắc chắn muốn xóa dịch vụ này không?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" danger icon={<Trash2 size={16} />} />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      if (newSelectedRowKeys.length > 0) {
        setSelectedRowKeys([newSelectedRowKeys[newSelectedRowKeys.length - 1]]);
      } else {
        setSelectedRowKeys([]);
      }
    },
    type: 'checkbox',
    columnWidth: 60,
  };

  const selectedService = services.find(s => s.id === selectedRowKeys[0]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEditor = user.role === 'EDITOR';

  return (
    <div style={{ padding: '0 24px', maxWidth: '100%', paddingBottom: selectedRowKeys.length > 0 ? 100 : 0, transition: 'padding-bottom 0.3s' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '200px' }}>
          <Title level={2} style={{ margin: 0, color: '#fff', wordBreak: 'keep-all' }}>Quản Lý Dịch Vụ</Title>
          <Text type="secondary">Quản lý danh mục dịch vụ cung cấp tại tiệm</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="filter-container" style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.03)', padding: '4px 16px', borderRadius: 12, border: '1px solid rgba(212,175,55,0.1)', flexWrap: 'wrap' }}>
            <span style={{ color: '#d4af37', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Đối tượng khách:</span>
            <Select 
              variant="borderless"
              value={categoryFilter} 
              onChange={(v) => { setCategoryFilter(v); setModelTypeFilter('all'); setCurrentPage(1); }}
              style={{ width: 140, color: '#fff' }}
              popupMatchSelectWidth={false}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              {categories.map(c => (
                <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
              ))}
            </Select>
          </div>
          {categoryFilter !== 'all' && (
            <div className="filter-container" style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.03)', padding: '4px 16px', borderRadius: 12, border: '1px solid rgba(212,175,55,0.1)', flexWrap: 'wrap' }}>
              <span style={{ color: '#d4af37', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Loại mô hình:</span>
              <Select 
                variant="borderless"
                value={modelTypeFilter} 
                onChange={(v) => { setModelTypeFilter(v); setCurrentPage(1); }}
                style={{ width: 150, color: '#fff' }}
                popupMatchSelectWidth={false}
              >
                <Select.Option value="all">Tất cả</Select.Option>
                {activeModels.map(m => (
                  <Select.Option key={m.id} value={String(m.id)}>{m.name}</Select.Option>
                ))}
              </Select>
            </div>
          )}
          {(!localStorage.getItem('user') || JSON.parse(localStorage.getItem('user')).role !== 'EDITOR') && (
            <Space>
              <Button 
                type="primary" 
                size="large"
                icon={<PlusCircle size={20} />} 
                style={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 700, height: 48, borderRadius: 12, boxShadow: '0 4px 15px rgba(212,175,55,0.2)' }}
                onClick={handleAdd}
              >
                Thêm Dịch Vụ
              </Button>
            </Space>
          )}
        </div>
      </div>
      
      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={pagedServices} 
        rowKey="id"
        loading={loading}
        pagination={false}
        rowClassName={(record) => `hover-row ${selectedRowKeys.includes(record.id) ? 'selected-row-highlight' : ''}`}
        scroll={{ x: 1100, y: 'calc(100vh - 340px)' }}
        bordered={false}
      />

      {/* Pagination */}
      {totalPages > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 20,
          paddingBottom: selectedRowKeys.length > 0 ? 80 : 0
        }}>
          <span style={{ color: '#666', fontSize: 13 }}>
            Hiển {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredServices.length)} / {filteredServices.length} dịch vụ
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px', borderRadius: 8, border: '1px solid #333',
                background: currentPage === 1 ? '#111' : '#1a1a1a',
                color: currentPage === 1 ? '#444' : '#aaa', cursor: currentPage === 1 ? 'default' : 'pointer',
                fontSize: 13, transition: 'all 0.2s'
              }}
            >«</button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 16px', borderRadius: 8, border: '1px solid #333',
                background: currentPage === 1 ? '#111' : '#1a1a1a',
                color: currentPage === 1 ? '#444' : '#aaa', cursor: currentPage === 1 ? 'default' : 'pointer',
                fontSize: 13, transition: 'all 0.2s'
              }}
            >‹ Trước</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) => p === '...' ? (
                <span key={`ellipsis-${i}`} style={{ color: '#555', padding: '6px 4px', fontSize: 13 }}>⋯</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 13, transition: 'all 0.2s',
                    border: p === currentPage ? '1px solid #d4af37' : '1px solid #333',
                    background: p === currentPage ? 'rgba(212,175,55,0.15)' : '#1a1a1a',
                    color: p === currentPage ? '#d4af37' : '#aaa',
                    fontWeight: p === currentPage ? 700 : 400,
                    cursor: 'pointer'
                  }}
                >{p}</button>
              ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 16px', borderRadius: 8, border: '1px solid #333',
                background: currentPage === totalPages ? '#111' : '#1a1a1a',
                color: currentPage === totalPages ? '#444' : '#aaa',
                cursor: currentPage === totalPages ? 'default' : 'pointer',
                fontSize: 13, transition: 'all 0.2s'
              }}
            >Tiếp ›</button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px', borderRadius: 8, border: '1px solid #333',
                background: currentPage === totalPages ? '#111' : '#1a1a1a',
                color: currentPage === totalPages ? '#444' : '#aaa',
                cursor: currentPage === totalPages ? 'default' : 'pointer',
                fontSize: 13, transition: 'all 0.2s'
              }}
            >»</button>
          </div>
        </div>
      )}

      {/* Floating Action Bar */}
      {!isEditor && (
        <div className={`reorder-action-bar ${selectedRowKeys.length > 0 ? 'visible' : ''}`}>
          <div className="reorder-action-content">
            <div className="selected-info">
              <span className="selected-label">Đang chọn:</span>
              <span className="selected-name">{selectedService?.name}</span>
            </div>
            <div className="reorder-buttons">
              <Button className="reorder-btn" onClick={() => handleReorder('move_top')} icon={<ArrowUpToLine size={16} />}>Lên đầu</Button>
              <Button className="reorder-btn" onClick={() => handleReorder('move_up')} icon={<ArrowUp size={16} />}>Lên 1 bậc</Button>
              <Button className="reorder-btn" onClick={() => handleReorder('move_down')} icon={<ArrowDown size={16} />}>Xuống 1 bậc</Button>
              <Button className="reorder-btn" onClick={() => handleReorder('move_bottom')} icon={<ArrowDownToLine size={16} />}>Xuống cuối</Button>
            </div>
          </div>
        </div>
      )}

    <Modal
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      width={800}
      closable={false}
      centered
      styles={{ 
        body: { padding: 0, maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }, 
        content: { backgroundColor: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 20, overflow: 'hidden', padding: 0 } 
      }}
    >
      <div style={{ padding: '24px 32px', background: '#111', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ color: '#d4af37', margin: 0, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 16 }}>
            {editingService ? "Sửa thông tin dịch vụ" : "Thêm dịch vụ mới"}
          </Title>
          <Text style={{ color: '#666', fontSize: 12 }}>Vui lòng điền đầy đủ các thông tin bên dưới</Text>
        </div>
        <div 
          onClick={() => setModalVisible(false)}
          style={{ cursor: 'pointer', width: 32, height: 32, borderRadius: 8, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all 0.2s' }}
        >
          <span style={{ fontSize: 18, marginLeft: 9 }}>✕</span>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'active' }}
        style={{ padding: '24px' }}
        className="luxury-form"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Nhập tên dịch vụ..." disabled={isEditor} />
          </Form.Item>



          <Form.Item
            name="categoryId"
            label="Đối tượng khách"
            rules={[{ required: true, message: 'Chọn đối tượng khách' }]}
          >
            <Select placeholder="Chọn đối tượng" disabled={isEditor}>
              {categories.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.categoryId !== curr.categoryId}
          >
            {({ getFieldValue }) => {
              const currentCat = getFieldValue('categoryId');
              const category = categories.find(c => c.id === currentCat);
              let validModelNames = modelTypes.filter(m => m.category?.id === currentCat).map(m => m.name);
              
              if (category?.name?.toLowerCase().includes('nữ')) {
                const defaultNu = ['Cắt - tỉa tóc', 'Phục hồi tóc', 'Chăm sóc da', 'Uốn tóc', 'Nhuộm tóc'];
                defaultNu.forEach(m => {
                  if (!validModelNames.includes(m)) validModelNames.push(m);
                });
              } else if (category?.name?.toLowerCase().includes('nam')) {
                const defaultNam = ['Cắt tóc - Chăm sóc da & râu', 'Phục hồi tóc', 'Chăm sóc da', 'Uốn tóc', 'Nhuộm tóc'];
                defaultNam.forEach(m => {
                  if (!validModelNames.includes(m)) validModelNames.push(m);
                });
              }
              
              return (
                <Form.Item
                  name="modelTypeName"
                  label="Loại mô hình (Chọn hoặc gõ mới)"
                  rules={[{ required: true, message: 'Nhập loại mô hình' }]}
                >
                  <Select
                    mode="tags"
                    maxCount={1}
                    placeholder="VD: Cắt tóc, Uốn tóc..."
                    disabled={!currentCat || isEditor}
                  >
                    {validModelNames.map(name => (
                      <Select.Option key={name} value={name}>{name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            }}
          </Form.Item>



          <Form.Item
            name="price"
            label="Giá dịch vụ (₫)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="VD: 250,000"
              disabled={isEditor}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="VD: 30" disabled={isEditor} />
          </Form.Item>



          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleSelectImage}
                  accept="image/*"
                  disabled={isEditor}
                  style={{
                    width: 200,
                    height: 140,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px dashed #555',
                    backgroundColor: '#050505',
                  }}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666' }}>
                      <Camera size={28} style={{ color: '#d4af37', marginBottom: 8 }} />
                      <div style={{ fontSize: 11, textTransform: 'uppercase' }}>Tải ảnh lên</div>
                    </div>
                  )}
                </Upload>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Form.Item
                  name="status"
                  label="Trạng thái hiển thị"
                  style={{ marginBottom: 0 }}
                >
                  <Select>
                    <Select.Option value="active">Đang kinh doanh</Select.Option>
                    <Select.Option value="inactive">Tạm ngưng</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Mô tả chi tiết"
                  style={{ marginBottom: 0 }}
                >
                  <TextArea rows={3} placeholder="Nhập mô tả các bước thực hiện dịch vụ..." style={{ borderRadius: 12 }} disabled={isEditor} />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #222', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <Button 
            onClick={() => setModalVisible(false)}
            style={{ height: 45, borderRadius: 12, paddingInline: 32, backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#aaa', fontWeight: 600 }}
          >
            Hủy bỏ
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={uploading}
            style={{ height: 45, borderRadius: 12, paddingInline: 40, backgroundColor: '#d4af37', border: 'none', color: '#000', fontWeight: 700, boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}
          >
            {uploading ? 'Đang xử lý...' : (editingService ? 'Lưu thay đổi' : 'Tạo dịch vụ')}
          </Button>
        </div>
      </Form>
    </Modal>

      <style>{`
        .hover-row:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
          cursor: pointer;
        }
        .selected-row-highlight {
          background-color: rgba(212, 175, 55, 0.05) !important;
        }
        .reorder-action-bar {
          position: fixed;
          bottom: -100px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1000;
          pointer-events: none;
        }
        .reorder-action-bar.visible {
          bottom: 40px;
          pointer-events: auto;
        }
        .reorder-action-content {
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 100px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.1);
        }
        .selected-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .selected-label {
          color: #888;
          font-size: 13px;
        }
        .selected-name {
          color: #fff;
          font-weight: 600;
          font-size: 14px;
        }
        .reorder-buttons {
          display: flex;
          gap: 12px;
        }
        .reorder-btn {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #e0e0e0 !important;
          border-radius: 50px !important;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease !important;
        }
        .reorder-btn:hover {
          background: rgba(212, 175, 55, 0.1) !important;
          border-color: rgba(212, 175, 55, 0.5) !important;
          color: #d4af37 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
        }
        .ant-checkbox-inner {
          background-color: transparent;
          border-color: #555;
        }
        .ant-checkbox-checked .ant-checkbox-inner {
          border-color: #d4af37 !important;
          background-color: #d4af37 !important;
        }
        .ant-radio-inner {
          background-color: transparent;
          border-color: #555;
        }
        .ant-radio-checked .ant-radio-inner {
          border-color: #d4af37;
          background-color: #d4af37;
        }
        .dark-modal .ant-modal-content {
          background-color: #1a1a1a !important;
          border: 1px solid #333;
          border-radius: 16px;
        }
        .dark-modal .ant-modal-header {
          background-color: #1a1a1a !important;
          border-bottom: 1px solid #333;
        }
        .dark-modal .ant-modal-title {
          color: #d4af37 !important;
          font-family: 'Heading Font', sans-serif;
        }
        .custom-select-popup {
          background-color: #1a1a1a !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
          padding: 4px !important;
        }
        .custom-select-popup .ant-select-item {
          color: #a0a0a0 !important;
          border-radius: 8px !important;
          margin: 2px 0 !important;
          transition: all 0.2s !important;
        }
        .custom-select-popup .ant-select-item-option-selected {
          background-color: rgba(212, 175, 55, 0.15) !important;
          color: #d4af37 !important;
        }
        .custom-select-popup .ant-select-item-option-active {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #fff !important;
        }
        .luxury-form .ant-form-item-label label {
          color: #d4af37 !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
        }
        .luxury-form .ant-input, 
        .luxury-form .ant-input-number,
        .luxury-form .ant-select-selector {
          background-color: #111 !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
          color: #fff !important;
          padding: 8px 12px !important;
          height: auto !important;
          transition: all 0.3s ease !important;
        }
        .luxury-form .ant-input:focus, 
        .luxury-form .ant-input-focused,
        .luxury-form .ant-input-number-focused,
        .luxury-form .ant-select-focused .ant-select-selector {
          border-color: #d4af37 !important;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1) !important;
          background-color: #161616 !important;
        }
        .luxury-form .ant-input-number-input {
          color: #fff !important;
        }
        .ant-table-cell-fix-left,
        .ant-table-cell-fix-right {
          background-color: #141414 !important;
        }
        .hover-row:hover .ant-table-cell-fix-left,
        .hover-row:hover .ant-table-cell-fix-right {
          background-color: #1a1a1a !important;
        }
      `}</style>
    </div>
  );
};

export default Services;

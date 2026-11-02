import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Tag, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Checkbox, Upload, notification } from 'antd';
import { PlusCircle, Edit, Trash2, Search, Filter, ImageIcon, AlertTriangle, UploadCloud, ArrowUpToLine, ArrowUp, ArrowDown, ArrowDownToLine, CheckCircle, MessageCircle } from 'lucide-react';
import { productApi } from '../api';
import AdminReviewModal from '../components/AdminReviewModal';
import ProductGrid from '../components/ProductGrid';

const { Title, Text } = Typography;
const { TextArea } = Input;
const BACKEND_URL = 'http://localhost:8080';
// Frontend thường chạy ở port còn lại (5173 hoặc 5174)
const FRONTEND_URL = window.location.port === '5173' ? 'http://localhost:5174' : 'http://localhost:5173';

// Helper: chuẩn hóa URL ảnh - fix backslash, thêm prefix frontend URL
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Chuẩn hóa backslash → forward slash
  let normalized = url.replace(/\\/g, '/');
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  if (normalized.startsWith('/uploads/')) {
    return `${BACKEND_URL}${normalized}`;
  }
  return `${FRONTEND_URL}${normalized}`;
};

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxYTFhMWEiLz48cGF0aCBkPSJNODAgOTBINzBDNjcuNzkgOTAgNjYgOTEuNzkgNjYgOTRWMTE0QzY2IDExNi4yMSA2Ny43OSAxMTggNzAgMTE4SDEzMEMxMzIuMjEgMTE4IDEzNCAxMTYuMjEgMTM0IDExNFY5NEMxMzQgOTEuNzkgMTMyLjIxIDkwIDEzMCA5MEgxMjBNODAgOTBWODZDODAgODMuNzkgODEuNzkgODIgODQgODJIMTE2QzExOC4yMSA4MiAxMjAgODMuNzkgMTIwIDg2VjkwTTgwIDkwSDEyME0xMDAgMTAyQzEwMCAxMDUuMzEgOTcuMzEgMTA4IDk0IDEwOEM5MC42OSAxMDggODggMTA1LjMxIDg4IDEwMkM4OCA5OC42OSA5MC42OSA5NiA5NCA5NkM5Ny4zMSA5NiAxMDAgOTguNjkgMTAwIDEwMloiIHN0cm9rZT0iIzQ0NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';

// Image preview component with error handling
const ImagePreview = ({ src, size = 60 }) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgUrl = getImageUrl(src);

  useEffect(() => {
    setHasError(false);
    setLoaded(false);
  }, [src]);

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 8,
      overflow: 'hidden',
      border: hasError ? '2px solid #ff4d4f' : '1px solid #333',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      flexShrink: 0,
    }}>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="preview"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: hasError ? 'none' : 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            console.warn('[IMG ERROR]', imgUrl);
            setHasError(true);
          }}
        />
      ) : null}
      {(hasError || !imgUrl) && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {hasError ? (
            <AlertTriangle size={16} style={{ color: '#ff4d4f' }} />
          ) : (
            <ImageIcon size={16} style={{ color: '#444' }} />
          )}
          <span style={{ fontSize: 8, color: '#666' }}>{hasError ? 'Lỗi' : 'Trống'}</span>
        </div>
      )}
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ keyword: '' });
  const [filterCategory, setFilterCategory] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleReorder = async (action) => {
    if (selectedRowKeys.length === 0) return;
    const productId = selectedRowKeys[0];
    try {
      setLoading(true);
      await productApi.reorder({
        productId,
        action
      });
      message.success('Đã cập nhật thứ tự sản phẩm');
      await fetchProducts();
    } catch (err) {
      message.error('Lỗi khi thay đổi thứ tự');
      setLoading(false);
    }
  };

  const productCategories = [
    { name: 'Tông đơ', slug: 'tong-do' },
    { name: 'Kéo cắt & tỉa', slug: 'keo-cat' },
    { name: 'Máy làm tóc', slug: 'may-lam-toc' },
    { name: 'Gôm xịt tóc', slug: 'gom-xit' },
    { name: 'Sáp vuốt tóc', slug: 'sap-vuot' },
    { name: 'Sản phẩm dưỡng tóc', slug: 'duong-toc' },
    { name: 'Khác', slug: 'khac' },
  ];

  const handleUploadImage = async (file, field) => {
    try {
      const res = await productApi.uploadImage(file);
      form.setFieldsValue({ [field]: res.data.url });
      message.success('Tải ảnh lên thành công');
    } catch (err) {
      message.error('Tải ảnh lên thất bại: ' + (err.response?.data?.error || err.message));
    }
  };

  const getCategoryName = (slug) => {
    const cat = productCategories.find(c => c.slug === slug);
    return cat ? cat.name : slug || 'Chưa phân loại';
  };

  const [filterBranch, setFilterBranch] = useState(undefined);
  const [sortOption, setSortOption] = useState(undefined);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.keyword) params.keyword = filters.keyword;
      if (user.role === 'EDITOR' && user.branch) {
        params.branch = user.branch;
      } else if (filterBranch) {
        params.branch = filterBranch;
      }
      const res = await productApi.getAll(params);
      let data = res.data;
      if (filterCategory) {
        data = data.filter(p => p.category === filterCategory);
      }
      setProducts(data);
    } catch (err) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { fetchProducts(); }, 300);
    return () => clearTimeout(timer);
  }, [filters.keyword, filterCategory, filterBranch, sortOption]);

  const handleResetFilters = () => {
    setFilters({ keyword: '' });
    setFilterCategory(undefined);
    setFilterBranch(undefined);
    setSortOption(undefined);
  };

  const getSortedProducts = () => {
    let result = [...products];
    if (sortOption === 'newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortOption === 'oldest') {
      result.sort((a, b) => a.id - b.id);
    }
    return result;
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({ stock: 100, isSale: false, isBestSeller: false, isNew: false, branches: ['Online'] });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      branches: [record.branch || 'Online'],
      isSale: !!record.isSale,
      isBestSeller: !!record.isBestSeller,
      isNew: !!record.isNew,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const productToDelete = products.find(p => p.id === id);
    try {
      await productApi.delete(id);
      notification.open({
        message: 'ĐÃ XÓA SẢN PHẨM',
        description: `Sản phẩm "${productToDelete?.name || ''}" đã được xóa khỏi hệ thống thành công.`,
        icon: <Trash2 color="#ff4d4f" size={24} />,
        style: {
          backgroundColor: '#fff1f0',
          border: '1px solid #ffa39e',
        },
      });
      fetchProducts();
    } catch (err) {
      message.error('Xóa sản phẩm thất bại');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const branches = user.role === 'EDITOR' ? [user.branch] : (values.branches || ['Online']);
      
      if (editingProduct) {
        values.branch = branches[0];
        await productApi.update(editingProduct.id, values);
        
        // Nếu có chọn nhiều chi nhánh, các chi nhánh còn lại sẽ được tạo mới
        if (branches.length > 1) {
          const createPromises = branches.slice(1).map(b => {
            const productData = { ...values, branch: b };
            return productApi.create(productData);
          });
          await Promise.all(createPromises);
        }

        notification.success({
          message: 'CẬP NHẬT THÀNH CÔNG',
          description: `Thông tin sản phẩm "${values.name}" đã được cập nhật thành công.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: { backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' },
        });
      } else {
        const createPromises = branches.map(b => {
          const productData = { ...values, branch: b };
          return productApi.create(productData);
        });
        await Promise.all(createPromises);
        notification.success({
          message: 'THÊM THÀNH CÔNG',
          description: `Sản phẩm mới "${values.name}" đã được thêm vào hệ thống.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: { backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' },
        });
      }
      setModalVisible(false);
      fetchProducts();
    } catch (err) {
      if (err.errorFields) return;
      message.error('Thao tác thất bại');
    }
  };

  const selectedProduct = products.find(p => p.id === selectedRowKeys[0]);
  const isEditor = user.role === 'EDITOR';

  return (
    <div style={{ maxWidth: '100%', paddingBottom: selectedRowKeys.length > 0 ? 100 : 0, transition: 'padding-bottom 0.3s' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>Sản Phẩm</Title>
          <p style={{ color: '#a0a0a0', marginTop: 4 }}>Quản lý kho hàng và thông tin sản phẩm</p>
        </div>
        {user.role !== 'EDITOR' && (
          <Button type="primary" icon={<PlusCircle size={18} />}
            style={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', borderColor: '#d4af37' }}
            onClick={handleAdd}>
            Thêm Sản Phẩm
          </Button>
        )}
      </div>

      {/* Search & Filter */}
      <div style={{ backgroundColor: '#111', padding: 20, borderRadius: 12, border: '1px solid #2a2a2a', marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input
          prefix={<Search size={18} style={{ color: '#666' }} />}
          placeholder="Tìm theo tên sản phẩm..."
          style={{ flex: 1, minWidth: 200, backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }}
          value={filters.keyword}
          onChange={e => setFilters({ ...filters, keyword: e.target.value })}
        />
        <Select placeholder="Lọc theo danh mục" style={{ width: 160 }} allowClear value={filterCategory}
          onChange={val => setFilterCategory(val)} suffixIcon={<Filter size={16} style={{ color: '#666' }} />}>
          {productCategories.map(cat => (
            <Select.Option key={cat.slug} value={cat.slug}>{cat.name}</Select.Option>
          ))}
        </Select>
        {user.role !== 'EDITOR' && (
          <Select placeholder="Lọc theo chi nhánh" style={{ width: 160 }} allowClear value={filterBranch}
            onChange={val => setFilterBranch(val)} suffixIcon={<Filter size={16} style={{ color: '#666' }} />}>
            <Select.Option value="Online">Sản phẩm online</Select.Option>
            <Select.Option value="Quận 1">Chi nhánh 1</Select.Option>
            <Select.Option value="Quận 2">Chi nhánh 2</Select.Option>
            <Select.Option value="Quận 3">Chi nhánh 3</Select.Option>
            <Select.Option value="Quận 7">Chi nhánh 7</Select.Option>
            <Select.Option value="Quận 9">Chi nhánh 9</Select.Option>
            <Select.Option value="Bình Thạnh">Chi nhánh Bình Thạnh</Select.Option>
          </Select>
        )}
        <Select placeholder="Sắp xếp" style={{ width: 140 }} allowClear value={sortOption}
          onChange={val => setSortOption(val)}>
          <Select.Option value="newest">Mới nhất</Select.Option>
          <Select.Option value="oldest">Cũ nhất</Select.Option>
        </Select>
        <Button onClick={handleResetFilters} style={{ backgroundColor: '#333', borderColor: '#444', color: '#fff' }}>
          Reset
        </Button>
      </div>

      {/* Product Grid */}
      <ProductGrid 
        data={getSortedProducts()}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewReview={(record) => {
          setReviewProduct(record);
          setReviewModalVisible(true);
        }}
        onViewDetail={(record) => {
          setDetailProduct(record);
          setDetailModalVisible(true);
        }}
        isEditor={isEditor}
        selectedRowKeys={selectedRowKeys}
        onSelectRow={(id) => {
          if (selectedRowKeys.includes(id)) setSelectedRowKeys([]);
          else setSelectedRowKeys([id]);
        }}
      />

      {/* === MODAL THÊM / SỬA === */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        closable={false}
        centered
        styles={{ body: { padding: 0 }, content: { backgroundColor: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 20, overflow: 'hidden' } }}
      >
        {/* Header Tùy Biến */}
        <div style={{ padding: '24px 32px', background: '#111', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ color: '#d4af37', margin: 0, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 16 }}>
              {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </Title>
            <Text style={{ color: '#666', fontSize: 12 }}>Quản lý kho hàng và thông tin chi tiết sản phẩm</Text>
          </div>
          <div 
            onClick={() => setModalVisible(false)}
            style={{ cursor: 'pointer', width: 32, height: 32, borderRadius: 8, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.borderColor = '#d4af37'; e.target.style.color = '#d4af37'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#888'; }}
          >
            ✕
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ stock: 100, isSale: false, isBestSeller: false, isNew: false }}
          style={{ padding: '32px' }}
          className="luxury-form"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px 48px' }}>
            
            {/* Cột trái: Thông tin chính */}
            <div>
              <div style={{ color: '#d4af37', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 2, backgroundColor: '#d4af37' }}></div> Thông tin cơ bản
              </div>

              <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder="VD: Pomade Reuzel Blue" disabled={user.role === 'EDITOR'} />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Form.Item name="category" label="Danh mục">
                  <Select placeholder="Chọn danh mục" allowClear disabled={user.role === 'EDITOR'}>
                    {productCategories.map(cat => (
                      <Select.Option key={cat.slug} value={cat.slug}>{cat.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {user.role !== 'EDITOR' && (
                  <Form.Item name="branches" label="Chi nhánh" rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}>
                    <Select 
                      mode="multiple" 
                      placeholder="Chọn chi nhánh" 
                      allowClear
                    >
                      <Select.Option value="Online">Sản phẩm online</Select.Option>
                      <Select.Option value="Quận 1">Chi nhánh 1</Select.Option>
                      <Select.Option value="Quận 2">Chi nhánh 2</Select.Option>
                      <Select.Option value="Quận 3">Chi nhánh 3</Select.Option>
                      <Select.Option value="Quận 7">Chi nhánh 7</Select.Option>
                      <Select.Option value="Quận 9">Chi nhánh 9</Select.Option>
                      <Select.Option value="Bình Thạnh">Chi nhánh Bình Thạnh</Select.Option>
                    </Select>
                  </Form.Item>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Form.Item name="price" label="Giá bán (₫)" rules={[{ required: true, message: 'Nhập giá' }]}>
                  <InputNumber style={{ width: '100%' }} min={0} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} disabled={user.role === 'EDITOR'} />
                </Form.Item>
                <Form.Item name="oldPrice" label="Giá cũ (₫)">
                  <InputNumber style={{ width: '100%' }} min={0} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} disabled={user.role === 'EDITOR'} />
                </Form.Item>
              </div>

              <Form.Item name="stock" label="Số lượng tồn kho">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>

              <div style={{ backgroundColor: 'rgba(212,175,55,0.05)', padding: '16px', borderRadius: 12, border: '1px solid rgba(212,175,55,0.1)', marginBottom: 24 }}>
                <div style={{ color: '#d4af37', fontSize: 10, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>Đặc tính sản phẩm</div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <Form.Item name="isSale" valuePropName="checked" noStyle>
                    <Checkbox className="luxury-checkbox" disabled={user.role === 'EDITOR'}>Đang Sale</Checkbox>
                  </Form.Item>
                  <Form.Item name="isBestSeller" valuePropName="checked" noStyle>
                    <Checkbox className="luxury-checkbox" disabled={user.role === 'EDITOR'}>Bán chạy</Checkbox>
                  </Form.Item>
                  <Form.Item name="isNew" valuePropName="checked" noStyle>
                    <Checkbox className="luxury-checkbox" disabled={user.role === 'EDITOR'}>Hàng mới</Checkbox>
                  </Form.Item>
                </div>
              </div>

              <Form.Item name="description" label="Mô tả sản phẩm" style={{ marginBottom: 0 }}>
                <TextArea rows={4} placeholder="Nhập mô tả sản phẩm..." style={{ borderRadius: 12 }} disabled={user.role === 'EDITOR'} />
              </Form.Item>
            </div>

            {/* Cột phải: Hình ảnh */}
            <div>
              <div style={{ color: '#d4af37', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>
                Hình ảnh sản phẩm
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Thumbnail */}
                <div style={{ backgroundColor: '#111', padding: 16, borderRadius: 16, border: '1px solid #222' }}>
                  <Form.Item label="Ảnh đại diện (Thumbnail)" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Form.Item name="thumbnail" noStyle>
                        <Input placeholder="Chưa có ảnh..." readOnly disabled={user.role === 'EDITOR'} style={{ flex: 1 }} />
                      </Form.Item>
                      {user.role !== 'EDITOR' && (
                        <Upload
                          accept="image/*"
                          showUploadList={false}
                          beforeUpload={(file) => {
                            handleUploadImage(file, 'thumbnail');
                            return false;
                          }}
                        >
                          <Button icon={<UploadCloud size={16} />} style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000', display: 'flex', alignItems: 'center', gap: 4, height: 40 }}>Tải ảnh</Button>
                        </Upload>
                      )}
                    </div>
                  </Form.Item>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form.Item shouldUpdate noStyle>
                      {({ getFieldValue }) => <ImagePreview src={getFieldValue('thumbnail')} size={120} />}
                    </Form.Item>
                  </div>
                </div>

                {/* Sub images */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[1, 2, 3].map(num => (
                    <div key={num} style={{ backgroundColor: '#111', padding: 8, borderRadius: 12, border: '1px solid #222' }}>
                      <Form.Item label={`Ảnh phụ ${num}`} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <Form.Item name={`image${num}`} noStyle>
                            <Input placeholder="Chưa có ảnh..." readOnly disabled={user.role === 'EDITOR'} style={{ fontSize: 10 }} />
                          </Form.Item>
                          {user.role !== 'EDITOR' && (
                            <Upload
                              accept="image/*"
                              showUploadList={false}
                              beforeUpload={(file) => {
                                handleUploadImage(file, `image${num}`);
                                return false;
                              }}
                            >
                              <Button size="small" icon={<UploadCloud size={12} />} style={{ width: '100%', backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>Tải ảnh</Button>
                            </Upload>
                          )}
                        </div>
                      </Form.Item>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                        <Form.Item shouldUpdate noStyle>
                          {({ getFieldValue }) => <ImagePreview src={getFieldValue(`image${num}`)} size={60} />}
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #222', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <Button 
              onClick={() => setModalVisible(false)}
              style={{ height: 45, borderRadius: 12, paddingInline: 32, backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#aaa', fontWeight: 600 }}
            >
              Hủy bỏ
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              style={{ height: 45, borderRadius: 12, paddingInline: 40, backgroundColor: '#d4af37', border: 'none', color: '#000', fontWeight: 700, boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}
            >
              {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL XEM CHI TIẾT */}
      <Modal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
        closable={false}
        centered
        styles={{ body: { padding: 0 }, content: { backgroundColor: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 20, overflow: 'hidden' } }}
      >
        <div style={{ padding: '24px 32px', background: '#111', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ color: '#d4af37', margin: 0, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 16 }}>
              Chi Tiết Sản Phẩm
            </Title>
            <Text style={{ color: '#666', fontSize: 12 }}>Xem thông tin sản phẩm (Chỉ đọc)</Text>
          </div>
          <div 
            onClick={() => setDetailModalVisible(false)}
            style={{ cursor: 'pointer', width: 32, height: 32, borderRadius: 8, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.borderColor = '#d4af37'; e.target.style.color = '#d4af37'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#888'; }}
          >
            ✕
          </div>
        </div>
        
        {detailProduct && (
          <div style={{ padding: '32px', display: 'flex', gap: 32 }}>
            <div style={{ flex: '0 0 200px' }}>
              <div style={{ width: 200, height: 200, borderRadius: 16, overflow: 'hidden', border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                <ImagePreview src={detailProduct.thumbnail} size={200} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                {[1, 2, 3].map(num => (
                  <div key={num} style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', border: '1px solid #333' }}>
                    <ImagePreview src={detailProduct[`image${num}`]} size="100%" />
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase' }}>Tên sản phẩm</div>
                <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{detailProduct.name}</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase' }}>Danh mục</div>
                  <Tag color="blue" style={{ marginTop: 4 }}>{getCategoryName(detailProduct.category)}</Tag>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase' }}>Chi nhánh</div>
                  <Tag color="cyan" style={{ marginTop: 4 }}>{detailProduct.branch || 'Online'}</Tag>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase' }}>Giá bán</div>
                  <div style={{ color: '#d4af37', fontSize: 18, fontWeight: 700 }}>{detailProduct.price?.toLocaleString('vi-VN')}₫</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase' }}>Tồn kho</div>
                  <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{detailProduct.stock}</div>
                </div>
              </div>

              <div>
                <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>Đặc điểm</div>
                <Space wrap>
                  {detailProduct.isSale && <Tag color="red">SALE</Tag>}
                  {detailProduct.isBestSeller && <Tag color="orange">BEST SELLER</Tag>}
                  {detailProduct.isNew && <Tag color="green">NEW</Tag>}
                  {!detailProduct.isSale && !detailProduct.isBestSeller && !detailProduct.isNew && <span style={{ color: '#555' }}>Không có</span>}
                </Space>
              </div>

              <div>
                <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>Mô tả</div>
                <div style={{ color: '#bbb', fontSize: 13, lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8, border: '1px solid #222' }}>
                  {detailProduct.description || 'Không có mô tả.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL REVIEWS */}
      <AdminReviewModal
        isOpen={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        type="product"
        itemId={reviewProduct?.id}
        itemName={reviewProduct?.name}
      />

      <style>{`
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
        .luxury-checkbox {
          color: #a0a0a0 !important;
          font-size: 12px !important;
        }
        .luxury-checkbox .ant-checkbox-inner {
          background-color: #1a1a1a !important;
          border-color: #333 !important;
        }
        .luxury-checkbox .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #d4af37 !important;
          border-color: #d4af37 !important;
        }
        .out-of-stock-row {
          opacity: 0.6;
        }
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
      `}</style>

      {/* Floating Action Bar */}
      {!isEditor && (
        <div className={`reorder-action-bar ${selectedRowKeys.length > 0 ? 'visible' : ''}`}>
          <div className="reorder-action-content">
            <div className="selected-info">
              <span className="selected-label">Đang chọn:</span>
              <span className="selected-name">{selectedProduct?.name}</span>
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
    </div>
  );
};

export default Products;

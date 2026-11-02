import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Space, Modal, Form, Input, Select, notification, Popconfirm, Upload } from 'antd';
import { PlusCircle, Edit, Trash2, Newspaper, UploadCloud, CheckCircle, Ticket } from 'lucide-react';
import { newsApi, voucherApi } from '../api';
import dayjs from 'dayjs';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Autoformat,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    BlockQuote,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table as CKEditorTable,
    TableToolbar,
    TableColumnResize,
    TextTransformation,
    FontFamily,
    FontSize,
    FontColor,
    FontBackgroundColor,
    Alignment,
    Highlight,
    RemoveFormat,
    FileRepository
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const NEWS_TYPES = {
  SERVICE: 'Dịch vụ',
  PRODUCT: 'Sản phẩm'
};

const CATEGORIES = {
  SERVICE: [
    { value: 'nam', label: 'Dịch vụ Nam' },
    { value: 'nu', label: 'Dịch vụ Nữ' }
  ],
  PRODUCT: [
    { value: 'tong-do', label: 'Tông đơ' },
    { value: 'keo-cat-tia', label: 'Kéo cắt & tỉa' },
    { value: 'may-lam-toc', label: 'Máy làm tóc' },
    { value: 'gom-xit-toc', label: 'Gôm xịt tóc' },
    { value: 'sap-vuot-toc', label: 'Sáp vuốt tóc' },
    { value: 'san-pham-duong-toc', label: 'Sản phẩm dưỡng tóc' },
    { value: 'khac', label: 'Khác' },
  ]
};

const getCategoryLabel = (type, slug) => {
  const catList = CATEGORIES[type] || [];
  const cat = catList.find(c => c.value === slug);
  return cat ? cat.label : slug;
};

const CustomEditor = ({ value, onChange }) => {
  // Custom Upload Adapter plugin
  function uploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return {
        upload: () => {
          return loader.file.then(file => new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            
            const token = localStorage.getItem('token');
            // Gửi ảnh lên server
            fetch('http://localhost:8080/api/upload/news-image', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formData
            })
            .then(response => response.json())
            .then(result => {
              if (result.error) {
                return reject(result.error);
              }
              resolve({
                default: `http://localhost:8080${result.url}`
              });
            })
            .catch(error => {
              reject(error);
            });
          }));
        },
        abort: () => {}
      };
    };
  }

  const editorConfig = {
    licenseKey: 'GPL',
    plugins: [
      Autoformat, BlockQuote, Bold, Essentials, Heading, Image, ImageCaption,
      ImageStyle, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link,
      List, MediaEmbed, Paragraph, PasteFromOffice, CKEditorTable, TableToolbar,
      TableColumnResize, TextTransformation, Underline, Strikethrough,
      FontFamily, FontSize, FontColor, FontBackgroundColor, Alignment,
      Highlight, RemoveFormat, FileRepository
    ],
    toolbar: {
      items: [
        'undo', 'redo', '|',
        'heading', '|',
        'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', 'underline', 'strikethrough', 'removeFormat', '|',
        'alignment', 'bulletedList', 'numberedList', '|',
        'outdent', 'indent', '|',
        'link', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed', 'highlight'
      ],
      shouldNotGroupWhenFull: false
    },
    image: {
      toolbar: ['imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|', 'toggleImageCaption', 'imageTextAlternative']
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    extraPlugins: [uploadAdapterPlugin]
  };

  return (
    <div style={{ color: '#000' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .ck.ck-editor__editable_inline {
            min-height: 400px !important;
            padding: 30px 40px !important;
            background-color: #ffffff !important;
            color: #000000 !important;
        }
        .ck-content, .ck-content p, .ck-content h1, .ck-content h2, .ck-content h3, .ck-content h4, .ck-content li, .ck-content span {
            color: #000000 !important;
        }
        .ck.ck-toolbar {
            background: #f8f9fa !important;
            border: 1px solid #ddd !important;
        }
        /* Fix cho tooltip/popup của CKEditor bị đè bởi Modal của Ant Design */
        .ck-body-wrapper {
            z-index: 10000 !important;
        }
      `}} />
      <CKEditor
        editor={ClassicEditor}
        data={value || ''}
        config={editorConfig}
        onChange={(event, editor) => {
          if (onChange) onChange(editor.getData());
        }}
      />
    </div>
  );
};

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState('SERVICE');
  const thumbnailUrl = Form.useWatch('thumbnail', form);

  const handleUploadImage = async (file) => {
    try {
      const res = await newsApi.uploadImage(file);
      form.setFieldsValue({ thumbnail: res.data.url });
      notification.success({ message: 'Tải ảnh thành công' });
    } catch (err) {
      notification.error({ message: 'Tải ảnh thất bại' });
    }
    return false;
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsApi.getAll();
      setNews(response.data || []);
    } catch (error) {
      notification.error({
        message: 'LỖI',
        description: 'Không thể tải danh sách tin tức.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await voucherApi.getAll();
      // Only keep CLAIMABLE active vouchers or just show all for admin to select
      setVouchers(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchVouchers();
  }, []);

  const handleAdd = () => {
    setEditingNews(null);
    setSelectedType('SERVICE');
    form.resetFields();
    form.setFieldsValue({ type: 'SERVICE', thumbnail: null });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingNews(record);
    setSelectedType(record.type || 'SERVICE');
    form.setFieldsValue({
      ...record,
      attachedVoucherId: record.attachedVoucher?.id
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const newsToDelete = news.find(n => n.id === id);
    try {
      await newsApi.delete(id);
      notification.open({
        message: 'ĐÃ XÓA TIN TỨC',
        description: `Bài viết "${newsToDelete?.title || ''}" đã được xóa thành công.`,
        icon: <Trash2 color="#ff4d4f" size={24} />,
        style: { backgroundColor: '#fff1f0', border: '1px solid #ffa39e' },
      });
      fetchNews();
    } catch (error) {
      notification.error({ message: 'Lỗi khi xóa bài viết' });
    }
  };

  const handleSave = async (values) => {
    try {
      const payload = {
        ...values,
        attachedVoucher: values.attachedVoucherId ? { id: values.attachedVoucherId } : null
      };

      if (editingNews) {
        await newsApi.update(editingNews.id, payload);
        notification.success({
          message: 'CẬP NHẬT THÀNH CÔNG',
          description: `Bài viết "${values.title}" đã được cập nhật.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: { backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' },
        });
      } else {
        await newsApi.create(payload);
        notification.success({
          message: 'THÊM THÀNH CÔNG',
          description: `Bài viết mới "${values.title}" đã được tạo.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: { backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' },
        });
      }
      setModalVisible(false);
      fetchNews();
    } catch (error) {
      notification.error({ message: 'Lỗi khi lưu bài viết' });
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (img) => img ? <img src={`http://localhost:8080${img}`} alt="thumbnail" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} /> : <div style={{ width: 60, height: 60, background: '#333', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Newspaper size={20} color="#666" /></div>
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{text}</div>
    },
    {
      title: 'Loại / Danh mục',
      key: 'category',
      render: (_, record) => (
        <div>
          <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{NEWS_TYPES[record.type]}</span>
          <br />
          <span style={{ color: '#888', fontSize: '12px' }}>{getCategoryLabel(record.type, record.categorySlug)}</span>
        </div>
      )
    },
    {
      title: 'Voucher Đính Kèm',
      key: 'voucher',
      render: (_, record) => (
        record.attachedVoucher ? (
          <div style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ticket size={14} /> {record.attachedVoucher.code}
          </div>
        ) : (
          <span style={{ color: '#666', fontSize: '13px' }}>—</span>
        )
      )
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (_, record) => (
        <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
          {record.createdAt ? dayjs(record.createdAt).format('DD/MM/YYYY HH:mm') : ''}
        </span>
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
            title="Bạn có chắc chắn muốn xóa bài viết này?"
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

  const handleRemoveImage = () => {
    form.setFieldsValue({ thumbnail: null });
  };

  return (
    <div className="news-page animate-fade-in" style={{ padding: '8px' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
            Tin Tức & <span style={{ color: '#d4af37' }}>Bài Viết</span>
          </Title>
          <p style={{ color: '#666', marginTop: 4, fontWeight: 500 }}>
            Quản lý các bài viết tin tức, kiến thức về dịch vụ và sản phẩm
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusCircle size={18} />} 
          onClick={handleAdd}
          style={{ 
            backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', borderColor: '#d4af37',
            height: 44, padding: '0 24px', borderRadius: 12, boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
          }}
        >
          THÊM BÀI VIẾT
        </Button>
      </div>

      <div style={{ 
        backgroundColor: '#111', borderRadius: 24, border: '1px solid #222',
        overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <Table 
          columns={columns}
          dataSource={news.map(n => ({ ...n, key: n.id }))}
          loading={loading}
          locale={{ emptyText: 'Chưa có bài viết nào.' }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        open={modalVisible}
        title={<span style={{ color: '#d4af37', fontWeight: 900, fontSize: '18px' }}>{editingNews ? 'CẬP NHẬT BÀI VIẾT' : 'THÊM BÀI VIẾT MỚI'}</span>}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
        centered
        wrapClassName="dark-luxury-modal-wrap"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="title"
            label={<span style={{ color: '#a0a0a0' }}>Tiêu đề bài viết</span>}
            rules={[{ required: true, message: 'Nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="type"
              label={<span style={{ color: '#a0a0a0' }}>Phân loại</span>}
              style={{ flex: 1 }}
            >
              <Select onChange={val => {
                setSelectedType(val);
                form.setFieldsValue({ categorySlug: CATEGORIES[val][0].value });
              }}>
                <Option value="SERVICE">Dịch vụ</Option>
                <Option value="PRODUCT">Sản phẩm</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="categorySlug"
              label={<span style={{ color: '#a0a0a0' }}>Danh mục con</span>}
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục">
                {(CATEGORIES[selectedType] || []).map(cat => (
                  <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="thumbnail" label={<span style={{ color: '#a0a0a0' }}>Ảnh bìa</span>}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {thumbnailUrl ? (
                <div style={{ position: 'relative', width: 120, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid #333' }}>
                  <img src={`http://localhost:8080${thumbnailUrl}`} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div 
                    onClick={handleRemoveImage}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 4, cursor: 'pointer', display: 'flex' }}
                  >
                    <Trash2 size={12} color="#ff4d4f" />
                  </div>
                </div>
              ) : (
                <div style={{ width: 120, height: 80, borderRadius: 8, border: '1px dashed #444', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                  <UploadCloud size={20} color="#666" />
                  <span style={{ fontSize: 10, color: '#666', marginTop: 4 }}>Chưa có ảnh</span>
                </div>
              )}
              
              <Upload 
                accept="image/*" 
                showUploadList={false} 
                beforeUpload={handleUploadImage}
              >
                <Button icon={<UploadCloud size={16} />} style={{ backgroundColor: '#222', borderColor: '#444', color: '#d4af37' }}>
                  Tải ảnh lên
                </Button>
              </Upload>
            </div>
          </Form.Item>
          
          <Form.Item name="attachedVoucherId" label={<span style={{ color: '#a0a0a0' }}>Voucher đính kèm (Tùy chọn)</span>}>
            <Select placeholder="Chọn voucher đính kèm" allowClear style={{ width: '100%' }}>
              {vouchers.map(v => (
                <Option key={v.id} value={v.id}>
                  {v.name} ({v.code}) - {v.issueType === 'CLAIMABLE' ? 'Nhận Thủ Công' : v.issueType}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label={<span style={{ color: '#a0a0a0' }}>Nội dung bài viết</span>}
            rules={[{ required: true, message: 'Nhập nội dung bài viết!' }]}
          >
            <CustomEditor />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={() => setModalVisible(false)} style={{ background: '#222', borderColor: '#444', color: '#a0a0a0' }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000', fontWeight: 'bold' }}>
              Lưu Bài Viết
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default News;

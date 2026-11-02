import React, { useState, useEffect } from 'react';
import { 
  Card, Form, Input, Select, Button, Space, Typography, 
  Upload, message, Spin, Row, Col, Switch 
} from 'antd';
import { ArrowLeft, Save, Upload as UploadIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Sử dụng package ckeditor5 mới
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
    Table,
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

const KnowledgeForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/admin/knowledge/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Không thể tải bài viết');
      const data = await res.json();
      
      form.setFieldsValue({
        title: data.title,
        category: data.category,
        status: data.status === 'Hiển thị'
      });
      setContent(data.content || '');
      setThumbnailUrl(data.thumbnailImage || '');
    } catch (error) {
      message.error(error.message);
      navigate('/knowledge');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text.toString().toLowerCase()
      .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/\s+/g, '-') 
      .replace(/[^\w\-]+/g, '') 
      .replace(/\-\-+/g, '-') 
      .replace(/^-+/, '') 
      .replace(/-+$/, '');
  };

  // Hàm trích xuất text từ HTML để làm mô tả ngắn tự động
  const extractTextFromHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    let text = tempDiv.textContent || tempDiv.innerText || "";
    // Xóa khoảng trắng thừa
    text = text.replace(/\s+/g, ' ').trim();
    return text.length > 250 ? text.substring(0, 250) + "..." : text;
  };

  const uploadThumbnail = async (options) => {
    const { file, onSuccess, onError } = options;
    setThumbnailLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/upload/knowledge-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload thất bại');
      const data = await res.json();
      setThumbnailUrl(data.url);
      onSuccess("Ok");
      message.success('Tải ảnh thành công');
    } catch (error) {
      onError({ error });
      message.error(error.message);
    } finally {
      setThumbnailLoading(false);
    }
  };

  const onFinish = async (values, continueEditing = false) => {
    if (!content) {
      message.error('Vui lòng nhập nội dung bài viết!');
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        title: values.title,
        slug: generateSlug(values.title), // Tự động tạo slug
        category: values.category,
        shortDescription: extractTextFromHtml(content), // Tự động tạo mô tả ngắn
        thumbnailImage: thumbnailUrl,
        content: content,
        status: values.status ? 'Hiển thị' : 'Ẩn'
      };

      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `http://localhost:8080/api/admin/knowledge/${id}` 
        : 'http://localhost:8080/api/admin/knowledge';
        
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lưu thất bại');
      
      message.success(isEditing ? 'Cập nhật thành công' : 'Thêm mới thành công');
      
      if (!continueEditing) {
        navigate('/knowledge');
      } else if (!isEditing) {
        navigate(`/knowledge/edit/${data.id}`, { replace: true });
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Custom Upload Adapter plugin
  function uploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return {
        upload: () => {
          return loader.file.then(file => new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            
            const token = localStorage.getItem('token');
            fetch('http://localhost:8080/api/upload/knowledge-image', {
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
      List, MediaEmbed, Paragraph, PasteFromOffice, Table, TableToolbar,
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

  if (loading) return <div className="flex justify-center p-12"><Spin size="large" /></div>;

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6 bg-[#1a1a1a] p-4 rounded-xl shadow-lg border border-[#333]">
        <Space>
          <Button 
            icon={<ArrowLeft size={18} />} 
            onClick={() => navigate('/knowledge')}
            type="text"
            className="text-gray-400 hover:text-white"
          />
          <div>
            <Title level={4} style={{ margin: 0, color: '#d4af37', textTransform: 'uppercase' }}>
              {isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>Module Kiến Thức & Cẩm Nang</Text>
          </div>
        </Space>
        
        <Space>
          <Button onClick={() => navigate('/knowledge')} ghost>Hủy</Button>
          <Button 
            onClick={() => form.submit()} 
            loading={saving}
            ghost
          >
            Lưu
          </Button>
          <Button 
            type="primary" 
            style={{ background: '#d4af37', borderColor: '#d4af37', color: 'black', fontWeight: 'bold' }}
            icon={<Save size={18} />}
            onClick={() => {
              form.validateFields().then(values => {
                onFinish(values, true);
              });
            }}
            loading={saving}
          >
            Lưu & Tiếp tục
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onFinish(values, false)}
        initialValues={{ status: true, category: 'Dịch vụ Nam' }}
      >
        {/* Thông tin cơ bản - Top Card */}
        <Card bordered={false} className="bg-[#242424] mb-6 shadow-md border border-[#333]" title={<span className="text-[#d4af37] font-bold">1. THÔNG TIN CƠ BẢN</span>}>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="title"
                label={<Text strong className="text-gray-300">Tiêu đề bài viết</Text>}
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              >
                <Input placeholder="Nhập tiêu đề..." size="large" />
              </Form.Item>
            </Col>
            
            <Col xs={24} lg={12}>
              <div className="flex gap-4">
                <Form.Item
                  name="category"
                  label={<Text strong className="text-gray-300">Danh mục</Text>}
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                  className="flex-1"
                >
                  <Select size="large">
                    <Option value="Dịch vụ Nam">Dịch vụ Nam</Option>
                    <Option value="Dịch vụ Nữ">Dịch vụ Nữ</Option>
                    <Option value="Sản phẩm">Sản phẩm</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="status"
                  label={<Text strong className="text-gray-300">Trạng thái hiển thị</Text>}
                  valuePropName="checked"
                  className="flex-1"
                >
                  <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item label={<Text strong className="text-gray-300">Ảnh đại diện (Thumbnail)</Text>}>
                <div className="flex items-center gap-6">
                  <Upload
                    customRequest={uploadThumbnail}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button icon={<UploadIcon size={16} />} loading={thumbnailLoading} size="large">
                      {thumbnailUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                    </Button>
                  </Upload>
                  {thumbnailUrl && (
                    <div className="rounded-lg overflow-hidden border border-[#444] bg-[#111] flex items-center justify-center h-[80px] px-2">
                      <img 
                        src={`http://localhost:8080${thumbnailUrl}`} 
                        alt="Thumbnail" 
                        style={{ maxHeight: '100%', maxWidth: '200px', objectFit: 'contain' }} 
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* CKEditor - Bottom Card */}
        <Card bordered={false} className="bg-[#242424] mb-12 shadow-md border border-[#333]" title={<span className="text-[#d4af37] font-bold">2. NỘI DUNG CHI TIẾT</span>}>
          <div style={{ borderRadius: '4px', overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{__html: `
              /* Bắt buộc màu chữ trong editor phải là màu đen để dễ nhìn trên nền trắng */
              .ck.ck-editor__editable_inline {
                  min-height: 500px !important;
                  padding: 30px 40px !important;
                  background-color: #ffffff !important;
                  color: #000000 !important;
              }
              .ck-content, 
              .ck-content p, 
              .ck-content h1, 
              .ck-content h2, 
              .ck-content h3, 
              .ck-content h4, 
              .ck-content li, 
              .ck-content span {
                  color: #000000 !important;
              }
              /* Toolbar styles for better visibility in dark mode */
              .ck.ck-toolbar {
                  background: #f8f9fa !important;
                  border: 1px solid #ddd !important;
              }
              .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) { 
                  border-color: #ddd !important; 
              }
            `}} />
            <CKEditor
              editor={ClassicEditor}
              config={editorConfig}
              data={content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default KnowledgeForm;

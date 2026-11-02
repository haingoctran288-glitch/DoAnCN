import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, Upload, Divider, message } from 'antd';
import { User, Camera, Mail, Phone, MapPin, Briefcase, Award, X } from 'lucide-react';
import { staffApi } from '../../api';

const { Option } = Select;

const BRANCHES = [
  'Quận 1',
  'Quận 2',
  'Quận 3',
  'Quận 7',
  'Quận 9',
  'Bình Thạnh'
];

const BASE_URL = 'http://localhost:8080';

const StaffFormModal = ({ visible, onCancel, onSave, initialValues, loading }) => {
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
        // Hiển thị ảnh hiện tại nếu đã có
        if (initialValues.avatar) {
          setPreviewUrl(
            initialValues.avatar.startsWith('http')
              ? initialValues.avatar
              : BASE_URL + initialValues.avatar
          );
        } else {
          setPreviewUrl(null);
        }
        setAvatarFile(null);
      } else {
        form.resetFields();
        setPreviewUrl(null);
        setAvatarFile(null);
      }
    }
  }, [visible, initialValues, form]);

  const handleSelectImage = (info) => {
    const file = info.file;
    // Lưu file gốc để upload sau
    setAvatarFile(file);
    // Tạo preview từ file local
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setUploading(true);

      // Nếu có file ảnh mới → upload lên server trước
      if (avatarFile) {
        try {
          const uploadRes = await staffApi.uploadAvatar(avatarFile);
          values.avatar = uploadRes.data.url; // Lưu URL thay vì Base64
        } catch (err) {
          message.error('Lỗi khi tải ảnh lên server');
          setUploading(false);
          return;
        }
      } else if (initialValues?.avatar) {
        // Giữ ảnh cũ nếu không chọn ảnh mới
        values.avatar = initialValues.avatar;
      }

      onSave(values);
      setUploading(false);
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  return (
    <Modal
      title={
        <div style={{ 
          textAlign: 'center', 
          width: '100%', 
          fontSize: 22, 
          fontWeight: 900, 
          textTransform: 'uppercase', 
          letterSpacing: 2,
          color: '#d4af37',
          marginTop: 10
        }}>
          {initialValues ? "Cập nhật hồ sơ thợ" : "Đăng ký thợ mới"}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading || uploading}
      width={750}
      okText={uploading ? "Đang tải ảnh..." : "Lưu thông tin"}
      cancelText="Hủy bỏ"
      centered
      className="premium-modal"
      closeIcon={<div style={{ 
        color: '#d4af37', 
        backgroundColor: 'rgba(212, 175, 55, 0.1)', 
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}>
        <X size={16} strokeWidth={2.5} />
      </div>}
      styles={{ 
        body: { backgroundColor: '#0d0d0d', padding: '40px' },
        header: { backgroundColor: '#0d0d0d', borderBottom: '1px solid #222', padding: '20px 24px' },
        mask: { backdropFilter: 'blur(8px)' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ isActive: true, experienceYears: 0, rating: 0 }}
      >
        {/* ===== AVATAR ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleSelectImage}
            accept="image/*"
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px dashed #d4af37',
              backgroundColor: '#111',
            }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Camera size={32} style={{ color: '#d4af37', marginBottom: 10 }} />
                <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Tải chân dung</div>
              </div>
            )}
          </Upload>
          <div style={{ marginTop: 15, color: '#d4af37', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
            Ảnh đại diện nhân sự
          </div>
        </div>

        {/* ===== THÔNG TIN CƠ BẢN ===== */}
        <Divider style={{ borderColor: '#222', color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Thông tin cơ bản</Divider>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 30px' }}>
          <Form.Item
            name="name"
            label="Tên hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input prefix={<User size={16} color="#d4af37" />} placeholder="VD: Tuấn Sang" />
          </Form.Item>

          <Form.Item
            name="specialty"
            label="Chuyên môn"
            rules={[{ required: true, message: 'Vui lòng nhập chuyên môn' }]}
          >
            <Input prefix={<Briefcase size={16} color="#d4af37" />} placeholder="Cắt tóc, Fade, Uốn..." />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input prefix={<Phone size={16} color="#d4af37" />} placeholder="09xx xxx xxx" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email công việc"
            rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input prefix={<Mail size={16} color="#d4af37" />} placeholder="nhanvien@barbershop.vn" />
          </Form.Item>
        </div>

        {/* ===== CHI NHÁNH & KINH NGHIỆM ===== */}
        <Divider style={{ borderColor: '#222', color: '#666', fontSize: 12, textTransform: 'uppercase', marginTop: 20 }}>Quản lý chi nhánh & Kinh nghiệm</Divider>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 30px' }}>
          <Form.Item
            name="branch"
            label="Chi nhánh làm việc"
            rules={[{ required: true, message: 'Chọn chi nhánh' }]}
          >
            <Select placeholder="Chọn chi nhánh">
              {BRANCHES.map(branch => (
                <Option key={branch} value={branch}>{branch}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="experienceYears"
            label="Thâm niên (Số năm)"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        {/* ===== TRẠNG THÁI ===== */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: '15px 20px', backgroundColor: '#111', borderRadius: 12, border: '1px solid #222' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Trạng thái nhân sự</span>
            <span style={{ color: '#666', fontSize: 11 }}>Bật để cho phép khách hàng đặt lịch với thợ này</span>
          </div>
          <Form.Item name="isActive" valuePropName="checked" noStyle>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.isActive !== cur.isActive}>
              {({ getFieldValue }) => (
                <Switch
                  checked={getFieldValue('isActive')}
                  onChange={(checked) => form.setFieldsValue({ isActive: checked })}
                  checkedChildren="SẴN SÀNG"
                  unCheckedChildren="TẠM NGHỈ"
                  style={{ backgroundColor: getFieldValue('isActive') ? '#52c41a' : '#ff4d4f' }}
                />
              )}
            </Form.Item>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default StaffFormModal;

import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);
      if (res.data.token) {
        const userRole = res.data.role;
        if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && userRole !== 'EMPLOYEE') {
          message.error('Tài khoản của bạn không có quyền truy cập trang quản trị!');
          return;
        }
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: res.data.id,
          username: values.username,
          fullName: res.data.fullName,
          role: userRole,
          employeeId: res.data.employeeId,
          branch: res.data.branch
        }));
        message.success('Đăng nhập thành công');
        navigate('/');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000 70%)',
    }}>
      <Card 
        style={{ width: 400, background: '#111', borderColor: '#333', boxShadow: '0 8px 32px rgba(212,175,55,0.1)' }}
        bodyStyle={{ padding: '40px 32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/images/logo.png" alt="Logo" style={{ height: 64, marginBottom: 16 }} />
          <Title level={3} style={{ color: '#fff', margin: 0, fontFamily: '"Playfair Display", serif' }}>
            HORNET <span style={{ color: '#d4af37' }}>ROYALE</span>
          </Title>
          <Text style={{ color: '#888', fontSize: 12, letterSpacing: 2 }}>ADMIN PORTAL</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item 
            name="username" 
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<User size={18} color="#d4af37" />} 
              placeholder="Tên đăng nhập" 
              style={{ background: '#000', borderColor: '#333', color: '#fff' }}
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<Lock size={18} color="#d4af37" />} 
              placeholder="Mật khẩu" 
              style={{ background: '#000', borderColor: '#333', color: '#fff' }}
            />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={loading}
            style={{ marginTop: 16, background: '#d4af37', color: '#000', fontWeight: 'bold' }}
          >
            ĐĂNG NHẬP
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

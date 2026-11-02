import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Avatar, Typography, Spin, Alert, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Scissors, DollarSign, Calendar, Mail, ShoppingBag, Trophy, Star } from 'lucide-react';
import { customerApi } from '../api';

const { Title, Text } = Typography;

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  return `http://localhost:8080${avatar}`;
};

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await customerApi.getById(id);
        setCustomer(res.data);
      } catch {
        setError('Không tìm thấy khách hàng!');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert message={error} type="error" showIcon />
        <Button onClick={() => navigate('/customers')} style={{ marginTop: 16 }}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/customers')}
          style={{
            background: 'transparent',
            border: '1px solid #d4af37',
            color: '#d4af37',
          }}
        >
          Quay lại
        </Button>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Hồ Sơ Khách Hàng Cao Cấp
        </Title>
      </div>

      <Spin spinning={loading}>
        {customer && (
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {/* TOP PROFILE HEADER */}
            <Card 
              bordered={false} 
              style={{ 
                marginBottom: 24, 
                background: 'linear-gradient(145deg, #111, #1a1a1a)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              bodyStyle={{ padding: '40px 24px', textAlign: 'center' }}
            >
              <Avatar
                size={140}
                src={getAvatarUrl(customer.avatar)}
                icon={!customer.avatar && <User size={64} />}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '3px solid #d4af37',
                  color: '#d4af37',
                  boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
                  marginBottom: 24
                }}
              />
              <Title level={2} style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '32px' }}>
                {customer.name || 'N/A'}
              </Title>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, marginBottom: 24 }}>
                <Trophy size={16} color="#d4af37" />
                <span style={{ color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {customer.tier || 'Khách Mới'}
                </span>
              </div>

              <Row gutter={[24, 24]} justify="center" style={{ maxWidth: 800, margin: '0 auto' }}>
                <Col xs={12} sm={8}>
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Mail size={20} color="#a0a0a0" style={{ marginBottom: 8 }} />
                    <div style={{ color: '#a0a0a0', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{customer.email || '—'}</div>
                  </div>
                </Col>
                <Col xs={12} sm={8}>
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Calendar size={20} color="#a0a0a0" style={{ marginBottom: 8 }} />
                    <div style={{ color: '#a0a0a0', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>Ngày Tham Gia</div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{customer.createdAt}</div>
                  </div>
                </Col>
                <Col xs={12} sm={8}>
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Star size={20} color="#a0a0a0" style={{ marginBottom: 8 }} />
                    <div style={{ color: '#a0a0a0', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>Lần Đến Cuối</div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{customer.lastVisit}</div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* SPENDING STATISTICS */}
            <Title level={4} style={{ color: '#fff', marginBottom: 24, textAlign: 'center' }}>
              THỐNG KÊ CHI TIÊU
            </Title>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  style={{
                    background: 'linear-gradient(135deg, #1f1c0b, #111)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 16,
                    height: '100%',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover-glow-card"
                  bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <DollarSign size={32} color="#d4af37" />
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Tổng Tất Cả</div>
                  <div style={{ color: '#d4af37', fontSize: 28, fontWeight: '900' }}>
                    {Number(customer.totalSpent || 0).toLocaleString('vi-VN')} ₫
                  </div>
                  <div style={{ marginTop: 12, color: '#666', fontSize: 12 }}>
                    Bao gồm cả dịch vụ và sản phẩm
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 16,
                    height: '100%',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover-glow-card"
                  bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid #444' }}>
                    <Scissors size={32} color="#fff" />
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Đã Chi Cho Dịch Vụ</div>
                  <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                    {Number(customer.serviceSpent || 0).toLocaleString('vi-VN')} ₫
                  </div>
                  <div style={{ marginTop: 12, color: '#52c41a', fontSize: 14, fontWeight: 'bold' }}>
                    {customer.bookingCount || 0} lần sử dụng
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 16,
                    height: '100%',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover-glow-card"
                  bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid #444' }}>
                    <ShoppingBag size={32} color="#fff" />
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Đã Chi Cho Sản Phẩm</div>
                  <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                    {Number(customer.productSpent || 0).toLocaleString('vi-VN')} ₫
                  </div>
                  <div style={{ marginTop: 12, color: '#666', fontSize: 12 }}>
                    Từ các đơn hàng hoàn thành
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Spin>

      <style>{`
        .hover-glow-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15) !important;
          border-color: rgba(212, 175, 55, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default CustomerDetail;

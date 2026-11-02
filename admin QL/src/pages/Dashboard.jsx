import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Select } from 'antd';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, Label
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Scissors, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const COLORS = ['#d4af37', '#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState('Tất cả chi nhánh');
  const [timeRange, setTimeRange] = useState('7days'); // today, 7days, this_month, this_year

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'ADMIN';

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // If user is EDITOR, force branch to their branch
      const targetBranch = userRole === 'EDITOR' ? user.branch : branch;
      const res = await axios.get(`http://localhost:8080/api/dashboard`, {
        params: { branch: targetBranch, timeRange }
      });
      setData(res.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [branch, timeRange, userRole]);

  if (loading && !data) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>;
  }

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  const { revenue = {}, completedOrders = {}, newCustomers = 0, retentionRate = 0, revenueChart = [], popularServices = [], popularProducts = [], topStaff = [], revenueByBranch = [], paymentMethods = [], orderStats = [] } = data || {};

  const translateStatus = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'DELIVERED':
        return 'Hoàn thành dịch vụ';
      case 'PAID': return 'Đã thanh toán';
      case 'PENDING': return 'Chờ xử lý';
      case 'CANCELLED': return 'Đã huỷ';
      case 'REFUNDED': return 'Đã hoàn tiền';
      case 'PROCESSING': return 'Đang xử lý';
      case 'SHIPPING': return 'Đang giao hàng';
      default: return status;
    }
  };

  const statusMap = {};
  (orderStats || []).forEach(s => {
    const translatedName = translateStatus(s.name);
    statusMap[translatedName] = (statusMap[translatedName] || 0) + (s.value || 0);
  });
  const mappedOrderStats = Object.keys(statusMap).map(key => ({
    name: key,
    value: statusMap[key]
  }));

  const getStatusColor = (name) => {
    const n = name?.toUpperCase();
    if (n === 'HOÀN THÀNH DỊCH VỤ') return '#10b981'; // Green
    if (n === 'ĐÃ HUỶ') return '#ef4444'; // Red
    if (n === 'ĐÃ THANH TOÁN') return '#3b82f6'; // Blue
    if (n === 'CHỜ XỬ LÝ') return '#f59e0b'; // Orange
    if (n === 'ĐÃ HOÀN TIỀN') return '#8b5cf6'; // Purple
    if (n === 'ĐANG XỬ LÝ' || n === 'ĐANG GIAO HÀNG') return '#d4af37'; // Gold
    return '#a0a0a0'; // Gray
  };

  const getPaymentColor = (name) => {
    const n = name?.toUpperCase();
    if (n === 'MOMO') return '#ec4899';
    if (n === 'VNPAY') return '#3b82f6';
    if (n === 'COD' || n === 'CASH' || n === 'TIỀN MẶT') return '#10b981';
    return '#d4af37';
  };

  const mappedPaymentMethods = (paymentMethods || []).map(p => {
    let name = p.name;
    const n = name?.toUpperCase();
    if (n === 'COD' || n === 'CASH' || n === 'KHÁC' || n === 'NULL') {
      name = 'Tiền mặt';
    }
    return { ...p, name };
  });

  // Parse revenue chart to fix decimals if needed and format dates
  const formattedRevenueChart = revenueChart.map(item => {
    let formattedName = item.name;
    // Check if name is YYYY-MM-DD format using a simple regex
    if (/^\d{4}-\d{2}-\d{2}$/.test(formattedName)) {
      const [year, month, day] = formattedName.split('-');
      formattedName = `${day}/${month}/${year}`;
    }
    
    return {
      ...item,
      name: formattedName,
      service: Number(item.service || 0),
      product: Number(item.product || 0),
      total: Number(item.total || 0)
    };
  });

  const revTypeData = [
    { name: 'Dịch vụ', value: Number(revenue.service || 0) },
    { name: 'Sản phẩm', value: Number(revenue.product || 0) }
  ];

  return (
    <div style={{ padding: '24px', background: '#0a0a0a', minHeight: '100vh' }}>

      {/* Header & Filters */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ color: '#d4af37', margin: 0, fontWeight: 800 }}>Dashboard</Title>
          <p style={{ color: '#a0a0a0', marginTop: 4 }}>Tổng quan hoạt động kinh doanh (Dữ liệu thực tế)</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {(userRole === 'ADMIN') && (
            <Select
              value={branch}
              onChange={setBranch}
              style={{ width: 180 }}
              popupMatchSelectWidth={false}
              className="dark-select"
            >
              <Option value="Tất cả chi nhánh">Tất cả chi nhánh</Option>
              <Option value="Quận 1">Quận 1</Option>
              <Option value="Quận 2">Quận 2</Option>
              <Option value="Quận 3">Quận 3</Option>
              <Option value="Quận 7">Quận 7</Option>
              <Option value="Gò Vấp">Gò Vấp</Option>
            </Select>
          )}

          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 160 }}
            popupMatchSelectWidth={false}
            className="dark-select"
          >
            <Option value="today">Hôm nay</Option>
            <Option value="7days">7 ngày gần nhất</Option>
            <Option value="this_month">Tháng này</Option>
            <Option value="this_year">Năm nay</Option>
          </Select>
        </div>
      </div>

      <style>{`
        .dark-select .ant-select-selector { background-color: #1a1a1a !important; border-color: #2a2a2a !important; color: #fff !important; }
        .dark-select .ant-select-arrow { color: #d4af37 !important; }
        .dark-select-dropdown { background-color: #1a1a1a !important; border: 1px solid #2a2a2a; }
        .dark-select-dropdown .ant-select-item { color: #a0a0a0 !important; }
        .dark-select-dropdown .ant-select-item-option-selected, .dark-select-dropdown .ant-select-item-option-active { background-color: #2a2a2a !important; color: #d4af37 !important; }
        .card-title { color: #fff; font-size: 15px; font-weight: 700; display: flex; alignItems: center; gap: 8px; }
      `}</style>

      {/* Row 1: KPI Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24, display: 'flex' }}>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card styles={{ body: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' } }} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, width: '100%', minHeight: 180 }}>
            <Statistic
              title={<span style={{ color: '#a0a0a0' }}>Tổng Doanh Thu</span>}
              value={revenue.total || 0}
              formatter={v => new Intl.NumberFormat('vi-VN').format(v)}
              prefix={<DollarSign size={20} color="#d4af37" />}
              suffix="₫"
              styles={{ content: { color: '#fff', fontWeight: '900', fontSize: '24px' } }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, borderTop: '1px solid #222', paddingTop: 8 }}>
              <div style={{ fontSize: 11, color: '#888' }}>Dịch vụ: <span style={{ color: '#ccc' }}>{formatMoney(revenue.service)}</span></div>
              <div style={{ fontSize: 11, color: '#888' }}>SP: <span style={{ color: '#ccc' }}>{formatMoney(revenue.product)}</span></div>
            </div>
            {revenue.trend !== undefined && (
              <div style={{ color: revenue.trend >= 0 ? '#52c41a' : '#ef4444', marginTop: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                {revenue.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {revenue.trend >= 0 ? '+' : ''}{revenue.trend}% so với kỳ trước
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card styles={{ body: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' } }} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, width: '100%', minHeight: 180 }}>
            <Statistic
              title={<span style={{ color: '#a0a0a0' }}>Đơn Hoàn Thành</span>}
              value={completedOrders.total || 0}
              prefix={<Scissors size={20} color="#d4af37" />}
              styles={{ content: { color: '#fff', fontWeight: '900', fontSize: '24px' } }}
            />
            <div style={{ color: '#a0a0a0', marginTop: 12, fontSize: 12, borderTop: '1px solid #222', paddingTop: 8 }}>
              Chỉ tính các đơn hàng đã thanh toán/hoàn tất.
            </div>
            {completedOrders.trend !== undefined && (
              <div style={{ color: completedOrders.trend >= 0 ? '#52c41a' : '#ef4444', marginTop: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                {completedOrders.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {completedOrders.trend >= 0 ? '+' : ''}{completedOrders.trend}% so với kỳ trước
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card styles={{ body: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' } }} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, width: '100%', minHeight: 180 }}>
            <Statistic
              title={<span style={{ color: '#a0a0a0' }}>Khách Hàng Mới</span>}
              value={newCustomers}
              prefix={<Users size={20} color="#d4af37" />}
              styles={{ content: { color: '#fff', fontWeight: '900', fontSize: '24px' } }}
            />
            <div style={{ color: '#a0a0a0', marginTop: 12, fontSize: 12, borderTop: '1px solid #222', paddingTop: 8 }}>
              Khách hàng mới tạo tài khoản trong kỳ.
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card styles={{ body: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' } }} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, width: '100%', minHeight: 180 }}>
            <Statistic
              title={<span style={{ color: '#a0a0a0' }}>Tỉ lệ quay lại</span>}
              value={retentionRate}
              suffix="%"
              prefix={<Activity size={20} color="#d4af37" />}
              styles={{ content: { color: '#fff', fontWeight: '900', fontSize: '24px' } }}
            />
            <div style={{ color: '#a0a0a0', marginTop: 12, fontSize: 12, borderTop: '1px solid #222', paddingTop: 8 }}>
              (Số khách có ≥ 2 đơn / Tổng số khách) * 100
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 2: Charts */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14 }}>
            <div className="card-title" style={{ marginBottom: 20 }}>Biểu Đồ Doanh Thu</div>
            <div style={{ width: '100%', height: 350, minHeight: 350 }}>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={formattedRevenueChart} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 12 }} />
                  <YAxis stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 12 }} tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#d4af37', fontWeight: 'bold' }}
                    formatter={(value, name) => [formatMoney(value), name]}
                    labelStyle={{ color: '#888', marginBottom: 5 }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Area type="monotone" name="Tổng" dataKey="total" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area type="monotone" name="Dịch vụ" dataKey="service" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                  <Area type="monotone" name="Sản phẩm" dataKey="product" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14 }}>
            <div className="card-title" style={{ marginBottom: 20 }}>Doanh Thu Theo Loại</div>
            <div style={{ width: '100%', height: 350, minHeight: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={revTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {revTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#d4af37' : '#3b82f6'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatMoney(value)}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Top Services & Products */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14 }}>
            <div className="card-title" style={{ marginBottom: 20 }}>Dịch Vụ Phổ Biến (Top 10)</div>
            <div style={{ width: '100%', height: 300, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularServices} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#a0a0a0" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 11 }} width={100} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    formatter={(value, name) => [name === 'count' ? `${value} lượt` : formatMoney(value), name === 'count' ? 'Số lượt' : 'Doanh thu']}
                  />
                  <Bar name="count" dataKey="count" fill="#d4af37" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14 }}>
            <div className="card-title" style={{ marginBottom: 20 }}>Sản Phẩm Bán Chạy (Top 10)</div>
            <div style={{ width: '100%', height: 300, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularProducts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#a0a0a0" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 11 }} width={100} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    formatter={(value, name) => [name === 'count' ? `${value} SP` : formatMoney(value), name === 'count' ? 'Đã bán' : 'Doanh thu']}
                  />
                  <Bar name="count" dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 4: Top Staff & Stats */}
      <Row gutter={[24, 24]} style={{ display: 'flex', alignItems: 'stretch' }}>
        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <Card style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, width: '100%', display: 'flex', flexDirection: 'column' }} styles={{ body: { flex: 1 } }}>
            <div className="card-title" style={{ marginBottom: 20 }}>Top Nhân Viên (Hoàn Thành Nhiều Nhất)</div>
            {topStaff && topStaff.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {topStaff.map((staff, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#1a1a1a', borderRadius: 10, border: '1px solid #222' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 'bold' }}>
                        {staff.avatar ? <img src={staff.avatar.startsWith('http') ? staff.avatar : `http://localhost:8080${staff.avatar}`} alt="ava" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : (idx + 1)}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{staff.name}</div>
                        <div style={{ color: '#888', fontSize: 11 }}>{staff.branch}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#d4af37', fontWeight: 'bold', fontSize: 15 }}>{staff.count} đơn</div>
                      <div style={{ color: '#ccc', fontSize: 12 }}>{formatMoney(staff.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>Không có dữ liệu</div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <Card style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, width: '100%', display: 'flex', flexDirection: 'column' }} styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}>
            <div className="card-title" style={{ marginBottom: 20 }}>Trạng Thái Đơn Hàng (Tất Cả)</div>
            <div style={{ width: '100%', flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mappedOrderStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#555' }}
                    stroke="none"
                  >
                    {mappedOrderStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    formatter={(value) => `${value} đơn`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 5: Payment & Branch */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, minHeight: 380 }}>
            <div className="card-title" style={{ marginBottom: 20 }}>Phương Thức Thanh Toán (Hoàn Thành)</div>
            <div style={{ width: '100%', height: 300, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mappedPaymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    stroke="none"
                  >
                    {mappedPaymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getPaymentColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    formatter={(value) => formatMoney(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {userRole === 'ADMIN' && (
          <Col xs={24} lg={12}>
            <Card style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, minHeight: 380 }}>
              <div className="card-title" style={{ marginBottom: 20 }}>Doanh Thu Theo Chi Nhánh</div>
              <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByBranch} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#a0a0a0" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#a0a0a0" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      formatter={(value) => formatMoney(value)}
                    />
                    <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {revenueByBranch.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        )}
      </Row>

    </div>
  );
};

export default Dashboard;

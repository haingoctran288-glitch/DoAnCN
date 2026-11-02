import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NotificationDropdown from '../components/layout/NotificationDropdown';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  Scissors, 
  UserSquare2,
  Bell,
  LogOut,
  User,
  Package,
  ShoppingCart,
  Menu as MenuIcon,
  ShieldAlert,
  Ticket,
  Percent,
  Newspaper,
  MessageSquare,
  Banknote
} from 'lucide-react';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({ fullName: 'Admin Boss', role: 'ADMIN' });

  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setCurrentUser(u);
        if (u.role === 'EMPLOYEE' && location.pathname === '/') {
          navigate('/work-schedule');
        }
        if (u.role === 'EDITOR' && location.pathname === '/') {
          navigate('/bookings');
        }
      }
    };
    
    loadUser(); // Load on mount
    
    // Listen for cross-component updates
    window.addEventListener('userUpdated', loadUser);
    return () => window.removeEventListener('userUpdated', loadUser);
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  let menuItems = [];

  if (currentUser.role === 'ADMIN') {
    menuItems = [
      { key: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { 
        key: 'grp-booking', 
        icon: <CalendarClock size={20} />, 
        label: 'Quản lý Đặt lịch',
        children: [
          { key: '/bookings', label: 'Quản lý lịch hẹn' },
          { key: '/work-schedule', label: 'Lịch làm việc NV' },
          { key: '/staff-leave', label: 'Lịch nghỉ NV' },
        ]
      },
      { 
        key: 'grp-store', 
        icon: <ShoppingCart size={20} />, 
        label: 'Cửa hàng & Kinh doanh',
        children: [
          { key: '/services', label: 'Dịch vụ' },
          { key: '/products', label: 'Sản phẩm' },
          { key: '/orders', label: 'Đơn hàng' },
          { key: '/vouchers', label: 'Quản lý Voucher' },
        ]
      },
      { 
        key: 'grp-crm', 
        icon: <Users size={20} />, 
        label: 'Khách hàng & Chăm sóc',
        children: [
          { key: '/customers', label: 'Danh sách Khách hàng' },
          { key: '/chats', label: 'Chat với khách' },
          { key: '/owner-chat', label: 'Tin nhắn liên hệ' },
        ]
      },
      { 
        key: 'grp-media', 
        icon: <Newspaper size={20} />, 
        label: 'Truyền thông & Bài viết',
        children: [
          { key: '/news', label: 'Quản lý Tin tức' },
          { key: '/knowledge', label: 'Kiến thức / Cẩm nang' },
        ]
      },
      { 
        key: 'grp-hr', 
        icon: <UserSquare2 size={20} />, 
        label: 'Nhân sự & Tiền lương',
        children: [
          { key: '/staff', label: 'Danh sách Nhân viên' },
          { key: '/payroll/dashboard', label: 'Bảng lương nhân viên' },
          { key: '/payroll/settings', label: 'Cài đặt lương' },
          { key: '/payroll/advance', label: 'Quản lý Ứng lương' },
          { key: '/payroll/penalty', label: 'Quản lý Vi phạm' },
        ]
      },
      { 
        key: 'grp-system', 
        icon: <ShieldAlert size={20} />, 
        label: 'Hệ thống',
        children: [
          { key: '/admin-accounts', label: 'Tài khoản quản lý' },
        ]
      }
    ];
  } else if (currentUser.role === 'EDITOR') {
    menuItems = [
      { 
        key: 'grp-booking-editor', 
        icon: <CalendarClock size={20} />, 
        label: 'Quản lý Đặt lịch',
        children: [
          { key: '/bookings', label: 'Quản lý lịch hẹn' },
          { key: '/work-schedule', label: 'Lịch làm việc NV' },
          { key: '/staff-leave', label: 'Lịch nghỉ NV' },
        ]
      },
      { 
        key: 'grp-store-editor', 
        icon: <ShoppingCart size={20} />, 
        label: 'Cửa hàng & Kinh doanh',
        children: [
          { key: '/services', label: 'Dịch vụ' },
          { key: '/products', label: 'Sản phẩm' },
          { key: '/orders', label: 'Đơn hàng' },
        ]
      },
      { 
        key: 'grp-crm-editor', 
        icon: <Users size={20} />, 
        label: 'Khách hàng & Chăm sóc',
        children: [
          { key: '/customers', label: 'Danh sách Khách hàng' },
          { key: '/chats', label: 'Chat với khách' },
        ]
      }
    ];
  } else if (currentUser.role === 'EMPLOYEE') {
    menuItems = [
      { key: '/work-schedule', icon: <CalendarClock size={20} />, label: 'Lịch làm việc' },
      { key: '/staff-leave', icon: <UserSquare2 size={20} />, label: 'Lịch nghỉ' },
      { key: '/chats', icon: <MessageSquare size={20} />, label: 'Chat với khách' },
    ];
  }

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogOut size={16} />,
        label: 'Đăng xuất',
        onClick: handleLogout
      }
    ]
  };

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null}
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        className="admin-sidebar"
        width={260}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, height: '100vh', zIndex: 100, overflowY: 'auto', overflowX: 'hidden' }}
      >
        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!collapsed && (
            <img src="/images/logo.png" alt="Hornet Royale Logo" style={{ height: '64px', marginBottom: '16px', objectFit: 'contain', mixBlendMode: 'screen', filter: 'brightness(1.1) drop-shadow(0 0 12px rgba(212,175,55,0.4))' }} />
          )}
          {collapsed && (
            <img src="/images/logo.png" alt="Hornet Royale Logo" style={{ height: '42px', marginBottom: '8px', objectFit: 'contain', mixBlendMode: 'screen', filter: 'brightness(1.1)' }} />
          )}
          {!collapsed && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: '18px', fontWeight: '900', letterSpacing: '2px', fontFamily: '"Playfair Display", serif' }}>
                HORNET <span style={{ color: '#d4af37' }}>ROYALE</span>
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '11px', marginTop: '6px', letterSpacing: '3px', fontWeight: '500' }}>
                ADMIN PANEL
              </div>
            </div>
          )}
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 0 : 260, transition: 'margin-left 0.2s', minHeight: '100vh' }}>
        <Header className="admin-header" style={{ position: 'sticky', top: 0, zIndex: 99, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
          <div>
            <div 
              onClick={() => setCollapsed(!collapsed)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                background: '#1a1a1a',
                border: '1px solid #d4af37',
                borderRadius: '8px',
                color: '#fff',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = '#2a2a2a'; 
                e.currentTarget.style.color = '#d4af37'; 
                e.currentTarget.style.boxShadow = '0 0 10px rgba(212,175,55,0.2)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = '#1a1a1a'; 
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <MenuIcon size={20} />
            </div>
          </div>
          <Space size="large" align="center">
            <NotificationDropdown />
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer', padding: '0 8px' }} align="center">
                <Avatar style={{ backgroundColor: '#d4af37' }} icon={<User size={16} />} />
                <span style={{ color: '#fff', fontWeight: 500 }}>{currentUser.fullName} <span style={{ color: '#d4af37', fontSize: '11px' }}>({currentUser.role})</span></span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Services from './pages/Services';
import Staff from './pages/Staff';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Login from './pages/Login';
import AdminAccounts from './pages/AdminAccounts';
import Vouchers from './pages/Vouchers';
import News from './pages/News';
import KnowledgeList from './pages/KnowledgeList';
import KnowledgeForm from './pages/KnowledgeForm';
import WorkSchedule from './pages/WorkSchedule';
import CustomerChats from './pages/CustomerChats';
import SalarySettings from './pages/payroll/SalarySettings';
import AdvanceSalary from './pages/payroll/AdvanceSalary';
import Penalty from './pages/payroll/Penalty';
import PayrollDashboard from './pages/payroll/PayrollDashboard';
import StaffLeaveList from './pages/StaffLeaveList';
import OwnerChat from './pages/OwnerChat';

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (user.role !== 'ADMIN' && user.role !== 'EDITOR' && user.role !== 'EMPLOYEE') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [token, user.role, navigate]);

  return (token && (user.role === 'ADMIN' || user.role === 'EDITOR' || user.role === 'EMPLOYEE')) ? children : null;
};

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (user.role !== 'ADMIN') {
      navigate('/'); // Or show a 403 Forbidden page, but redirect is safer
    }
  }, [token, user.role, navigate]);

  return (token && user.role === 'ADMIN') ? children : null;
};

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#d4af37',
          colorBgBase: '#000000',
          colorBgContainer: '#242424',
          colorBgElevated: '#242424',
          colorTextBase: '#ffffff',
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
          borderRadius: 8,
          wireframe: false,
        },
        components: {
          Card: {
            colorBgContainer: '#242424',
          },
          Table: {
            colorBgContainer: '#242424',
            colorHeaderBg: '#1a1a1a',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: 'rgba(212, 175, 55, 0.15)',
            itemSelectedColor: '#d4af37',
            itemHoverColor: '#d4af37',
          }
        }
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="chats" element={<CustomerChats />} />
              <Route path="services" element={<Services />} />
              <Route path="staff" element={<Staff />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="admin-accounts" element={<AdminAccounts />} />
              <Route path="vouchers" element={<Vouchers />} />
              <Route path="news" element={<AdminRoute><News /></AdminRoute>} />
              <Route path="knowledge" element={<AdminRoute><KnowledgeList /></AdminRoute>} />
              <Route path="knowledge/create" element={<AdminRoute><KnowledgeForm /></AdminRoute>} />
              <Route path="knowledge/edit/:id" element={<AdminRoute><KnowledgeForm /></AdminRoute>} />
              <Route path="work-schedule" element={<WorkSchedule />} />
              
              <Route path="payroll/settings" element={<AdminRoute><SalarySettings /></AdminRoute>} />
              <Route path="payroll/advance" element={<AdminRoute><AdvanceSalary /></AdminRoute>} />
              <Route path="payroll/penalty" element={<AdminRoute><Penalty /></AdminRoute>} />
              <Route path="payroll/dashboard" element={<AdminRoute><PayrollDashboard /></AdminRoute>} />
              <Route path="staff-leave" element={<StaffLeaveList />} />
              <Route path="owner-chat" element={<AdminRoute><OwnerChat /></AdminRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;

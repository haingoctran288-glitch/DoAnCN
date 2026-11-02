import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Button, message, notification } from 'antd';
import { PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import { staffApi } from '../api';
import StaffTable from '../components/staff/StaffTable';
import StaffFilters from '../components/staff/StaffFilters';
import StaffFormModal from '../components/staff/StaffFormModal';
import StaffPagination from '../components/staff/StaffPagination';
import AdminReviewModal from '../components/AdminReviewModal';

const { Title } = Typography;

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewStaff, setReviewStaff] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch staff list
  const fetchStaff = async () => {
    setLoading(true);
    try {
      let branchParam = undefined;
      if (user.role === 'EDITOR' && user.branch) {
        const branchMap = {
          'CN 1': 'Quận 1',
          'CN 2': 'Quận 2',
          'CN 3': 'Quận 3',
          'CN 7': 'Quận 7',
          'CN 9': 'Quận 9',
          'CN BT': 'Bình Thạnh'
        };
        branchParam = branchMap[user.branch] || user.branch;
      }
      const params = branchParam ? { branch: branchParam } : {};
      const response = await staffApi.getAll(params);
      setStaffList(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách nhân viên');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filtered & Searched Data
  const filteredData = useMemo(() => {
    return staffList.filter(item => {
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone?.includes(searchQuery);
      
      const matchesBranch = branchFilter === 'all' || item.branch === branchFilter;
      
      return matchesSearch && matchesBranch;
    });
  }, [staffList, searchQuery, branchFilter]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination]);

  // Handlers
  const handleAdd = () => {
    setEditingStaff(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingStaff(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const staffToDelete = staffList.find(s => s.id === id);
    try {
      await staffApi.delete(id);
      notification.open({
        message: 'ĐÃ XÓA NHÂN VIÊN',
        description: `Nhân viên "${staffToDelete?.name || ''}" đã được xóa khỏi hệ thống.`,
        icon: <Trash2 color="#ff4d4f" size={24} />,
        style: {
          backgroundColor: '#fff1f0',
          border: '1px solid #ffa39e',
        },
      });
      fetchStaff();
    } catch (error) {
      message.error('Lỗi khi xóa nhân viên');
    }
  };

  const handleSave = async (values) => {
    setModalLoading(true);
    try {
      if (editingStaff) {
        await staffApi.update(editingStaff.id, values);
        notification.success({
          message: 'CẬP NHẬT THÀNH CÔNG',
          description: `Thông tin nhân viên "${values.name}" đã được cập nhật thành công.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      } else {
        await staffApi.create(values);
        notification.success({
          message: 'THÊM THÀNH CÔNG',
          description: `Nhân viên mới "${values.name}" đã được thêm vào hệ thống.`,
          icon: <CheckCircle color="#52c41a" size={24} />,
          style: {
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          },
        });
      }
      setModalVisible(false);
      fetchStaff();
    } catch (error) {
      message.error('Lỗi khi lưu thông tin');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="staff-page animate-fade-in">
      <div style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
            Hệ Thống <span style={{ color: '#d4af37' }}>Nhân Sự</span>
          </Title>
          <p style={{ color: '#666', marginTop: 4, fontWeight: 500 }}>Quản lý đội ngũ thợ cắt chuyên nghiệp trên toàn hệ thống</p>
        </div>
        {user.role !== 'EDITOR' && (
          <Button 
            type="primary" 
            icon={<PlusCircle size={18} />} 
            onClick={handleAdd}
            style={{ 
              backgroundColor: '#d4af37', 
              color: '#000', 
              fontWeight: 'bold', 
              borderColor: '#d4af37',
              height: 44,
              padding: '0 24px',
              borderRadius: 12,
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
            }}
          >
            THÊM NHÂN VIÊN
          </Button>
        )}
      </div>

      <StaffFilters 
        onSearch={setSearchQuery} 
        onFilterBranch={setBranchFilter} 
      />

      <div style={{ marginTop: 24 }}>
        <StaffTable 
          data={paginatedData} 
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onViewReview={(record) => {
            setReviewStaff(record);
            setReviewModalVisible(true);
          }}
          isEditor={user.role === 'EDITOR'}
        />
      </div>

      <StaffPagination 
        current={pagination.current}
        total={filteredData.length}
        pageSize={pagination.pageSize}
        onChange={(page) => setPagination(prev => ({ ...prev, current: page }))}
      />

      <StaffFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={editingStaff}
        loading={modalLoading}
      />

      <AdminReviewModal
        isOpen={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        type="barber"
        itemId={reviewStaff?.id}
        itemName={reviewStaff?.name}
      />
    </div>
  );
};

export default Staff;

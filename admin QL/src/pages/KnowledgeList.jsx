import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Input, Select, Space, Tag, 
  Popconfirm, message, Typography, Row, Col, DatePicker 
} from 'antd';
import { 
  Search, Plus, Edit, Trash2, RotateCcw, Eye, 
  CheckCircle, XCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const KnowledgeList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    keyword: '',
    category: 'Tất cả',
    status: 'Tất cả',
    sort: 'Mới nhất',
    page: 0,
    size: 10
  });

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        keyword: filters.keyword,
        category: filters.category,
        status: filters.status,
        sort: filters.sort,
        page: filters.page,
        size: filters.size
      });
      
      const response = await fetch(`http://localhost:8080/api/admin/knowledge?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
      
      const result = await response.json();
      setData(result.content);
      setTotal(result.totalElements);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, [filters.page, filters.size, filters.category, filters.status, filters.sort]);

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, keyword: value, page: 0 }));
    // fetchKnowledge is not in dependency array for keyword to avoid fetching on every keystroke
    // but we can trigger it here manually since the state update is async
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchKnowledge();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters.keyword]);

  const handleReset = () => {
    setFilters({
      keyword: '',
      category: 'Tất cả',
      status: 'Tất cả',
      sort: 'Mới nhất',
      page: 0,
      size: 10
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/admin/knowledge/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Xóa thất bại');
      message.success('Đã xóa bài viết');
      fetchKnowledge();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Hiển thị' ? 'Ẩn' : 'Hiển thị';
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/admin/knowledge/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      message.success(`Đã đổi trạng thái thành ${newStatus}`);
      fetchKnowledge();
    } catch (error) {
      message.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'thumbnailImage',
      key: 'thumbnailImage',
      width: 100,
      render: (img) => (
        <div style={{
          width: 80, height: 60, borderRadius: 8, overflow: 'hidden',
          background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {img ? <img src={`http://localhost:8080${img}`} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Text type="secondary">No Image</Text>}
        </div>
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong style={{ color: '#d4af37' }}>{text}</Text>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      render: (views) => <Tag color="purple">{views} views</Tag>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => <Text type="secondary">{formatDate(date)}</Text>
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      width: 120,
      render: (status, record) => (
        <Popconfirm
          title={`Đổi thành ${status === 'Hiển thị' ? 'Ẩn' : 'Hiển thị'}?`}
          onConfirm={() => handleStatusChange(record.id, status)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Tag 
            color={status === 'Hiển thị' ? 'success' : 'default'}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}
          >
            {status === 'Hiển thị' ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {status}
          </Tag>
        </Popconfirm>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<Eye size={18} />} 
            onClick={() => window.open(`http://localhost:5173/kienthuc/${record.slug}`, '_blank')}
            title="Xem bài viết trên Storefront"
          />
          <Button 
            type="text" 
            icon={<Edit size={18} className="text-blue-500" />} 
            onClick={() => navigate(`/knowledge/edit/${record.id}`)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<Trash2 size={18} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} style={{ margin: 0, color: '#d4af37' }}>Kiến Thức & Cẩm Nang</Title>
          <Text type="secondary">Quản lý các bài viết trên Storefront</Text>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          style={{ background: '#d4af37', borderColor: '#d4af37' }}
          onClick={() => navigate('/knowledge/create')}
        >
          Thêm Bài Viết
        </Button>
      </div>

      <Card bordered={false} className="mb-6 bg-[#242424]">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm theo tiêu đề..."
              prefix={<Search size={16} className="text-gray-400" />}
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              allowClear
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              style={{ width: '100%' }}
              value={filters.category}
              onChange={(val) => setFilters(prev => ({ ...prev, category: val, page: 0 }))}
            >
              <Option value="Tất cả">Tất cả danh mục</Option>
              <Option value="Dịch vụ Nam">Dịch vụ Nam</Option>
              <Option value="Dịch vụ Nữ">Dịch vụ Nữ</Option>
              <Option value="Sản phẩm">Sản phẩm</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(val) => setFilters(prev => ({ ...prev, status: val, page: 0 }))}
            >
              <Option value="Tất cả">Tất cả trạng thái</Option>
              <Option value="Hiển thị">Hiển thị</Option>
              <Option value="Ẩn">Ẩn</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              style={{ width: '100%' }}
              value={filters.sort}
              onChange={(val) => setFilters(prev => ({ ...prev, sort: val, page: 0 }))}
            >
              <Option value="Mới nhất">Mới nhất</Option>
              <Option value="Cũ nhất">Cũ nhất</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button icon={<RotateCcw size={16} />} onClick={handleReset} block>
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} className="bg-[#242424]">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          loading={loading}
          pagination={{
            current: filters.page + 1,
            pageSize: filters.size,
            total: total,
            onChange: (page, pageSize) => setFilters(prev => ({ ...prev, page: page - 1, size: pageSize })),
            showSizeChanger: false
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default KnowledgeList;

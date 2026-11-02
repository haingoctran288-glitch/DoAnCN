import React, { useState, useEffect } from 'react';
import {
  Table, Button, Tag, Space, Modal, Form, Select, DatePicker,
  Input, Switch, Popconfirm, Typography, Row, Col, Card, Statistic, Badge, Tooltip, App
} from 'antd';
import {
  PlusOutlined, EyeOutlined, DeleteOutlined, CalendarOutlined,
  UserOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
  ClockCircleOutlined, WarningOutlined, SearchOutlined, SwapRightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import StaffLeavePreviewModal from './StaffLeavePreviewModal';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const API = 'http://localhost:8080';

const LEAVE_TYPE_LABELS = {
  ANNUAL_LEAVE: 'Nghỉ phép năm',
  SICK_LEAVE: 'Nghỉ ốm',
  PERSONAL: 'Việc cá nhân',
  OTHER: 'Lý do khác',
};

const LEAVE_TYPE_COLORS = {
  ANNUAL_LEAVE: '#3b82f6',
  SICK_LEAVE: '#ef4444',
  PERSONAL: '#8b5cf6',
  OTHER: '#6b7280',
};

const STATUS_CONFIG = {
  ACTIVE: { label: 'Đang nghỉ', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: <ClockCircleOutlined /> },
  FINISHED: { label: 'Đã kết thúc', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircleOutlined /> },
  CANCELLED: { label: 'Đã hủy', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)', icon: <DeleteOutlined /> },
};

export default function StaffLeaveList() {
  const { message } = App.useApp();
  const [leaves, setLeaves] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStaff, setFilterStaff] = useState('');

  // Form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedLeaveType, setSelectedLeaveType] = useState('ANNUAL_LEAVE');
  const [isUnplanned, setIsUnplanned] = useState(false);
  const [formSelectedBranch, setFormSelectedBranch] = useState(null);

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [pendingFormValues, setPendingFormValues] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEmployee = user.role === 'EMPLOYEE';

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchLeaves();
    fetchStaff();
    if (!isEmployee) {
      fetchStats();
    }
  }, [isEmployee]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterStaff) params.staffId = filterStaff;
      const res = await axios.get(`${API}/api/admin/staff-leave`, { headers, params });
      setLeaves(res.data || []);
    } catch (e) {
      message.error('Không thể tải danh sách lịch nghỉ');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API}/api/staff`, { headers });
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      let fetchedStaff = res.data || [];
      if (user.role === 'EDITOR' && user.branch) {
        fetchedStaff = fetchedStaff.filter(s => s.branch === user.branch);
      }
      setStaffList(fetchedStaff);
    } catch (e) {}
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/staff-leave/dashboard-stats`, { headers });
      setStats(res.data || {});
    } catch (e) {}
  };

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus, filterStaff]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      setPreviewLoading(true);

      const startDate = isUnplanned ? dayjs().format('YYYY-MM-DD') : values.startDate.format('YYYY-MM-DD');
      const endDate = values.endDate.format('YYYY-MM-DD');

      const res = await axios.post(`${API}/api/admin/staff-leave/preview`, {
        staffId: values.staffId,
        startDate,
        endDate,
      }, { headers });

      setPendingFormValues({ ...values, startDate, endDate });
      setPreviewData(res.data);
      setFormOpen(false);
      setPreviewOpen(true);
    } catch (e) {
      if (e.response?.data?.error === 'LEAVE_OVERLAP') {
        message.error(e.response.data.message);
      } else if (e.response?.status !== undefined) {
        message.error(e.response?.data?.message || 'Lỗi khi tải preview');
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleConfirm = async (bookingAssignments) => {
    try {
      const res = await axios.post(`${API}/api/admin/staff-leave/confirm`, {
        staffId: pendingFormValues.staffId,
        startDate: pendingFormValues.startDate,
        endDate: pendingFormValues.endDate,
        leaveType: pendingFormValues.leaveType,
        salaryType: pendingFormValues.salaryType || 'PAID',
        reason: pendingFormValues.reason || '',
        bookingAssignments,
      }, { headers });

      message.success(res.data.message || 'Đã tạo lịch nghỉ thành công!');
      setPreviewOpen(false);
      form.resetFields();
      setIsUnplanned(false);
      fetchLeaves();
      fetchStats();
    } catch (e) {
      message.error(e.response?.data?.message || 'Lỗi khi xác nhận lịch nghỉ');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/staff-leave/${id}`, { headers });
      message.success('Đã hủy lịch nghỉ');
      fetchLeaves();
      fetchStats();
    } catch (e) {
      message.error(e.response?.data?.message || 'Không thể hủy kỳ nghỉ');
    }
  };

  const columns = [
    {
      title: 'THÔNG TIN NHÂN VIÊN',
      dataIndex: ['staff', 'name'],
      render: (name, record) => (
        <Space size="middle">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold text-lg bg-gradient-to-br from-accent to-yellow-600 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            {name?.charAt(0) || '?'}
          </div>
          <div>
            <div className="font-bold text-white text-[15px]">{name}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <UserOutlined /> {record.staff?.branch}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'THỜI GIAN NGHỈ',
      render: (_, r) => (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-2.5 inline-block">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium">{dayjs(r.startDate).format('DD/MM/YYYY')}</span>
            <SwapRightOutlined className="text-accent" />
            <span className="text-white font-medium">{dayjs(r.endDate).format('DD/MM/YYYY')}</span>
          </div>
          <div className="text-[11px] font-bold uppercase text-accent tracking-wider">
            Tổng: {Math.abs(dayjs(r.endDate).diff(dayjs(r.startDate), 'day')) + 1} ngày
          </div>
        </div>
      ),
    },
    {
      title: 'LOẠI & CHẾ ĐỘ',
      render: (_, r) => (
        <Space direction="vertical" size={6}>
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 border"
            style={{ 
              color: LEAVE_TYPE_COLORS[r.leaveType], 
              borderColor: LEAVE_TYPE_COLORS[r.leaveType] + '40',
              backgroundColor: LEAVE_TYPE_COLORS[r.leaveType] + '15'
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEAVE_TYPE_COLORS[r.leaveType] }}></div>
            {LEAVE_TYPE_LABELS[r.leaveType]}
          </div>
          <div className={`text-xs font-bold flex items-center gap-1 ${r.salaryType === 'PAID' ? 'text-green-500' : 'text-red-500'}`}>
            {r.salaryType === 'PAID' ? <CheckCircleOutlined /> : <WarningOutlined />}
            {r.salaryType === 'PAID' ? 'Có hưởng lương' : 'Không hưởng lương'}
          </div>
        </Space>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      render: (_, r) => {
        const cfg = STATUS_CONFIG[r.leaveStatus] || { label: r.leaveStatus, color: '#fff', bgColor: '#333', icon: null };
        return (
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border"
            style={{ color: cfg.color, backgroundColor: cfg.bgColor, borderColor: cfg.color + '40' }}
          >
            {cfg.icon} {cfg.label}
          </div>
        );
      },
    },
    {
      title: 'NGƯỜI TẠO',
      render: (_, r) => (
        <div>
          <div className="text-gray-300 font-medium text-sm">{r.createdBy}</div>
          <div className="text-xs text-gray-500 mt-1">
            {r.createdAt ? dayjs(r.createdAt).format('DD/MM/YYYY HH:mm') : ''}
          </div>
        </div>
      ),
    },
    ...(!isEmployee ? [{
      title: 'THAO TÁC',
      render: (_, r) => {
        const canModify = r.leaveStatus === 'ACTIVE' && dayjs(r.startDate).isAfter(dayjs());
        return (
          <Space>
            {canModify ? (
              <Popconfirm
                title="Hủy kỳ nghỉ này?"
                description="Tất cả booking bị lock sẽ được mở lại."
                okText="Hủy kỳ nghỉ"
                cancelText="Không"
                okButtonProps={{ danger: true, className: "bg-red-600 hover:bg-red-500 border-none" }}
                onConfirm={() => handleCancel(r.id)}
              >
                <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <DeleteOutlined /> Hủy nghỉ
                </button>
              </Popconfirm>
            ) : (
              <span className="text-gray-600 text-xs font-medium uppercase tracking-wider bg-gray-900 px-3 py-1 rounded-md border border-gray-800">Không thể hủy</span>
            )}
          </Space>
        );
      },
    }] : []),
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-3">
            <CalendarOutlined /> Quản lý Nhân sự
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider m-0">
            Lịch Nghỉ <span className="text-accent">Nhân Viên</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Theo dõi và quản lý tập trung toàn bộ kỳ nghỉ của nhân sự HORNET ROYALE.</p>
        </div>
        
        {!isEmployee && (
          <button
            onClick={() => { form.resetFields(); setIsUnplanned(false); setFormSelectedBranch(null); setFormOpen(true); }}
            className="group relative px-6 py-3 border-none outline-none cursor-pointer bg-gradient-to-r from-accent to-yellow-600 rounded-xl font-bold text-primary uppercase tracking-wider text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <PlusOutlined /> Đăng Ký Nghỉ Mới
          </button>
        )}
      </div>

      {/* STATS DASHBOARD */}
      {!isEmployee && (
      <Row gutter={[16, 16]} className="mb-8">
        {[
          { title: 'Nhân Viên Đang Nghỉ', value: stats.staffCurrentlyOnLeave || 0, color: '#ef4444', gradient: 'from-red-500/20 to-transparent', border: 'border-red-500/30', icon: <ClockCircleOutlined /> },
          { title: 'Sắp Nghỉ (7 Ngày)', value: stats.upcomingLeaves || 0, color: '#f59e0b', gradient: 'from-amber-500/20 to-transparent', border: 'border-amber-500/30', icon: <CalendarOutlined /> },
          { title: 'Đơn Bị Hủy (Tháng)', value: stats.cancelledThisMonth || 0, color: '#8b5cf6', gradient: 'from-purple-500/20 to-transparent', border: 'border-purple-500/30', icon: <ExclamationCircleOutlined /> },
          { title: 'Tổng Tiền Hoàn (Tháng)', value: (stats.refundThisMonth || 0).toLocaleString('vi-VN') + 'đ', color: '#10b981', gradient: 'from-emerald-500/20 to-transparent', border: 'border-emerald-500/30', icon: <CheckCircleOutlined /> },
        ].map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <div className={`relative overflow-hidden bg-[#111] border ${s.border} rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${s.gradient} rounded-bl-full opacity-50`}></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{s.title}</div>
                  <div className="text-2xl font-black" style={{ color: s.color }}>
                    {s.value}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl backdrop-blur-md border bg-black/40" style={{ color: s.color, borderColor: `${s.color}40` }}>
                  {s.icon}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      )}

      {/* FILTER & TABLE AREA */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center bg-[#151515]">
          <div className="flex-1 flex gap-3 flex-wrap">
            <Select
              placeholder="🔍 Lọc theo nhân viên..."
              allowClear
              style={{ width: 220 }}
              onChange={setFilterStaff}
              showSearch
              optionFilterProp="children"
              popupMatchSelectWidth={false}
              className="dark-select"
            >
              {staffList.map(s => <Option key={s.id} value={s.id}>{s.name} - {s.branch}</Option>)}
            </Select>
            <Select
              placeholder="📌 Lọc theo trạng thái..."
              allowClear
              style={{ width: 200 }}
              onChange={setFilterStatus}
              className="dark-select"
            >
              <Option value="ACTIVE">Đang nghỉ</Option>
              <Option value="FINISHED">Đã kết thúc</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </div>
          <button 
            onClick={fetchLeaves}
            className="px-4 py-2 border-none outline-none cursor-pointer rounded-lg bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <SearchOutlined /> Tải lại dữ liệu
          </button>
        </div>

        {/* Custom Ant Design Table via CSS override */}
        <Table
          dataSource={leaves}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} kỳ nghỉ`, className: 'px-4' }}
          locale={{ emptyText: <div className="py-10 text-gray-500">Chưa có dữ liệu kỳ nghỉ</div> }}
          className="custom-dark-table"
        />
      </div>

      {/* MODAL ĐĂNG KÝ NGHỈ */}
      <Modal
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        footer={null}
        width={650}
        closeIcon={<span className="text-gray-400 hover:text-white text-xl">×</span>}
        className="premium-modal"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-[#111] border border-accent/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-accent/20 to-transparent p-6 border-b border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 text-accent flex items-center justify-center text-xl">
                <CalendarOutlined />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider m-0">Đăng Ký Nghỉ Mới</h2>
                <p className="text-gray-400 text-sm mt-1 m-0">Tạo kỳ nghỉ và tự động xử lý các lịch hẹn bị ảnh hưởng.</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a]">
            <Form form={form} layout="vertical">
              <Row gutter={20}>
                <Col span={10}>
                  <Form.Item label={<span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Lọc Chi Nhánh</span>}>
                    <Select 
                      allowClear 
                      placeholder="Tất cả chi nhánh" 
                      className="dark-select h-11" 
                      popupMatchSelectWidth={false}
                      value={formSelectedBranch}
                      onChange={(val) => {
                        setFormSelectedBranch(val);
                        form.setFieldsValue({ staffId: undefined });
                      }}
                    >
                      {[...new Set(staffList.map(s => s.branch))].filter(Boolean).map(b => (
                        <Option key={b} value={b}>{b}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item name="staffId" label={<span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Chọn Nhân Viên *</span>} rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}>
                    <Select showSearch optionFilterProp="children" placeholder="Tìm và chọn nhân viên..." className="dark-select h-11" popupMatchSelectWidth={false}>
                      {staffList
                        .filter(s => !formSelectedBranch || s.branch === formSelectedBranch)
                        .map(s => (
                        <Option key={s.id} value={s.id}>
                          {s.name} — {s.branch}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item name="leaveType" label={<span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Lý do nghỉ</span>} initialValue="ANNUAL_LEAVE" rules={[{ required: true }]}>
                    <Select className="dark-select h-11" popupMatchSelectWidth={false}>
                      <Option value="ANNUAL_LEAVE">📅 Nghỉ phép năm</Option>
                      <Option value="SICK_LEAVE">🤒 Nghỉ ốm</Option>
                      <Option value="PERSONAL">👤 Việc cá nhân</Option>
                      <Option value="OTHER">📌 Lý do khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="salaryType" label={<span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Chế độ lương</span>} initialValue="PAID" rules={[{ required: true }]}>
                    <Select className="dark-select h-11" popupMatchSelectWidth={false}>
                      <Option value="PAID">✅ Có hưởng lương (Trừ 70%)</Option>
                      <Option value="UNPAID">❌ Không lương (Trừ 100%)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <div className="mb-5 p-4 bg-[#151515] rounded-xl border border-gray-800 flex items-start gap-4 hover:border-accent/30 transition-colors">
                <Switch checked={isUnplanned} onChange={setIsUnplanned} className="mt-1" />
                <div>
                  <div className="text-white font-bold mb-1">Nghỉ đột xuất (Bắt đầu từ hôm nay)</div>
                  <div className="text-gray-400 text-xs leading-relaxed">Nếu bật, hệ thống tự lấy ngày bắt đầu là hôm nay. Phù hợp cho trường hợp ốm đau đột xuất không báo trước.</div>
                </div>
              </div>

              <Row gutter={20}>
                {!isUnplanned && (
                  <Col span={12}>
                    <Form.Item name="startDate" label={<span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Ngày Bắt Đầu</span>} rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}>
                      <DatePicker format="DD/MM/YYYY" className="w-full h-11 bg-[#111] border-gray-800 text-white" disabledDate={d => d.isBefore(dayjs(), 'day')} />
                    </Form.Item>
                  </Col>
                )}
                <Col span={isUnplanned ? 24 : 12}>
                  <Form.Item name="endDate" label={<span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Ngày Kết Thúc</span>} rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}>
                    <DatePicker format="DD/MM/YYYY" className="w-full h-11 bg-[#111] border-gray-800 text-white" disabledDate={d => d.isBefore(dayjs(), 'day')} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="reason" label={<span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Ghi chú thêm</span>}>
                <TextArea rows={3} placeholder="Nhập ghi chú chi tiết..." className="bg-[#111] border-gray-800 text-white p-3 rounded-lg resize-none focus:border-accent" />
              </Form.Item>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setFormOpen(false)}
                  className="px-6 py-3 border-none outline-none cursor-pointer rounded-xl bg-transparent border border-gray-700 text-gray-300 font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button 
                  type="button"
                  disabled={previewLoading}
                  onClick={handleFormSubmit}
                  className="px-6 py-3 border-none outline-none cursor-pointer rounded-xl bg-gradient-to-r from-accent to-yellow-600 text-primary font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
                >
                  {previewLoading ? 'Đang phân tích...' : 'Phân Tích Ảnh Hưởng →'}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>

      {/* PREVIEW MODAL */}
      <StaffLeavePreviewModal
        open={previewOpen}
        data={previewData}
        staffList={staffList}
        formValues={pendingFormValues}
        onConfirm={handleConfirm}
        onCancel={() => { setPreviewOpen(false); setFormOpen(true); }}
      />
      
      {/* GLOBAL CSS OVERRIDES FOR TABLE */}
      <style>{`
        .custom-dark-table .ant-table {
          background: transparent !important;
          color: white !important;
        }
        .custom-dark-table .ant-table-thead > tr > th {
          background: #0a0a0a !important;
          color: #888 !important;
          border-bottom: 1px solid #333 !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          letter-spacing: 0.05em;
          padding: 16px !important;
        }
        .custom-dark-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #222 !important;
          padding: 16px !important;
          background: transparent !important;
          transition: background 0.3s;
        }
        .custom-dark-table .ant-table-tbody > tr:hover > td {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .custom-dark-table .ant-pagination-item {
          background: #111 !important;
          border-color: #333 !important;
        }
        .custom-dark-table .ant-pagination-item a {
          color: #aaa !important;
        }
        .custom-dark-table .ant-pagination-item-active {
          border-color: #d4af37 !important;
          background: rgba(212, 175, 55, 0.1) !important;
        }
        .custom-dark-table .ant-pagination-item-active a {
          color: #d4af37 !important;
        }
        .custom-dark-table .ant-pagination-prev .ant-pagination-item-link,
        .custom-dark-table .ant-pagination-next .ant-pagination-item-link {
          background: #111 !important;
          border-color: #333 !important;
          color: #aaa !important;
        }
        .premium-modal .ant-modal-content {
          background: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}

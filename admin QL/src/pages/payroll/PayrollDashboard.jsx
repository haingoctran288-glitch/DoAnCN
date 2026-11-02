import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Select, Typography, message, Space, Card, Row, Col, Tooltip } from 'antd';
import axios from 'axios';
import { Download, Search, FileText, RefreshCw } from 'lucide-react';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Khong can removeVietnameseTones nua vi da ho tro tieng Viet

const BRANCHES = [
  'Quận 1',
  'Quận 2',
  'Quận 3',
  'Quận 7',
  'Quận 9',
  'Bình Thạnh'
];

const { Title, Text } = Typography;
const { Option } = Select;
const BASE_URL = 'http://localhost:8080';

const PayrollDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [staffList, setStaffList] = useState([]);
  const [filteredBranch, setFilteredBranch] = useState(null);
  const [filteredStaff, setFilteredStaff] = useState(null);
  const [printRecord, setPrintRecord] = useState(null);
  const printRef = React.useRef();

  useEffect(() => {
    fetchStaff();
    fetchPayroll();
  }, [selectedMonth]);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/staff/all`);
      setStaffList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const year = selectedMonth.year();
      const month = selectedMonth.month() + 1;
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.get(`${BASE_URL}/api/payroll/generate?year=${year}&month=${month}`, { headers });
      setData(res.data);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tính lương');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = (record) => {
    setPrintRecord(record);
    const hideMessage = message.loading('Đang khởi tạo bản in PDF...', 0);
    setTimeout(async () => {
      try {
        const element = printRef.current;
        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true,
          backgroundColor: '#111111'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`BangLuong_${record.staffName}_${record.month}_${record.year}.pdf`);
        message.success(`Đã xuất PDF cho ${record.staffName}`);
      } catch (err) {
        console.error(err);
        message.error('Lỗi khi tạo file PDF!');
      } finally {
        hideMessage();
        setPrintRecord(null);
      }
    }, 1000); // Đợi React render xong bảng ẩn
  };

  const handleResetFilters = () => {
    setFilteredBranch(null);
    setFilteredStaff(null);
    setSelectedMonth(dayjs());
  };

  const columns = [
    { title: 'Nhân viên', dataIndex: 'staffName', key: 'staffName', render: (val, r) => <b>{val} <br/><span style={{fontSize:12, color:'#888', fontWeight: 'normal'}}>{r.branch}</span></b> },
    { title: 'Lương cứng', dataIndex: 'baseSalary', key: 'baseSalary', align: 'right', render: val => `${val.toLocaleString()} ₫` },
    { title: 'Doanh thu', dataIndex: 'totalCompletedRevenue', key: 'totalCompletedRevenue', align: 'right', render: val => `${val.toLocaleString()} ₫` },
    { title: 'Hoa hồng', dataIndex: 'commissionAmount', key: 'commissionAmount', align: 'right', render: val => <span style={{color: '#52c41a'}}>{(val || 0).toLocaleString()} ₫</span> },
    { title: 'Ứng lương', dataIndex: 'totalAdvance', key: 'totalAdvance', align: 'right', render: val => val > 0 ? <span style={{color: '#1890ff'}}>-{val.toLocaleString()} ₫</span> : <span style={{color: '#555'}}>0 ₫</span> },
    { title: 'Ngày nghỉ', dataIndex: 'leaveDays', key: 'leaveDays', align: 'center', render: val => val > 0 ? <span style={{color: '#faad14', fontWeight: 'bold'}}>{val} ngày</span> : <span style={{color: '#555'}}>0</span> },
    { title: 'Phạt & Trừ', key: 'totalDeductions', align: 'right', render: (_, r) => {
      const penalty = r.totalPenalty || 0;
      const leaveDed = r.leaveDeduction || 0;
      const total = penalty + leaveDed;
      if (total > 0) {
        return (
          <Tooltip title={`Phạt: ${penalty.toLocaleString()} ₫ | Trừ nghỉ: ${leaveDed.toLocaleString()} ₫`}>
            <span style={{color: '#ff4d4f', cursor: 'help'}}>-{total.toLocaleString()} ₫</span>
          </Tooltip>
        );
      }
      return <span style={{color: '#555'}}>0 ₫</span>;
    }},
    { 
      title: 'THỰC NHẬN', 
      dataIndex: 'netSalary', 
      key: 'netSalary', 
      align: 'right', 
      render: val => <b style={{ color: '#d4af37', fontSize: 16 }}>{val.toLocaleString()} ₫</b> 
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Xuất PDF chi tiết">
          <Button type="primary" icon={<FileText size={16} />} onClick={() => exportPDF(record)} style={{ backgroundColor: '#d4af37', color: '#000', border: 'none', fontWeight: 'bold' }}>
            Xuất PDF
          </Button>
        </Tooltip>
      )
    }
  ];

  // Lọc dữ liệu hiển thị
  let displayData = data;
  if (filteredBranch) {
    displayData = displayData.filter(d => d.branch === filteredBranch);
  }
  if (filteredStaff) {
    displayData = displayData.filter(d => d.staffId === filteredStaff);
  }

  // Danh sách nhân viên trong dropdown (lọc theo chi nhánh nếu có)
  const availableStaff = filteredBranch 
    ? staffList.filter(s => s.branch === filteredBranch) 
    : staffList;

  // Tổng quỹ lương
  const totalNet = displayData.reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalRev = displayData.reduce((acc, curr) => acc + curr.totalCompletedRevenue, 0);

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ color: '#d4af37', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Bảng Lương Nhân Viên</Title>
      </div>

      <Card bordered={false} style={{ marginBottom: 24, background: '#111', border: '1px solid #333', borderRadius: 16 }}>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={6}>
            <Text style={{ color: '#d4af37', display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Kỳ lương (Tháng/Năm)</Text>
            <DatePicker.MonthPicker 
              value={selectedMonth} 
              onChange={val => val && setSelectedMonth(val)}
              format="MM/YYYY"
              allowClear={false}
              style={{ width: '100%', backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text style={{ color: '#d4af37', display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Lọc chi nhánh</Text>
            <Select 
              allowClear 
              placeholder="Tất cả chi nhánh" 
              style={{ width: '100%' }}
              size="large"
              value={filteredBranch}
              onChange={(val) => {
                setFilteredBranch(val);
                setFilteredStaff(null); // Reset nhân viên khi đổi chi nhánh
              }}
              dropdownStyle={{ backgroundColor: '#222', color: '#fff' }}
            >
              {BRANCHES.map(b => (
                <Option key={b} value={b} style={{ color: '#fff' }}>{b}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text style={{ color: '#d4af37', display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Lọc nhân viên</Text>
            <Select 
              allowClear 
              showSearch 
              optionFilterProp="children" 
              placeholder="Tất cả nhân viên" 
              style={{ width: '100%' }}
              size="large"
              value={filteredStaff}
              onChange={setFilteredStaff}
              dropdownStyle={{ backgroundColor: '#222', color: '#fff' }}
            >
              {availableStaff.map(s => (
                <Option key={s.id} value={s.id} style={{ color: '#fff' }}>{s.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button type="primary" icon={<Search size={16} />} onClick={fetchPayroll} loading={loading} size="large" style={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', border: 'none' }}>
                TÍNH LẠI
              </Button>
              <Button icon={<RefreshCw size={16} />} onClick={handleResetFilters} size="large" style={{ backgroundColor: 'transparent', color: '#fff', borderColor: '#444' }}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ background: 'linear-gradient(145deg, rgba(212,175,55,0.1) 0%, rgba(17,17,17,1) 100%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 16 }}>
            <Text style={{ color: '#d4af37', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 }}>TỔNG DOANH THU NHÂN VIÊN</Text>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 8 }}>{totalRev.toLocaleString()} <span style={{fontSize: 20, color: '#d4af37'}}>VNĐ</span></div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ background: 'linear-gradient(145deg, rgba(24,144,255,0.1) 0%, rgba(17,17,17,1) 100%)', border: '1px solid rgba(24,144,255,0.3)', borderRadius: 16 }}>
            <Text style={{ color: '#1890ff', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 }}>TỔNG QUỸ LƯƠNG THỰC CHI</Text>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 8 }}>{totalNet.toLocaleString()} <span style={{fontSize: 20, color: '#1890ff'}}>VNĐ</span></div>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ background: '#111', border: '1px solid #333', borderRadius: 16 }}>
        <Table 
          columns={columns} 
          dataSource={displayData} 
          rowKey="staffId" 
          loading={loading}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1000 }}
          className="premium-table"
        />
      </Card>

      {/* Bản PDF Ẩn để render */}
      {printRecord && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <div ref={printRef} style={{ width: '800px', padding: '40px', background: '#111111', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #d4af37', paddingBottom: '20px', marginBottom: '20px' }}>
              <h1 style={{ color: '#d4af37', margin: 0, fontSize: '32px', textTransform: 'uppercase', letterSpacing: '2px' }}>HORNET ROYALE</h1>
              <h2 style={{ color: '#ffffff', margin: '10px 0 5px 0', fontSize: '24px' }}>BẢNG LƯƠNG NHÂN VIÊN</h2>
              <p style={{ color: '#888', margin: 0, fontSize: '16px' }}>Tháng {printRecord.month} - Năm {printRecord.year}</p>
            </div>

            {/* Thông tin nhân viên */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
              <div>
                <p style={{ margin: '5px 0', fontSize: '16px' }}><span style={{ color: '#888' }}>Nhân viên:</span> <strong style={{ color: '#d4af37' }}>{printRecord.staffName}</strong></p>
                <p style={{ margin: '5px 0', fontSize: '16px' }}><span style={{ color: '#888' }}>Chi nhánh:</span> {printRecord.branch}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '5px 0', fontSize: '16px' }}><span style={{ color: '#888' }}>Kinh nghiệm:</span> {printRecord.experienceYears} năm</p>
                <p style={{ margin: '5px 0', fontSize: '16px' }}><span style={{ color: '#888' }}>Lương cứng:</span> {printRecord.baseSalary?.toLocaleString()} ₫</p>
              </div>
            </div>

            {/* Doanh thu */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#d4af37', borderBottom: '1px solid #333', paddingBottom: '5px' }}>1. Chi tiết Doanh thu & Hoa hồng</h3>
              {printRecord.commissions?.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr style={{ background: '#222', color: '#d4af37' }}>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #444' }}>Ngày</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #444' }}>Dịch vụ</th>
                      <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #444' }}>Giá trị</th>
                      <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #444' }}>Hoa hồng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printRecord.commissions.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '10px' }}>{dayjs(c.date).format('DD/MM/YYYY')}</td>
                        <td style={{ padding: '10px' }}>{c.serviceNames}</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>{c.value?.toLocaleString()} ₫</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#52c41a' }}>+{c.commission?.toLocaleString()} ₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p style={{ color: '#666', fontStyle: 'italic' }}>Không có dữ liệu trong kỳ.</p>}
            </div>

            {/* Ứng lương & Phạt */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#1890ff', borderBottom: '1px solid #333', paddingBottom: '5px' }}>2. Ứng lương</h3>
                {printRecord.advances?.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', color: '#ccc' }}>
                    {printRecord.advances.map((a, i) => (
                      <li key={i} style={{ marginBottom: '5px' }}>
                        {dayjs(a.advanceDate).format('DD/MM/YYYY')}: <strong style={{ color: '#1890ff' }}>-{a.amount?.toLocaleString()} ₫</strong> 
                        <br/><span style={{ fontSize: '12px', color: '#666' }}>({a.notes})</span>
                      </li>
                    ))}
                  </ul>
                ) : <p style={{ color: '#666', fontStyle: 'italic' }}>Không ứng lương.</p>}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#ff4d4f', borderBottom: '1px solid #333', paddingBottom: '5px' }}>3. Vi phạm & Phạt</h3>
                {printRecord.penalties?.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', color: '#ccc' }}>
                    {printRecord.penalties.map((p, i) => (
                      <li key={i} style={{ marginBottom: '5px' }}>
                        {dayjs(p.penaltyDate).format('DD/MM/YYYY')}: <strong style={{ color: '#ff4d4f' }}>-{p.amount?.toLocaleString()} ₫</strong>
                        <br/><span style={{ fontSize: '12px', color: '#666' }}>({p.penaltyType} - {p.notes})</span>
                      </li>
                    ))}
                  </ul>
                ) : <p style={{ color: '#666', fontStyle: 'italic' }}>Không có vi phạm.</p>}
              </div>
            </div>

            {/* Ngày nghỉ */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#faad14', borderBottom: '1px solid #333', paddingBottom: '5px' }}>4. Khấu trừ ngày nghỉ</h3>
              {printRecord.leaveDays > 0 ? (
                <p style={{ color: '#ccc', fontSize: '16px' }}>
                  Tổng cộng nghỉ <strong style={{ color: '#faad14' }}>{printRecord.leaveDays} ngày</strong>. 
                  Khấu trừ vào lương cứng: <strong style={{ color: '#ff4d4f' }}>-{printRecord.leaveDeduction?.toLocaleString()} ₫</strong>.
                </p>
              ) : <p style={{ color: '#666', fontStyle: 'italic' }}>Đi làm đầy đủ, không nghỉ ngày nào.</p>}
            </div>

            {/* Tổng Kết */}
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: '#d4af37', margin: '0 0 10px 0' }}>TỔNG KẾT</h2>
                <p style={{ margin: '5px 0', color: '#888' }}>+ Lương cứng: {printRecord.baseSalary?.toLocaleString()} ₫</p>
                <p style={{ margin: '5px 0', color: '#888' }}>+ Tổng hoa hồng: {printRecord.commissionAmount?.toLocaleString()} ₫</p>
                <p style={{ margin: '5px 0', color: '#888' }}>- Tổng ứng lương: {printRecord.totalAdvance?.toLocaleString()} ₫</p>
                <p style={{ margin: '5px 0', color: '#888' }}>- Tổng trừ (Phạt + Nghỉ): {((printRecord.totalPenalty || 0) + (printRecord.leaveDeduction || 0)).toLocaleString()} ₫</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '14px' }}>LƯƠNG THỰC NHẬN</p>
                <p style={{ margin: 0, color: '#52c41a', fontSize: '36px', fontWeight: '900' }}>{printRecord.netSalary?.toLocaleString()} ₫</p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '12px' }}>
              <div>
                Người lập bảng: <strong>{JSON.parse(localStorage.getItem('user') || '{}').fullName || 'ADMIN'} ({JSON.parse(localStorage.getItem('user') || '{}').role || 'ADMIN'})</strong>
              </div>
              <div>
                Ngày xuất: {dayjs().format('DD/MM/YYYY - HH:mm')}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .premium-table .ant-table {
          background-color: transparent !important;
        }
        .premium-table .ant-table-thead > tr > th {
          background-color: #1a1a1a !important;
          color: #d4af37 !important;
          border-bottom: 1px solid #333 !important;
          font-weight: 800 !important;
        }
        .premium-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #222 !important;
          color: #fff !important;
        }
        .premium-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(212, 175, 55, 0.05) !important;
        }
        .ant-picker-input > input {
          color: #fff !important;
        }
        .ant-select-selection-item {
          color: #fff !important;
        }
        .ant-select-selector {
          background-color: #1a1a1a !important;
          border-color: #444 !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default PayrollDashboard;

import React from 'react';
import { Avatar, Rate, Button, Tooltip, Popconfirm } from 'antd';
import { Edit, Trash2, User, Star, Phone, Mail, MapPin, Briefcase, Award, TrendingUp, MessageCircle } from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

const StaffTable = ({ data, loading, onEdit, onDelete, onViewReview, isEditor }) => {
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
    return BASE_URL + avatar;
  };

  if (loading) {
    return <div style={{ color: '#aaa', padding: 24, textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }

  if (!data || data.length === 0) {
    return <div style={{ color: '#aaa', padding: 24, textAlign: 'center' }}>Không tìm thấy nhân viên nào.</div>;
  }

  return (
    <div className="staff-grid">
      {data.map(record => {
        const perf = record.performance || 0;
        let perfColor = '#888';
        if (perf > 0 && perf <= 20) perfColor = '#52c41a';
        else if (perf > 20 && perf <= 50) perfColor = '#fadb14';
        else if (perf > 50) perfColor = '#096dd9';

        return (
          <div key={record.id} className="staff-card">
            <div className="staff-card-header">
              <div style={{ position: 'relative' }}>
                <Avatar 
                  src={getAvatarUrl(record.avatar)} 
                  size={64}
                  icon={<User size={32} />} 
                  style={{ 
                    backgroundColor: '#111', 
                    border: '2px solid #d4af37',
                    boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
                  }} 
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  backgroundColor: record.isActive ? '#52c41a' : '#ff4d4f',
                  border: '2px solid #1a1a1a',
                  boxShadow: '0 0 5px rgba(0,0,0,0.5)'
                }} />
              </div>
              <div className="staff-card-title">
                <h3>{record.name}</h3>
                <div className="specialty">
                  <Briefcase size={14} />
                  <span>{record.specialty}</span>
                </div>
              </div>
              
              {!isEditor && (
                <div className="staff-card-actions">
                  <Tooltip title="Xem đánh giá">
                    <Button 
                      type="text" 
                      onClick={() => onViewReview && onViewReview(record)}
                      className="action-btn view-btn"
                      icon={<MessageCircle size={16} />} 
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Button 
                      type="text" 
                      onClick={() => onEdit(record)}
                      className="action-btn edit-btn"
                      icon={<Edit size={16} />} 
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Popconfirm
                      title="Xác nhận xóa"
                      description="Hành động này không thể hoàn tác. Tiếp tục?"
                      onConfirm={() => onDelete(record.id)}
                      okText="Xóa ngay"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true, style: { borderRadius: 6 } }}
                      cancelButtonProps={{ style: { borderRadius: 6 } }}
                    >
                      <Button 
                        type="text" 
                        danger 
                        className="action-btn delete-btn"
                        icon={<Trash2 size={16} />} 
                      />
                    </Popconfirm>
                  </Tooltip>
                </div>
              )}
            </div>

            <div className="staff-card-body">
              <div className="info-group">
                <div className="info-item">
                  <Phone size={14} className="info-icon" />
                  <span>{record.phone || '—'}</span>
                </div>
                <div className="info-item">
                  <Mail size={14} className="info-icon" />
                  <span>{record.email || '—'}</span>
                </div>
                <div className="info-item">
                  <MapPin size={14} className="info-icon text-gold" />
                  <span className="text-gold">{record.branch || '—'}</span>
                </div>
                <div className="info-item">
                  <Award size={14} className="info-icon text-gold" />
                  <span>{record.experienceYears || 0} năm kinh nghiệm</span>
                </div>
              </div>

              <div className="stats-group">
                <div className="stat-box">
                  <div className="stat-label">TÍN NHIỆM</div>
                  {(!record.rating || record.rating <= 0) ? (
                    <div className="stat-value empty">CHƯA CÓ ĐÁNH GIÁ</div>
                  ) : (
                    <div className="rating-display">
                      <span className="rating-number">{record.rating.toFixed(1)}</span>
                      <Rate 
                        disabled 
                        defaultValue={record.rating} 
                        allowHalf 
                        className="custom-rate"
                        character={<Star size={10} fill="#d4af37" />}
                      />
                    </div>
                  )}
                </div>

                <div className="stat-box">
                  <div className="stat-label">HIỆU SUẤT</div>
                  <div className="performance-display">
                    <TrendingUp size={16} style={{ color: perfColor }} />
                    <span style={{ color: perfColor, fontWeight: '900', fontSize: 16 }}>{perf}</span>
                  </div>
                  <div className="order-count">{record.orderCount || 0} Đơn hoàn thành</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .staff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding: 8px;
        }
        
        .staff-card {
          background-color: #111;
          border: 1px solid #222;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .staff-card:hover {
          border-color: #333;
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }

        .staff-card-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .staff-card-title {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .staff-card-title h3 {
          margin: 0;
          color: #fff;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .specialty {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #d4af37;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .staff-card-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255,255,255,0.05);
          border: none;
        }

        .action-btn:hover {
          background-color: rgba(255,255,255,0.1);
        }

        .view-btn { color: #d4af37; }
        .edit-btn { color: #1890ff; }
        .delete-btn { color: #ff4d4f; }

        .staff-card-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(255,255,255,0.02);
          padding: 16px;
          border-radius: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #aaa;
          font-size: 13px;
        }

        .info-icon {
          color: #666;
        }

        .text-gold {
          color: #d4af37;
          font-weight: 600;
        }

        .stats-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .stat-box {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-label {
          font-size: 10px;
          color: #666;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .stat-value.empty {
          color: #555;
          font-size: 11px;
          font-weight: 700;
        }

        .rating-display {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rating-number {
          color: #d4af37;
          font-weight: 900;
          font-size: 16px;
        }

        .custom-rate {
          color: #d4af37;
          font-size: 10px;
        }

        .performance-display {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .order-count {
          color: #888;
          font-size: 11px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .staff-grid {
            grid-template-columns: 1fr;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffTable;

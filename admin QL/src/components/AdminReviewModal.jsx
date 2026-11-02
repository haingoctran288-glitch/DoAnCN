import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, Trash2, User as UserIcon, Clock } from 'lucide-react';
import { Modal, Rate, Avatar, Button, Input, List, Tag, Spin, Space, Popconfirm, Typography, message } from 'antd';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  return `http://localhost:8080${avatar}`;
};

const AdminReviewModal = ({ isOpen, onClose, type, itemId, itemName }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [submittingReply, setSubmittingReply] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const adminId = user.id || 1;
  const userRole = user.role || 'ADMIN';

  useEffect(() => {
    if (isOpen && itemId) {
      fetchData();
    }
  }, [isOpen, itemId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/reviews/${type}/${itemId}`),
        axios.get(`http://localhost:8080/api/reviews/${type}/${itemId}/stats`)
      ]);
      setReviews(reviewsRes.data || []);
      setStats(statsRes.data || { averageRating: 0, reviewCount: 0 });
    } catch (err) {
      console.error("Lỗi fetch reviews:", err);
      message.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (reviewId, text) => {
    setReplyText({ ...replyText, [reviewId]: text });
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText[reviewId] || replyText[reviewId].trim() === '') {
      message.error('Vui lòng nhập nội dung trả lời');
      return;
    }

    setSubmittingReply(reviewId);
    try {
      await axios.post(`http://localhost:8080/api/reviews/${reviewId}/reply`, {
        adminId: adminId,
        reply: replyText[reviewId]
      });
      message.success('Đã trả lời đánh giá');
      setReplyText({ ...replyText, [reviewId]: '' });
      fetchData(); // Refresh
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi trả lời');
    } finally {
      setSubmittingReply(null);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`);
      message.success('Đã xóa đánh giá thành công');
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi xóa đánh giá');
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    return dayjs(isoString).format('DD/MM/YYYY HH:mm');
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      closable={true}
      title={
        <div style={{ padding: '8px 0', borderBottom: '1px solid #333', marginBottom: 16 }}>
          <Title level={4} style={{ color: '#d4af37', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>
            <MessageCircle size={20} style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'text-bottom' }} />
            Đánh giá: <span style={{ color: '#fff' }}>{itemName}</span>
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <Rate disabled allowHalf value={stats.averageRating} style={{ color: '#d4af37', fontSize: 14 }} />
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{stats.averageRating.toFixed(1)} / 5</span>
            <span style={{ color: '#888', fontSize: 13 }}>({stats.reviewCount} đánh giá)</span>
          </div>
        </div>
      }
      styles={{
        content: { backgroundColor: '#111', border: '1px solid #333', borderRadius: 16, padding: '24px' },
        header: { backgroundColor: 'transparent' },
        close: { color: '#888', top: 24, right: 24 },
      }}
    >
      <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 8 }} className="custom-scrollbar">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
            <MessageCircle size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <p>Chưa có đánh giá nào.</p>
          </div>
        ) : (
          <List
            dataSource={reviews}
            renderItem={review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-user-info">
                    <Avatar 
                      src={getAvatarUrl(review.user?.avatar)} 
                      icon={!review.user?.avatar && <UserIcon />}
                      size={44}
                      style={{ border: '1px solid #444', backgroundColor: '#333' }}
                    />
                    <div>
                      <div className="review-user-name">{review.user?.fullName}</div>
                      <div className="review-meta">
                        <Text className="review-date">
                          <Clock size={12} /> {formatDateTime(review.createdAt)}
                        </Text>
                        {type === 'barber' && review.bookingId && (
                          <Tag color="gold" style={{ border: 'none', background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>
                            Lịch: #{review.bookingId}
                          </Tag>
                        )}
                        {type === 'product' && review.orderId && (
                          <Tag color="cyan" style={{ border: 'none', background: 'rgba(0,185,107,0.1)', color: '#00b96b' }}>
                            Đơn: #{review.orderId}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="review-actions">
                    <Rate disabled value={review.rating} className="review-rate" />
                    {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
                      <Popconfirm 
                        title="Xóa đánh giá này?" 
                        description="Hành động này sẽ tính toán lại điểm trung bình. Bạn chắc chứ?"
                        onConfirm={() => handleDelete(review.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button type="text" danger icon={<Trash2 size={16} />} style={{ padding: 4 }} title="Xóa đánh giá" />
                      </Popconfirm>
                    )}
                  </div>
                </div>

                {review.comment && (
                  <div className="review-comment">
                    {review.comment}
                  </div>
                )}

                {review.reply ? (
                  <div className="review-reply-box">
                    <div className="review-reply-header">
                      <Tag color={review.repliedByRole === 'ADMIN' ? 'red' : 'blue'} style={{ fontWeight: 'bold', margin: 0 }}>
                        {review.repliedByRole} ĐÃ TRẢ LỜI
                      </Tag>
                      <Text style={{ color: '#aaa', fontSize: 12 }}>({review.repliedByName})</Text>
                      {review.repliedAt && (
                        <Text className="review-reply-date">
                          <Clock size={12} /> {formatDateTime(review.repliedAt)}
                        </Text>
                      )}
                    </div>
                    <Text style={{ color: '#fff' }}>{review.reply}</Text>
                  </div>
                ) : (
                  <div className="review-reply-input">
                    <TextArea 
                      placeholder="Nhập nội dung phản hồi khách hàng..."
                      value={replyText[review.id] || ''}
                      onChange={(e) => handleReplyChange(review.id, e.target.value)}
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      style={{ 
                        backgroundColor: '#222', 
                        borderColor: '#444', 
                        color: '#fff',
                        borderRadius: 8
                      }}
                    />
                    <Button 
                      type="primary" 
                      icon={<Send size={16} />}
                      loading={submittingReply === review.id}
                      onClick={() => handleReplySubmit(review.id)}
                      style={{ 
                        backgroundColor: '#d4af37', 
                        borderColor: '#d4af37', 
                        color: '#000', 
                        fontWeight: 'bold',
                        height: 'auto'
                      }}
                    >
                      Gửi
                    </Button>
                  </div>
                )}
              </div>
            )}
          />
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4af37;
        }
        .ant-modal-close:hover {
          background-color: rgba(255,255,255,0.1) !important;
        }
        
        .review-card {
          background-color: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .review-user-info {
          display: flex;
          gap: 12px;
          flex: 1;
          min-width: 200px;
        }
        .review-user-name {
          color: #fff;
          font-weight: bold;
          font-size: 15px;
        }
        .review-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }
        .review-date {
          color: #888;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .review-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .review-rate {
          color: #d4af37;
          font-size: 14px;
        }
        .review-comment {
          color: #ddd;
          background-color: #222;
          padding: 12px 16px;
          border-radius: 8px;
          border-left: 3px solid #d4af37;
          margin-bottom: 16px;
          word-break: break-word;
        }
        .review-reply-box {
          background-color: rgba(212,175,55,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          padding: 16px;
          border-radius: 8px;
          margin-left: 24px;
        }
        .review-reply-header {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
        }
        .review-reply-date {
          color: #666;
          font-size: 12px;
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .review-reply-input {
          display: flex;
          gap: 12px;
          margin-left: 24px;
          align-items: stretch;
        }
        
        @media (max-width: 576px) {
          .review-card { padding: 12px; }
          .review-header { flex-direction: column; }
          .review-actions { width: 100%; justify-content: space-between; }
          .review-reply-box { margin-left: 0; padding: 12px; }
          .review-reply-input { margin-left: 0; flex-direction: column; }
          .review-reply-date { margin-left: 0; width: 100%; }
        }
      `}</style>
    </Modal>
  );
};

export default AdminReviewModal;

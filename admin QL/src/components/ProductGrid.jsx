import React, { useState } from 'react';
import { Tag, Space, Button, Tooltip, Popconfirm, Pagination, Checkbox } from 'antd';
import { Edit, Trash2, MessageCircle, Eye, AlertTriangle, ImageIcon } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_URL = window.location.port === '5173' ? 'http://localhost:5174' : 'http://localhost:5173';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  let normalized = url.replace(/\\/g, '/');
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  if (normalized.startsWith('/uploads/')) return `${BACKEND_URL}${normalized}`;
  return `${FRONTEND_URL}${normalized}`;
};

const ImagePreview = ({ src, size = 60 }) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgUrl = getImageUrl(src);

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 8,
      overflow: 'hidden',
      border: hasError ? '2px solid #ff4d4f' : '1px solid #333',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      flexShrink: 0,
    }}>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="preview"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: hasError ? 'none' : 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
        />
      ) : null}
      {(hasError || !imgUrl) && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {hasError ? <AlertTriangle size={16} style={{ color: '#ff4d4f' }} /> : <ImageIcon size={16} style={{ color: '#444' }} />}
          <span style={{ fontSize: 8, color: '#666' }}>{hasError ? 'Lỗi' : 'Trống'}</span>
        </div>
      )}
    </div>
  );
};

const productCategories = [
  { name: 'Tông đơ', slug: 'tong-do' },
  { name: 'Kéo cắt & tỉa', slug: 'keo-cat' },
  { name: 'Máy làm tóc', slug: 'may-lam-toc' },
  { name: 'Gôm xịt tóc', slug: 'gom-xit' },
  { name: 'Sáp vuốt tóc', slug: 'sap-vuot' },
  { name: 'Sản phẩm dưỡng tóc', slug: 'duong-toc' },
  { name: 'Khác', slug: 'khac' },
];

const getCategoryName = (slug) => {
  const cat = productCategories.find(c => c.slug === slug);
  return cat ? cat.name : slug || 'Chưa phân loại';
};

const ProductGrid = ({ data, loading, onEdit, onDelete, onViewReview, onViewDetail, isEditor, selectedRowKeys, onSelectRow }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  if (loading) {
    return <div style={{ color: '#aaa', padding: 24, textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }

  if (!data || data.length === 0) {
    return <div style={{ color: '#aaa', padding: 24, textAlign: 'center' }}>Không tìm thấy sản phẩm nào.</div>;
  }

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className="product-grid">
        {paginatedData.map(record => {
          const isOut = (record.stock ?? 0) === 0;
          const isSelected = selectedRowKeys.includes(record.id);
          
          return (
            <div key={record.id} className={`product-card ${isSelected ? 'selected' : ''} ${isOut ? 'out-of-stock' : ''}`} onClick={() => !isEditor && onSelectRow(record.id)}>
              
              {!isEditor && (
                <div className="checkbox-container">
                  <Checkbox checked={isSelected} onChange={(e) => { e.stopPropagation(); onSelectRow(record.id); }} />
                </div>
              )}

              <div className="product-card-header">
                <ImagePreview src={record.thumbnail} size={80} />
                <div className="product-card-title">
                  <h3 title={record.name}>{record.name}</h3>
                  <div className="product-category">
                    <Tag color="blue">{getCategoryName(record.category)}</Tag>
                    <Tag color="cyan">{record.branch === 'Online' || !record.branch ? 'Online' : record.branch}</Tag>
                  </div>
                </div>
              </div>

              <div className="product-card-body">
                <div className="product-price-section">
                  <span className="current-price">{record.price?.toLocaleString('vi-VN')}₫</span>
                  {record.oldPrice && <span className="old-price">{record.oldPrice.toLocaleString('vi-VN')}₫</span>}
                </div>

                <div className="product-features">
                  {record.isSale && <Tag color="red" style={{ fontSize: 10, margin: 0 }}>SALE</Tag>}
                  {record.isBestSeller && <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>BEST</Tag>}
                  {record.isNew && <Tag color="green" style={{ fontSize: 10, margin: 0 }}>NEW</Tag>}
                  {!record.isSale && !record.isBestSeller && !record.isNew && <span style={{ color: '#555', fontSize: 10 }}>Mặc định</span>}
                </div>
                
                <div className="product-stock">
                  Kho: <Tag color={isOut ? 'error' : 'success'} style={{ fontWeight: 'bold', margin: 0, marginLeft: 4 }}>{isOut ? 'HẾT' : record.stock}</Tag>
                </div>
              </div>

              <div className="product-card-footer" onClick={e => e.stopPropagation()}>
                <Tooltip title="Xem chi tiết">
                  <Button type="text" className="action-btn view-detail-btn" icon={<Eye size={16} />} onClick={() => onViewDetail(record)} />
                </Tooltip>
                
                <Tooltip title="Xem đánh giá">
                  <Button type="text" className="action-btn view-btn" icon={<MessageCircle size={16} />} onClick={() => onViewReview(record)} />
                </Tooltip>

                {!isEditor && (
                  <>
                    <Tooltip title="Sửa">
                      <Button type="text" className="action-btn edit-btn" icon={<Edit size={16} />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Popconfirm title="Xác nhận xóa?" onConfirm={() => onDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                        <Button type="text" danger className="action-btn delete-btn" icon={<Trash2 size={16} />} />
                      </Popconfirm>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <Pagination current={currentPage} total={data.length} pageSize={pageSize} onChange={setCurrentPage} showSizeChanger={false} />
      </div>

      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          padding: 8px;
        }
        
        .product-card {
          background-color: #111;
          border: 1px solid #222;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          position: relative;
          cursor: pointer;
        }
        
        .product-card:hover {
          border-color: #333;
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }

        .product-card.selected {
          border-color: #d4af37;
          background-color: rgba(212, 175, 55, 0.05);
        }

        .product-card.out-of-stock {
          opacity: 0.7;
        }

        .checkbox-container {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
        }

        .product-card-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .product-card-title {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
        }

        .product-card-title h3 {
          margin: 0;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-category {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .product-card-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(255,255,255,0.02);
          padding: 12px;
          border-radius: 10px;
        }

        .product-price-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .current-price {
          color: #d4af37;
          font-weight: 800;
          font-size: 16px;
        }

        .old-price {
          color: #666;
          text-decoration: line-through;
          font-size: 12px;
        }

        .product-features {
          display: flex;
          gap: 6px;
        }

        .product-stock {
          font-size: 12px;
          color: #888;
          display: flex;
          align-items: center;
        }

        .product-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          border-top: 1px solid #222;
          padding-top: 12px;
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

        .view-detail-btn { color: #52c41a; }
        .view-btn { color: #d4af37; }
        .edit-btn { color: #1890ff; }
        .delete-btn { color: #ff4d4f; }
      `}</style>
    </div>
  );
};

export default ProductGrid;

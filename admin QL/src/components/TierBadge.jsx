import React from 'react';

// Tổng số lần đặt → Hạng mức (phong tước)
export const getTier = (bookingCount) => {
  if (bookingCount === 0) return { label: '⭐ Ngôi Sao Mới', color: '#808080', bg: 'rgba(128,128,128,0.15)' };
  if (bookingCount <= 3) return { label: '🎤 Người Của Công Chúng', color: '#52c4ff', bg: 'rgba(82,196,255,0.15)' };
  if (bookingCount <= 10) return { label: '🗡️ Sát Thủ Lịch Lãm', color: '#7c4dff', bg: 'rgba(124,77,255,0.15)' };
  if (bookingCount <= 25) return { label: '🏛️ Biểu Tượng Thời Đại', color: '#d4af37', bg: 'rgba(212,175,55,0.15)' };
  return { label: '🌌 Vũ Trụ Nhan Sắc', color: '#ff4dde', bg: 'rgba(255,77,222,0.15)' };
};

/**
 * Badge hiển thị hạng mức phong tước
 */
const TierBadge = ({ bookingCount }) => {
  const tier = getTier(bookingCount);
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: tier.color,
      background: tier.bg,
      border: `1px solid ${tier.color}40`,
      whiteSpace: 'nowrap',
    }}>
      {tier.label}
    </span>
  );
};

export default TierBadge;

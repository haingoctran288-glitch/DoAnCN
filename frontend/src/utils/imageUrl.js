/**
 * Chuẩn hóa URL ảnh sản phẩm:
 * - Chuyển backslash (\) thành forward slash (/)
 * - Thêm "/" đầu nếu thiếu
 * - Trả về fallback nếu URL rỗng/null
 */
export const normalizeImageUrl = (url, fallback = '/images/default.jpg') => {
  if (!url || url.trim() === '') return fallback;
  // Đã là URL tuyệt đối → giữ nguyên
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Chuẩn hóa: backslash → forward slash
  let normalized = url.replace(/\\/g, '/');
  // Thêm "/" đầu nếu thiếu
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  
  // Nếu là ảnh tải lên server (bắt đầu bằng /uploads/), trỏ về Backend
  if (normalized.startsWith('/uploads/')) {
    return `http://localhost:8080${normalized}`;
  }
  
  return normalized;
};

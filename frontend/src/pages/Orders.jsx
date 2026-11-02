import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, Eye, XCircle, RotateCcw, Star, X } from 'lucide-react';
import { getOrdersByUser, cancelOrder } from '../api/orders';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const TABS = [
  { key: '',          label: 'Tất cả' },
  { key: 'pending',   label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Chờ giao hàng' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const statusConfig = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  confirmed: { label: 'Chờ giao hàng', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  delivered: { label: 'Đã giao', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const CANCEL_REASONS = [
  'Đổi ý không mua nữa',
  'Đặt nhầm sản phẩm',
  'Tìm được giá tốt hơn',
  'Khác',
];

const Orders = () => {
  const navigate = useNavigate();
  const { reorderToCart, cartItems } = useCart();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  // Cancel modal state
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null });
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Reorder duplicate state
  const [duplicateModal, setDuplicateModal] = useState({ open: false, items: [], count: 0 });
  const [duplicateChoice, setDuplicateChoice] = useState('ACCUMULATE'); // ACCUMULATE | KEEP
  const [showConfirm, setShowConfirm] = useState(false);

  const userId = localStorage.getItem('userId') || 0;

  const fetchOrders = (status = '') => {
    setLoading(true);
    getOrdersByUser(userId, status)
      .then(data => setOrders(data))
      .catch(err => console.error('Lỗi fetch orders:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Cancel logic
  const openCancelModal = (orderId) => {
    setCancelModal({ open: true, orderId });
    setCancelReason(CANCEL_REASONS[0]);
    setCustomReason('');
  };

  const handleCancelSubmit = async () => {
    const reason = cancelReason === 'Khác' ? (customReason || 'Lý do khác') : cancelReason;
    setCancelling(true);
    try {
      await cancelOrder(cancelModal.orderId, reason);
      addToast({ title: 'Đã hủy đơn hàng', message: `Đơn #${cancelModal.orderId} đã bị hủy` });
      setCancelModal({ open: false, orderId: null });
      fetchOrders(activeTab);
    } catch (err) {
      addToast({ title: 'Lỗi', message: 'Không thể hủy đơn hàng', type: 'remove' });
    } finally {
      setCancelling(false);
    }
  };

  // Reorder logic — dùng reorderToCart để merge + đẩy đầu + auto-check
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;

    const cartIds = cartItems.map(i => i.id);
    const duplicates = order.items.filter(item => cartIds.includes(item.productId));

    if (duplicates.length > 0) {
      setDuplicateModal({ open: true, items: order.items, count: duplicates.length });
      setDuplicateChoice('ACCUMULATE');
      setShowConfirm(false);
    } else {
      executeReorder(order.items, 'ACCUMULATE');
    }
  };

  const executeReorder = (items, mergeType) => {
    reorderToCart(items, mergeType);
    setDuplicateModal({ open: false, items: [], count: 0 });
    setShowConfirm(false);
    addToast({ title: 'Đã cập nhật giỏ hàng', message: 'Các sản phẩm đã được thêm vào giỏ' });
    navigate('/cart');
  };

  return (
    <div className="min-h-screen pt-24 pb-32 bg-primary text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-accent hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold uppercase tracking-wider text-sm">Quay lại</span>
        </button>

        <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-white flex items-center gap-3 mb-8">
          <span className="w-2 h-8 bg-accent block"></span>
          Lịch Sử Đơn Hàng
        </h1>

        {/* ===== TABS ===== */}
        <div className="flex overflow-x-auto gap-0 border-b border-gray-800 mb-8 custom-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`relative px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'text-accent'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {/* Active underline */}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent rounded-t-full transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>

        {/* ===== CONTENT ===== */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-28 bg-[#111] rounded-2xl border border-gray-800">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-400 mb-6">
              {activeTab === 'cancelled' ? 'Bạn chưa hủy đơn nào — tốt lắm!' : 'Hãy mua sắm và quay lại đây nhé!'}
            </p>
            <button onClick={() => navigate('/products')} className="bg-accent text-primary font-bold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const st = statusConfig[order.status] || statusConfig.pending;
              const isPending = order.status === 'pending';
              const isCancelled = order.status === 'cancelled';
              const isDelivered = order.status === 'delivered';

              return (
                <div key={order.id} className="bg-[#111] rounded-2xl border border-gray-800 p-5 sm:p-6 hover:border-gray-700 transition-all">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="text-accent font-bold text-lg">Đơn #{order.id}</span>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border self-start sm:self-auto ${st.color}`}>
                      {st.label}
                    </span>
                  </div>

                  {/* Products */}
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar mb-4">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex-shrink-0 relative">
                        <img
                          src={item.productImage || '/images/default.jpg'}
                          alt={item.productName}
                          onError={(e) => { if (!e.target.dataset.fallback) { e.target.src = '/images/default.jpg'; e.target.dataset.fallback = 'true'; } }}
                          className="w-14 h-14 rounded-lg object-cover bg-[#1a1a1a] border border-gray-800"
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 bg-accent text-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cancelled info */}
                  {isCancelled && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-4 text-sm">
                      <p className="text-red-400 font-medium mb-1">Lý do hủy: <span className="text-gray-300 font-normal">{order.cancelReason || 'Không rõ'}</span></p>
                      {order.cancelTime && <p className="text-gray-500 text-xs">Hủy lúc: {formatDate(order.cancelTime)}</p>}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-800 pt-4 gap-3">
                    <div className="text-sm text-gray-400">
                      <span>{order.paymentMethod}</span>
                      <span className="mx-2">•</span>
                      <span>{order.items ? order.items.length : 0} sản phẩm</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xl font-bold text-accent">{order.totalPrice?.toLocaleString('vi-VN')}₫</span>

                      {/* Action buttons */}
                      {isPending && (order.paymentMethod === 'COD' || order.paymentStatus !== 'PAID') ? (
                        <button
                          onClick={() => openCancelModal(order.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Hủy đơn
                        </button>
                      ) : isPending && (order.paymentMethod === 'VNPAY' || order.paymentMethod === 'MOMO') && order.paymentStatus === 'PAID' ? (
                        <button
                          onClick={() => addToast({ title: 'Không thể tự hủy', message: 'Đơn hàng đã thanh toán online. Vui lòng liên hệ Admin để hủy và hoàn tiền.' })}
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Hủy đơn
                        </button>
                      ) : null}

                      {!isPending && !isCancelled && !isDelivered && (
                        <button
                          onClick={() => addToast({ title: 'Không thể hủy', message: 'Đơn hàng đang được xử lý, không thể hủy' })}
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-700 px-3 py-1.5 rounded-lg cursor-not-allowed opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Hủy đơn
                        </button>
                      )}

                      {isCancelled && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-yellow-300 border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Mua lại
                        </button>
                      )}

                      {isDelivered && (
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 px-3 py-1.5 rounded-lg hover:bg-yellow-500/10 transition-colors"
                        >
                          <Star className="w-3.5 h-3.5" /> Đánh giá
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-yellow-300 border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== CANCEL MODAL ===== */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setCancelModal({ open: false, orderId: null })}>
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Hủy đơn hàng #{cancelModal.orderId}</h3>
              <button onClick={() => setCancelModal({ open: false, orderId: null })} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-4">Vui lòng chọn lý do hủy đơn:</p>

            <div className="space-y-2.5 mb-5">
              {CANCEL_REASONS.map(reason => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    cancelReason === reason
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="accent-[#d4af37] w-4 h-4"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>

            {cancelReason === 'Khác' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do cụ thể..."
                rows={2}
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white px-4 py-3 rounded-xl mb-5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none text-sm"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal({ open: false, orderId: null })}
                className="flex-1 py-3 bg-[#1a1a1a] border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-[#222] transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={cancelling}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== REORDER DUPLICATE MODAL ===== */}
      {duplicateModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setDuplicateModal({ open: false, items: [], count: 0 })}>
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Sản phẩm bị trùng</h3>
              <button onClick={() => setDuplicateModal({ open: false, items: [], count: 0 })} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!showConfirm ? (
              <>
                <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-500/90 text-sm">
                  <p>Phát hiện <strong>{duplicateModal.count} sản phẩm</strong> trong đơn hàng cũ đã tồn tại sẵn trong giỏ hàng hiện tại.</p>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">Vui lòng chọn cách xử lý:</p>

                <div className="space-y-3 mb-6">
                  <label
                    className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all ${
                      duplicateChoice === 'ACCUMULATE' ? 'border-accent bg-accent/5' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio" name="duplicateChoice" value="ACCUMULATE"
                        checked={duplicateChoice === 'ACCUMULATE'}
                        onChange={() => setDuplicateChoice('ACCUMULATE')}
                        className="accent-[#d4af37] w-4 h-4 mt-0.5"
                      />
                      <span className="font-semibold text-white">Cộng dồn số lượng</span>
                    </div>
                    <span className="text-xs text-gray-400 ml-7">Số lượng từ đơn cũ sẽ được cộng thêm vào giỏ hàng (VD: đang có 2, mua thêm 5 thành 7).</span>
                  </label>

                  <label
                    className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all ${
                      duplicateChoice === 'KEEP' ? 'border-accent bg-accent/5' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio" name="duplicateChoice" value="KEEP"
                        checked={duplicateChoice === 'KEEP'}
                        onChange={() => setDuplicateChoice('KEEP')}
                        className="accent-[#d4af37] w-4 h-4 mt-0.5"
                      />
                      <span className="font-semibold text-white">Giữ nguyên số lượng</span>
                    </div>
                    <span className="text-xs text-gray-400 ml-7">Giữ nguyên số lượng món đồ đang có trong giỏ, chỉ thêm đồ chưa có.</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-3 bg-accent hover:opacity-90 text-primary font-bold rounded-xl transition-all"
                  >
                    Tiếp tục
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8 mt-2">
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <RotateCcw className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Bạn có chắc chắn?</h4>
                  <p className="text-gray-400 text-sm px-4">
                    {duplicateChoice === 'ACCUMULATE' 
                      ? 'Khoản trùng lặp sẽ cộng tăng số lượng trong giỏ hàng.'
                      : 'Các sản phẩm đã có sẽ không thay đổi số lượng, chỉ đồ mới được thêm vào.'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 bg-[#1a1a1a] border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-[#222] transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => executeReorder(duplicateModal.items, duplicateChoice)}
                    className="flex-1 py-3 bg-accent hover:opacity-90 text-primary font-bold rounded-xl transition-colors"
                  >
                    Xác nhận
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

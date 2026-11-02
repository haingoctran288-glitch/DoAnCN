import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Phone, User, CreditCard, Truck } from 'lucide-react';
import { getOrderById } from '../api/orders';
import ReviewSection from '../components/ReviewSection';

const statusConfig = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  shipped:   { label: 'Đang giao', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  delivered: { label: 'Đã giao', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  cancelled: { label: 'Đã huỷ', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(data => setOrder(data))
      .catch(err => console.error('Lỗi fetch order detail:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex justify-center items-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-primary text-white">
        <h2 className="text-3xl font-bold mb-4 text-accent">Không tìm thấy đơn hàng</h2>
        <button onClick={() => navigate('/orders')} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-bold">
          <ArrowLeft className="inline w-5 h-5 mr-2" /> Về lịch sử
        </button>
      </div>
    );
  }

  const st = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="min-h-screen pt-24 pb-32 bg-primary text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-accent hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold uppercase tracking-wider text-sm">Quay lại</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
          <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-accent block"></span>
            Đơn Hàng #{order.id}
          </h1>
          <span className={`mt-4 sm:mt-0 text-sm font-bold px-4 py-2 rounded-full border ${st.color}`}>
            {st.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Thông tin giao hàng */}
          <div className="bg-[#111] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" /> Giao hàng
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <span>{order.name}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="bg-[#111] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent" /> Thanh toán
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Phương thức</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phí ship</span>
                <span>{order.shippingFee?.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-3">
                <span className="font-bold text-white">Tổng cộng</span>
                <span className="font-bold text-accent text-lg">{order.totalPrice?.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>

          {/* Ngày đặt */}
          <div className="bg-[#111] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" /> Thông tin đơn
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Mã đơn</span>
                <span className="font-semibold text-accent">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ngày đặt</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Số SP</span>
                <span>{order.items ? order.items.length : 0} sản phẩm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mt-8 bg-[#111] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-800 pb-4">Sản phẩm trong đơn</h3>
          <div className="space-y-4">
            {order.items && order.items.map((item, idx) => (
              <div key={idx} className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
                <div className="flex items-center gap-4 p-4 border-b border-gray-800/50">
                  <img
                    src={item.productImage || '/images/default.jpg'}
                    alt={item.productName}
                    onError={(e) => { if (!e.target.dataset.fallback) { e.target.src = '/images/default.jpg'; e.target.dataset.fallback = 'true'; } }}
                    className="w-16 h-16 rounded-lg object-cover bg-[#222] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{item.productName}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <span className="font-bold text-accent whitespace-nowrap">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                </div>
                
                {/* Đánh giá sản phẩm */}
                <div className="p-4 bg-[#111]">
                  <ReviewSection 
                    type="product"
                    itemId={item.productId}
                    transactionId={order.id}
                    status={order.status}
                    isCompleted={order.status === 'delivered'}
                    itemName={item.productName}
                    itemImage={item.productImage}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;

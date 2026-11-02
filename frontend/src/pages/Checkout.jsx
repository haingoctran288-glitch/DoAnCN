import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User, CreditCard, Truck, ShieldCheck, ChevronRight, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../api/orders';
import { createVnPayPayment, createMoMoPayment } from '../api/payment';
import { getAddressesByUser } from '../api/addresses';
import AddressBookModal from '../components/AddressBookModal';
import { normalizeImageUrl } from '../utils/imageUrl';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeItemsFromCart } = useCart();
  const { addToast } = useToast();

  // Khôi phục dữ liệu từ state hoặc localStorage nếu bị reload/quay lại
  const [checkoutItems, setCheckoutItems] = useState(() => {
    const stateItems = location.state?.items;
    if (stateItems && stateItems.length > 0) return stateItems;
    
    const savedData = localStorage.getItem('pendingCheckout');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed.items || [];
      } catch (e) { return []; }
    }
    return [];
  });

  const [fromBuyNow, setFromBuyNow] = useState(() => {
    const stateFrom = location.state?.fromBuyNow;
    if (stateFrom !== undefined) return stateFrom;

    const savedData = localStorage.getItem('pendingCheckout');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed.fromBuyNow || false;
      } catch (e) { return false; }
    }
    return false;
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    const savedData = localStorage.getItem('pendingCheckout');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.selectedAddress) return parsed.selectedAddress;
      } catch (e) {}
    }
    return null;
  });

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [isCodLocked, setIsCodLocked] = useState(false);
  const userId = localStorage.getItem('userId') || 0;

  useEffect(() => {
    if (userId > 0) {
      fetch(`http://localhost:8080/api/customers/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.isCashPaymentLocked) {
            setIsCodLocked(true);
            setPaymentMethod(prev => prev === 'COD' ? 'VNPAY' : prev);
          }
        })
        .catch(err => console.error(err));
    }
  }, [userId]);

  useEffect(() => {
    // Tự động tải địa chỉ mặc định nếu chưa có
    if (!selectedAddress && userId > 0) {
      getAddressesByUser(userId).then(res => {
        if (res.data && res.data.length > 0) {
          const def = res.data.find(a => a.isDefault) || res.data[0];
          setSelectedAddress(def);
        }
      }).catch(err => console.error(err));
    }
  }, [userId, selectedAddress]);

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const savedData = localStorage.getItem('pendingCheckout');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.paymentMethod) return parsed.paymentMethod;
      } catch (e) {}
    }
    return 'COD';
  });

  const [submitting, setSubmitting] = useState(false);
  const hasRedirected = React.useRef(false);

  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [claimingVoucher, setClaimingVoucher] = useState(false);

  const SHIPPING_FEE = 30000;
  const subtotal = checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const fetchVouchers = () => {
    if (userId > 0) {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:8080/api/customer-vouchers/my-vouchers`, {
        params: { userId, status: 'UNUSED' },
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const list = (res.data || []).filter(cv => {
          const v = cv.voucher;
          if (!v) return false;
          const matchesScope = v.applyTo === 'ALL' || v.applyTo === 'PRODUCT';
          return matchesScope; // Remove meetsMinSpend from filter so it can be greyed out instead of hidden
        });
        setVouchers(list);
      })
      .catch(err => console.error('Lỗi tải voucher:', err));
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [userId, subtotal]);

  const handleClaimVoucher = async () => {
    if (!voucherCodeInput.trim()) {
      addToast({ title: 'Lỗi', message: 'Vui lòng nhập mã voucher', type: 'remove' });
      return;
    }
    setClaimingVoucher(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/customer-vouchers/claim`, 
        { userId, code: voucherCodeInput.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast({ title: 'Thành công', message: 'Lưu mã voucher thành công!' });
      setVoucherCodeInput('');
      fetchVouchers();
    } catch (err) {
      addToast({ 
        title: 'Lỗi', 
        message: err.response?.data?.message || 'Không thể lưu mã voucher', 
        type: 'remove' 
      });
    } finally {
      setClaimingVoucher(false);
    }
  };

  useEffect(() => {
    // Chỉ chuyển hướng nếu thực sự không có sản phẩm nào (kể cả trong localStorage)
    if (checkoutItems.length === 0 && !hasRedirected.current) {
      const savedData = localStorage.getItem('pendingCheckout');
      if (!savedData) {
        hasRedirected.current = true;
        addToast({ title: 'Lỗi', message: 'Bạn chưa chọn sản phẩm nào để thanh toán', type: 'remove' });
        navigate('/cart', { replace: true });
      }
    }
  }, [checkoutItems, navigate, addToast]);

  const discountAmount = selectedVoucher ? (
    selectedVoucher.voucher.voucherType === 'PERCENTAGE' 
      ? Math.min((subtotal * selectedVoucher.voucher.value) / 100, selectedVoucher.voucher.maxDiscount || Infinity)
      : selectedVoucher.voucher.value
  ) : 0;

  const total = Math.max(0, subtotal + SHIPPING_FEE - discountAmount);

  const handleChange = (e) => {
    // Không còn dùng handleChange cho form
  };

  const handleSubmit = async () => {
    if (!userId || userId === 0) {
      addToast({ title: 'Chưa đăng nhập', message: 'Vui lòng đăng nhập để đặt hàng', type: 'remove' });
      navigate('/login');
      return;
    }
    if (!selectedAddress) {
      addToast({ title: 'Thiếu thông tin', message: 'Vui lòng chọn địa chỉ giao hàng', type: 'remove' });
      return;
    }
    if (checkoutItems.length === 0) {
      addToast({ title: 'Giỏ hàng trống', message: 'Không có sản phẩm để đặt hàng', type: 'remove' });
      return;
    }

    setSubmitting(true);
    try {
      // Lấy userId từ localStorage (nếu chưa đăng nhập thì dùng 0)
      const userId = localStorage.getItem('userId') || 0;

      const orderData = {
        userId: Number(userId),
        addressId: selectedAddress.id,
        paymentMethod,
        shippingFee: SHIPPING_FEE,
        totalPrice: subtotal + SHIPPING_FEE, // Backend expects original price and will apply discount
        customerVoucherId: selectedVoucher ? selectedVoucher.id : null,
        status: 'pending',
        items: checkoutItems.map(item => ({
          productId: item.id,
          productName: item.name,
          productImage: normalizeImageUrl(item.thumbnail || item.image1),
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const orderResponse = await createOrder(orderData);
      
      if (paymentMethod === 'VNPAY') {
        const paymentResponse = await createVnPayPayment(orderResponse.id, orderResponse.totalPrice);
        if (paymentResponse.paymentUrl) {
          // Lưu thông tin thanh toán tạm thời để có thể "Thử lại" nếu thất bại
          const pendingData = {
            items: checkoutItems,
            fromBuyNow,
            orderId: orderResponse.id,
            selectedAddress,
            paymentMethod
          };
          localStorage.setItem('pendingCheckout', JSON.stringify(pendingData));
          
          window.location.href = paymentResponse.paymentUrl;
          return;
        }
      } else if (paymentMethod === 'MOMO') {
        const returnUrl = window.location.origin + '/payment-return';
        const paymentResponse = await createMoMoPayment(orderResponse.id, orderResponse.totalPrice, returnUrl);
        if (paymentResponse.paymentUrl) {
          const pendingData = {
            items: checkoutItems,
            fromBuyNow,
            orderId: orderResponse.id,
            selectedAddress,
            paymentMethod
          };
          localStorage.setItem('pendingCheckout', JSON.stringify(pendingData));

          window.location.href = paymentResponse.paymentUrl;
          return;
        }
      } else {
        // Luồng COD: Xóa giỏ hàng ngay và chuyển đến trang đơn hàng
        if (!fromBuyNow) {
          const itemIdsToRemove = checkoutItems.map(item => item.id);
          removeItemsFromCart(itemIdsToRemove);
        }
        localStorage.removeItem('pendingCheckout'); // Xóa dữ liệu tạm sau khi đặt hàng thành công (COD)
        addToast({ title: 'Đặt hàng thành công!', message: 'Đơn hàng của bạn đã được ghi nhận' });
        navigate('/orders');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        addToast({ title: 'Bị chặn', message: err.response.data.error || 'Tài khoản của bạn đã bị khóa', type: 'remove' });
      } else if (err.response && err.response.data && err.response.data.message) {
        addToast({ title: 'Lỗi đặt hàng', message: err.response.data.message, type: 'remove' });
      } else if (err.response && typeof err.response.data === 'string') {
        addToast({ title: 'Lỗi đặt hàng', message: err.response.data, type: 'remove' });
      } else {
        addToast({ title: 'Lỗi đặt hàng', message: 'Vui lòng thử lại sau', type: 'remove' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-primary flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4 text-accent">Chưa chọn sản phẩm</h2>
        <p className="text-gray-400 mb-6">Xin vui lòng chọn ít nhất 1 sản phẩm trước khi thanh toán.</p>
        <button onClick={() => navigate('/cart')} className="bg-accent text-primary font-bold px-6 py-3 rounded-xl">
          Quay lại giỏ hàng
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 bg-primary text-white font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-accent hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold uppercase tracking-wider text-sm">Quay lại</span>
        </button>

        <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-white flex items-center gap-3 mb-10">
          <span className="w-2 h-8 bg-accent block"></span>
          Thanh Toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Thông tin người nhận (Shopee Style Refactored) */}
            <div className="bg-[#111] rounded-xl border border-[#2a2a2a] p-5 relative overflow-hidden group hover:bg-[#161616] transition-colors duration-300 shadow-xl">
              {/* Stripe pattern border-top like Shopee */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#ff4d4f,#ff4d4f_10px,transparent_10px,transparent_20px,#1890ff_20px,#1890ff_30px,transparent_30px,transparent_40px)]"></div>
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[17px] font-bold text-accent flex items-center gap-2 uppercase tracking-wide">
                  <MapPin className="w-5 h-5" /> Địa Chỉ Nhận Hàng
                </h2>
                <button 
                  onClick={() => setAddressModalOpen(true)}
                  className="text-accent hover:underline font-bold text-sm flex items-center"
                >
                  Thay đổi <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {selectedAddress ? (
                <div className="flex flex-col gap-2">
                  {/* Dòng 1: Tên + SĐT + Badge */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-lg font-extrabold text-white">{selectedAddress.name}</span>
                    <span className="text-gray-500 font-medium">{selectedAddress.phone}</span>
                    {selectedAddress.isDefault && (
                      <span className="bg-[#facc15] text-black px-2 py-0.5 rounded-[6px] text-[12px] font-bold shadow-sm">
                        Mặc định
                      </span>
                    )}
                  </div>
                  
                  {/* Dòng 2: Địa chỉ */}
                  <div className="text-gray-400 text-[15px] leading-relaxed break-words">
                    {selectedAddress.address}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-400 bg-white/5 rounded-lg border border-dashed border-gray-800">
                  <p className="mb-4">Bạn chưa chọn địa chỉ giao hàng nào.</p>
                  <button 
                    onClick={() => setAddressModalOpen(true)}
                    className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl hover:scale-105 transition-transform"
                  >
                    Chọn địa chỉ ngay
                  </button>
                </div>
              )}
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-[#111] rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                <CreditCard className="w-5 h-5 text-accent" /> Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {[
                  { 
                    value: 'COD', 
                    label: 'Thanh toán khi nhận hàng (COD)', 
                    subLabel: 'Trả tiền mặt khi nhận hàng',
                    enabled: !isCodLocked,
                    isCodRestricted: isCodLocked,
                    icon: (
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-700 overflow-hidden p-1">
                        <img 
                          src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-cod.svg" 
                          alt="COD" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    )
                  },
                  { 
                    value: 'VNPAY', 
                    label: 'VNPay', 
                    subLabel: 'Thẻ ATM / Visa / QR Code',
                    enabled: true,
                    icon: (
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-700 overflow-hidden p-1">
                        <img 
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png" 
                          alt="VNPay" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    )
                  },
                  { 
                    value: 'MOMO', 
                    label: 'MoMo', 
                    subLabel: 'Ví điện tử MoMo',
                    enabled: true,
                    icon: (
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-700 overflow-hidden p-1.5">
                        <img 
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png" 
                          alt="MoMo" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    )
                  },
                ].map(method => (
                  <label key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === method.value ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-gray-800 hover:border-gray-600'
                    } ${!method.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio" name="payment" value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => method.enabled && setPaymentMethod(method.value)}
                      disabled={!method.enabled}
                      className="accent-[#d4af37] w-4 h-4 shrink-0"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      {method.icon}
                      <div>
                        <div className="text-white font-medium text-sm">{method.label}</div>
                        <div className="text-gray-500 text-xs">{method.subLabel}</div>
                        {method.isCodRestricted && (
                          <div className="text-red-500 text-xs font-medium mt-1">
                            Chức năng thanh toán bằng tiền mặt của tài khoản quý khách tạm thời bị khóa.
                          </div>
                        )}
                      </div>
                    </div>
                    {!method.enabled && !method.isCodRestricted && <span className="text-xs text-gray-500 ml-auto">(Sắp ra mắt)</span>}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] rounded-2xl border border-gray-800 p-6 sticky top-28">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                <ShieldCheck className="w-5 h-5 text-accent" /> Đơn hàng của bạn
              </h2>

              {/* Product list */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {checkoutItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={normalizeImageUrl(item.thumbnail || item.image1)}
                      alt={item.name}
                      onError={(e) => { if (!e.target.dataset.fallback) { e.target.src = '/images/default.jpg'; e.target.dataset.fallback = 'true'; } }}
                      className="w-14 h-14 rounded-lg object-cover bg-[#1a1a1a] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-accent whitespace-nowrap">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>

              {/* Vouchers section */}
              <div className="border-t border-gray-800 pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-accent" /> Mã Khuyến Mãi
                  </span>
                  {vouchers.length > 0 && (
                    <span className="text-[11px] bg-accent/10 border border-accent/30 text-accent font-bold px-2 py-0.5 rounded-full">
                      {vouchers.length} khả dụng
                    </span>
                  )}
                </div>
                
                {selectedVoucher ? (
                  <div className="flex items-center justify-between bg-accent/5 border border-accent/30 rounded-xl p-3">
                    <div className="min-w-0">
                      <div className="text-white text-xs font-bold font-mono bg-accent/20 px-2 py-0.5 rounded inline-block">
                        {selectedVoucher.voucher.code}
                      </div>
                      <p className="text-xs text-accent font-medium mt-1 truncate max-w-[150px]">{selectedVoucher.voucher.name}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSelectedVoucher(null)}
                      className="text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-wider pl-2"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsVoucherModalOpen(true)}
                    className="w-full flex items-center justify-between bg-white/5 border border-gray-800 hover:border-accent/50 rounded-xl p-3 text-left transition-all"
                  >
                    <span className="text-gray-400 text-sm">Chọn hoặc nhập mã ưu đãi</span>
                    <span className="text-accent hover:underline font-bold text-xs">Xem thêm</span>
                  </button>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm text-gray-400 border-t border-gray-800 pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính ({checkoutItems.length} sản phẩm)</span>
                  <span className="text-white">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span className="text-white">{SHIPPING_FEE.toLocaleString('vi-VN')}₫</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-accent font-bold">
                    <span>Khuyến mãi</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between items-end">
                <span className="text-lg font-bold text-white uppercase">Tổng Cộng</span>
                <span className="text-2xl font-bold text-accent">{total.toLocaleString('vi-VN')}₫</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-6 py-4 bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-primary font-bold text-lg uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang xử lý...' : 'Đặt Hàng'}
              </button>
            </div>
          </div>

        </div>
      </div>

      <AddressBookModal 
        isOpen={addressModalOpen} 
        onClose={() => setAddressModalOpen(false)} 
        userId={userId} 
        onSelectAddress={(addr) => setSelectedAddress(addr)}
        selectedAddressId={selectedAddress?.id}
      />

      {/* Voucher Selector Modal Overlay */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111] border border-accent/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-fade-in">
            <div className="p-4 border-b border-gray-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-accent" /> Chọn mã khuyến mãi
                </h3>
                <button onClick={() => setIsVoucherModalOpen(false)} className="text-gray-400 hover:text-white text-lg font-bold p-1">✕</button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 bg-[#0a0a0a]">
              {vouchers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400 text-sm">Bạn không có voucher nào khả dụng cho đơn hàng này.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vouchers.map(cv => {
                    const v = cv.voucher;
                    const isPercentage = v.voucherType === 'PERCENTAGE';
                    const discountValueText = isPercentage ? `${v.value}%` : `${v.value.toLocaleString('vi-VN')}₫`;
                    const meetsMinSpend = subtotal >= (v.minOrderValue || 0);
                    const isSelected = selectedVoucher && selectedVoucher.id === cv.id;
                    
                    return (
                      <div 
                        key={cv.id} 
                        onClick={() => meetsMinSpend && (() => { setSelectedVoucher(cv); setIsVoucherModalOpen(false); })()}
                        className={`relative bg-gradient-to-br from-[#181818] to-[#121212] border rounded-2xl p-4 flex flex-col justify-between shadow-lg overflow-hidden transition-all duration-300 ${
                          !meetsMinSpend 
                            ? 'opacity-50 grayscale cursor-not-allowed border-gray-800' 
                            : isSelected 
                            ? 'border-accent shadow-[0_0_15px_rgba(212,175,55,0.2)] transform -translate-y-0.5 cursor-pointer' 
                            : 'border-gray-800/80 hover:border-accent/50 hover:-translate-y-0.5 cursor-pointer'
                        }`}
                      >
                        {/* Cutouts */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#0a0a0a] border-r border-accent/20 rounded-r-full"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#0a0a0a] border-l border-accent/20 rounded-l-full"></div>
                        
                        {/* Selection Glow */}
                        {isSelected && (
                           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[40px] rounded-full pointer-events-none -z-0"></div>
                        )}

                        <div className="flex justify-between items-start mb-2 relative z-10 pl-2">
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-bold font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                               {v.code}
                             </span>
                             {v.userLimit > 1 && (
                               <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-black tracking-widest flex-shrink-0">
                                 x{v.userLimit - (cv.usedCount || 0)}
                               </span>
                             )}
                           </div>
                        </div>

                        <div className="pl-2 relative z-10">
                          <h4 className="font-bold text-white text-base leading-tight mb-1 truncate pr-6">{v.name}</h4>
                          
                          {/* Apply Scope Badge */}
                          <div className="mb-2">
                            {v.applyTo === 'PRODUCT' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase">
                                Cho Sản Phẩm
                              </span>
                            )}
                            {v.applyTo === 'ALL' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                                Cho Dịch Vụ & Sản Phẩm
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-xl font-bold text-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Giảm {discountValueText}</span>
                            {isPercentage && v.maxDiscount > 0 && (
                              <span className="text-xs text-gray-400 font-medium">Tối đa {v.maxDiscount.toLocaleString('vi-VN')}₫</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                             <div className="text-[10px] text-gray-400 bg-[#000] px-2 py-1 rounded border border-gray-800">
                               Đơn tối thiểu: {(v.minOrderValue || 0).toLocaleString('vi-VN')}₫
                             </div>
                             <div className="text-[10px] text-gray-400 bg-[#000] px-2 py-1 rounded border border-gray-800">
                               HSD: {v.endDate ? (() => {
                                 const d = new Date(v.endDate);
                                 return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                               })() : 'Vô thời hạn'}
                             </div>
                          </div>
                          
                          {!meetsMinSpend && (
                            <div className="text-xs text-red-400 mt-2 font-medium bg-red-500/10 inline-block px-2 py-1 rounded border border-red-500/20">
                              Mua thêm {(v.minOrderValue - subtotal).toLocaleString('vi-VN')}₫ để sử dụng
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

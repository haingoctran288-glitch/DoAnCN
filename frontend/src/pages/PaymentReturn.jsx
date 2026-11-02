import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight, ShoppingBag, Calendar as CalendarIcon } from 'lucide-react';
import { verifyVnPayReturn, verifyMoMoReturn } from '../api/payment';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

const PaymentReturn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { removeItemsFromCart } = useCart();
    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [orderId, setOrderId] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const verifyCalled = React.useRef(false);

    useEffect(() => {
        if (verifyCalled.current) return;
        verifyCalled.current = true;

        const queryParams = new URLSearchParams(location.search);
        
        // VNPAY Params
        const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
        const vnp_TxnRef = queryParams.get('vnp_TxnRef');
        
        // MoMo Params
        const momo_ResultCode = queryParams.get('resultCode');
        const momo_OrderId = queryParams.get('orderId');

        const txnId = vnp_TxnRef || momo_OrderId;
        setOrderId(txnId);
        
        if (txnId && (txnId.startsWith('B_') || txnId.startsWith('MOMO_B'))) {
            setIsBooking(true);
        }

        const verify = async (isMoMo) => {
            try {
                const params = Object.fromEntries(queryParams.entries());
                const result = isMoMo ? await verifyMoMoReturn(params) : await verifyVnPayReturn(params);
                
                // Xóa pendingBookingId vì payment đã được xử lý (thành công hoặc thất bại)
                localStorage.removeItem('pendingBookingId');

                if (result.includes("Success")) {
                    setStatus('success');
                    
                    if (!(txnId && (txnId.startsWith('B_') || txnId.startsWith('MOMO_B')))) {
                        // Nếu là đơn hàng mua sắm, xóa giỏ hàng
                        const pendingDataStr = localStorage.getItem('pendingCheckout');
                        if (pendingDataStr) {
                            try {
                                const pendingData = JSON.parse(pendingDataStr);
                                if (!pendingData.fromBuyNow) {
                                    const ids = pendingData.items.map(item => item.id);
                                    removeItemsFromCart(ids);
                                }
                            } catch (e) {
                                console.error("Failed to parse pending checkout data", e);
                            }
                            localStorage.removeItem('pendingCheckout');
                        }
                    }

                    addToast({ title: 'Thanh toán thành công', message: 'Giao dịch của bạn đã được xác nhận', type: 'success' });
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error("Verification failed", error);
                localStorage.removeItem('pendingBookingId');
                setStatus('failed');
            }
        };

        const isVnPay = queryParams.has('vnp_ResponseCode');
        const isMomo = queryParams.has('resultCode') || queryParams.has('partnerCode');

        if (isVnPay) {
            if (vnp_ResponseCode === '00') {
                verify(false);
            } else {
                setStatus('failed');
            }
        } else if (isMomo) {
            verify(true);
        } else {
            console.warn("No payment provider parameters found in URL");
            setStatus('failed');
        }
    }, [location]);

    return (
        <div className="min-h-screen pt-32 pb-24 bg-primary flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#111] border border-gray-800 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                {/* Background decorative gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 blur-[100px] -z-10"></div>
                
                {status === 'verifying' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <Clock className="w-20 h-20 text-blue-400 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-white">Đang xác thực...</h2>
                        <p className="text-gray-400">Vui lòng không tắt trình duyệt, chúng tôi đang kiểm tra giao dịch của bạn.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <div className="p-4 bg-green-500/10 rounded-full">
                                <CheckCircle className="w-20 h-20 text-green-500" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-white">Thanh Toán Thành Công!</h2>
                        {!isBooking && (
                            <div className="py-4 px-6 bg-[#1a1a1a] rounded-2xl border border-gray-800 text-left">
                                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng:</p>
                                <p className="text-lg font-bold text-accent">#{orderId}</p>
                            </div>
                        )}
                        {isBooking ? (
                            <p className="text-gray-400">
                                Giao dịch thành công! Cảm ơn bạn đã trao niềm tin cho <span className="text-accent font-bold">HORNET ROYALE</span>. Chúng tôi đã sẵn sàng tút lại phong độ cho bạn. Xem chi tiết lịch hẹn ngay bên dưới.
                            </p>
                        ) : (
                            <p className="text-gray-400">
                                Cảm ơn bạn đã tin tưởng dịch vụ của Barber Shop. Bạn có thể xem chi tiết trong phần lịch sử.
                            </p>
                        )}
                        <div className="flex flex-col gap-3 pt-4">
                            <button 
                                onClick={() => navigate(isBooking ? '/booking-history' : '/orders')}
                                className="w-full py-4 bg-accent text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                            >
                                {isBooking ? <CalendarIcon className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                                Xem {isBooking ? 'Lịch Đặt' : 'Đơn Hàng'}
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full py-4 bg-white/5 border border-gray-800 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                            >
                                Về Trang Chủ
                            </button>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <div className="p-4 bg-red-500/10 rounded-full">
                                <XCircle className="w-20 h-20 text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-white">Thanh Toán Thất Bại</h2>
                        <p className="text-gray-400">Giao dịch không thành công hoặc đã bị hủy. Đừng lo lắng, tiền của bạn chưa bị trừ (nếu giao dịch lỗi).</p>
                        <div className="flex flex-col gap-3 pt-4">
                            <button 
                                onClick={() => {
                                    if (isBooking) {
                                        navigate('/booking');
                                    } else {
                                        const pendingDataStr = localStorage.getItem('pendingCheckout');
                                        if (pendingDataStr) {
                                            try {
                                                const pendingData = JSON.parse(pendingDataStr);
                                                navigate('/checkout', { 
                                                    state: { 
                                                        items: pendingData.items, 
                                                        fromBuyNow: pendingData.fromBuyNow 
                                                    } 
                                                });
                                            } catch (e) {
                                                navigate('/cart');
                                            }
                                        } else {
                                            navigate('/cart');
                                        }
                                    }
                                }}
                                className="w-full py-4 bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                                Thử Lại
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('pendingCheckout');
                                    navigate('/');
                                }}
                                className="w-full py-4 bg-white/5 border border-gray-800 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                            >
                                Về Trang Chủ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentReturn;

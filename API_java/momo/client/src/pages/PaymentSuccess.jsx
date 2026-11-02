import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { requestPaymentById } from '../config/paymentRequest';
import Header from '../components/Header';
import { CheckCircle, Package, User, MapPin, Phone, Mail, CreditCard, Calendar } from 'lucide-react';
import { message } from 'antd';

function PaymentSuccess() {
    const { orderId } = useParams();
    const [dataPayment, setDataPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataPayment = async () => {
            try {
                const res = await requestPaymentById(orderId);
                setDataPayment(res.metadata);
                setLoading(false);
            } catch (error) {
                message.error('Không thể tải thông tin đơn hàng');
                setLoading(false);
            }
        };
        fetchDataPayment();
    }, [orderId]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPaymentMethodName = (method) => {
        const methods = {
            cod: 'Thanh toán khi nhận hàng (COD)',
            momo: 'Ví MoMo',
            vnpay: 'VNPay',
        };
        return methods[method] || method;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
            confirmed: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
            shipping: { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
            completed: { text: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
            cancelled: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>{config.text}</span>;
    };

    if (loading) {
        return (
            <div>
                <header>
                    <Header />
                </header>
                <div className="container mx-auto px-4 py-16 text-center">
                    <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (!dataPayment) {
        return (
            <div>
                <header>
                    <Header />
                </header>
                <div className="container mx-auto px-4 py-16 text-center">
                    <p className="text-red-600 text-lg">Không tìm thấy đơn hàng</p>
                    <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    const products = dataPayment.products || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <header>
                <Header />
            </header>

            <div className="container mx-auto px-4 py-8 mt-15">
                {/* Success Message */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="text-green-500" size={80} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt Hàng Thành Công!</h1>
                    <p className="text-gray-600 mb-4">
                        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                        <span className="font-semibold">Mã đơn hàng:</span>
                        <span className="text-blue-600 font-mono">{dataPayment._id}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Section - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <User size={24} />
                                Thông Tin Người Nhận
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="text-gray-500 mt-1" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-600">Họ và tên</p>
                                        <p className="font-semibold text-gray-800">{dataPayment.fullName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="text-gray-500 mt-1" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-600">Số điện thoại</p>
                                        <p className="font-semibold text-gray-800">{dataPayment.phoneNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="text-gray-500 mt-1" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold text-gray-800">{dataPayment.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-gray-500 mt-1" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                                        <p className="font-semibold text-gray-800">{dataPayment.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products List */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Package size={24} />
                                Sản Phẩm Đã Đặt
                            </h2>
                            <div className="space-y-4">
                                {products.map((item) => {
                                    const product = item.productId;
                                    const price = product.priceProduct;
                                    const discount = product.discountProduct || 0;
                                    const priceAfterDiscount = price - (price * discount) / 100;
                                    const subtotal = priceAfterDiscount * item.quantity;

                                    return (
                                        <div
                                            key={item._id}
                                            className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                                        >
                                            <img
                                                src={product.imagesProduct?.[0]}
                                                alt={product.nameProduct}
                                                className="w-24 h-32 object-cover rounded-lg"
                                            />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-gray-800 mb-2">
                                                    {product.nameProduct}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {product.descriptionProduct}
                                                </p>
                                                <div className="flex items-center gap-3 mb-2">
                                                    {discount > 0 && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            {formatPrice(price)}
                                                        </span>
                                                    )}
                                                    <span className="text-base font-bold text-red-600">
                                                        {formatPrice(priceAfterDiscount)}
                                                    </span>
                                                    {discount > 0 && (
                                                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-semibold">
                                                            -{discount}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                                    <p className="text-base font-bold text-gray-800">
                                                        {formatPrice(subtotal)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4 space-y-6">
                            {/* Order Info */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Thông Tin Đơn Hàng</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-gray-500" size={18} />
                                        <div className="flex-grow">
                                            <p className="text-xs text-gray-600">Ngày đặt</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {formatDate(dataPayment.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="text-gray-500" size={18} />
                                        <div className="flex-grow">
                                            <p className="text-xs text-gray-600">Phương thức thanh toán</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {getPaymentMethodName(dataPayment.paymentMethod)}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Trạng thái</p>
                                        {getStatusBadge(dataPayment.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="border-t pt-4">
                                <h3 className="font-bold text-gray-800 mb-3">Chi Tiết Thanh Toán</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tạm tính</span>
                                        <span className="font-semibold">{formatPrice(dataPayment.totalPrice)}</span>
                                    </div>

                                    {dataPayment.couponId && (
                                        <div className="flex justify-between text-green-600">
                                            <span>
                                                Giảm giá ({dataPayment.couponId.nameCoupon} -{' '}
                                                {dataPayment.couponId.discount}%)
                                            </span>
                                            <span className="font-semibold">
                                                -{formatPrice(dataPayment.totalPrice - dataPayment.finalPrice)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-gray-700">
                                        <span>Phí vận chuyển</span>
                                        <span className="font-semibold">Miễn phí</span>
                                    </div>

                                    <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                                        <span>Tổng cộng</span>
                                        <span className="text-red-600">{formatPrice(dataPayment.finalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link to="/" className="block">
                                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                                        Tiếp Tục Mua Sắm
                                    </button>
                                </Link>
                                <Link to="/orders" className="block">
                                    <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                                        Xem Đơn Hàng Của Tôi
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;

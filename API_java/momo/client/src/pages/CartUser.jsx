import { useState } from 'react';
import Header from '../components/Header';
import { useStore } from '../hooks/useStore';
import { Trash2, Plus, Minus, Tag } from 'lucide-react';
import { requestApplyCounpon, requestDeleteProductCart, requestUpdateQuantity } from '../config/CartRequest';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

function CartUser() {
    const { cart, getCart } = useStore();
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

    if (!cart || !cart.cart) {
        return (
            <div>
                <header>
                    <Header />
                </header>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-600">Giỏ hàng của bạn đang trống</h2>
                    </div>
                </div>
            </div>
        );
    }

    const cartData = cart.cart;
    const products = cartData.products || [];
    const coupons = cart.coupons || [];

    // Calculate prices
    const calculateProductPrice = (product) => {
        const price = product.productId.priceProduct || 0;
        const discount = product.productId.discountProduct || 0;
        return price - (price * discount) / 100;
    };

    const calculateSubtotal = (product) => {
        return calculateProductPrice(product) * product.quantity;
    };

    const totalPrice = products.reduce((sum, product) => sum + calculateSubtotal(product), 0);

    const calculateDiscount = () => {
        if (!selectedCoupon) return 0;
        if (totalPrice < selectedCoupon.minPrice) return 0;
        return totalPrice * (selectedCoupon.discount / 100);
    };

    const discount = calculateDiscount();
    const finalPrice = totalPrice - discount;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleQuantityChange = async (productId, change) => {
        try {
            const data = {
                productId,
                newQuantity: change,
            };
            const res = await requestUpdateQuantity(data);
            await getCart();
            message.success(res.message);
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const handleRemoveProduct = async (productId) => {
        try {
            const res = await requestDeleteProductCart(productId);
            await getCart();
            setDeleteModal({ show: false });
            message.success(res.message);
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const openDeleteModal = (product) => {
        setDeleteModal({ show: true, product });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ show: false, product: null });
    };

    const navigate = useNavigate();

    const handleCheckout = async () => {
        await getCart();
        navigate('/checkout');
    };

    const applyCoupon = async (coupon) => {
        if (totalPrice >= coupon.minPrice) {
            setSelectedCoupon(coupon);
            const counponId = coupon._id;
            const res = await requestApplyCounpon({ couponId: counponId });
            message.success(res.message);
        } else {
            message.error(`Đơn hàng tối thiểu ${formatPrice(coupon.minPrice)} để áp dụng mã này`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header>
                <Header />
            </header>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ Hàng Của Bạn</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {products.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-600">Không có sản phẩm nào trong giỏ hàng</p>
                            </div>
                        ) : (
                            products.map((item) => {
                                const product = item.productId;
                                const priceAfterDiscount = calculateProductPrice(item);
                                const subtotal = calculateSubtotal(item);
                                return (
                                    <div key={item._id} className="bg-white rounded-lg shadow p-4 flex gap-4">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={product.imagesProduct?.[0] || '/placeholder.jpg'}
                                                alt={product.nameProduct}
                                                className="w-20 h-28 object-cover rounded-md"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow">
                                            <h3 className="text-base font-semibold text-gray-800 mb-1">
                                                {product.nameProduct}
                                            </h3>
                                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                {product.descriptionProduct}
                                            </p>

                                            {product.metadata && (
                                                <div className="text-xs text-gray-500 mb-2">
                                                    <p>
                                                        {product.metadata.author} • {product.metadata.publisher}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mb-3">
                                                {product.discountProduct > 0 && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {formatPrice(product.priceProduct)}
                                                    </span>
                                                )}
                                                <span className="text-base font-bold text-red-600">
                                                    {formatPrice(priceAfterDiscount)}
                                                </span>
                                                {product.discountProduct > 0 && (
                                                    <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-xs font-semibold">
                                                        -{product.discountProduct}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(item.productId._id, item.quantity - 1)
                                                        }
                                                        className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 transition"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-semibold w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(item.productId._id, item.quantity + 1)
                                                        }
                                                        className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 transition"
                                                        disabled={item.quantity >= product.stockProduct}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-gray-600">Tổng</p>
                                                    <p className="text-base font-bold text-gray-800">
                                                        {formatPrice(subtotal)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() =>
                                                openDeleteModal({ _id: item.productId._id, name: product.nameProduct })
                                            }
                                            className="flex-shrink-0 text-red-500 hover:text-red-700 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tóm Tắt Đơn Hàng</h2>

                            {/* Coupon Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Tag size={20} />
                                    Mã Giảm Giá
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {coupons.map((coupon) => {
                                        const isValid = totalPrice >= coupon.minPrice;
                                        const isSelected = selectedCoupon?._id === coupon._id;

                                        return (
                                            <button
                                                key={coupon._id}
                                                onClick={() => applyCoupon(coupon)}
                                                disabled={!isValid}
                                                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                                                    isSelected
                                                        ? 'border-green-500 bg-green-50'
                                                        : isValid
                                                        ? 'border-gray-200 hover:border-blue-300'
                                                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-blue-600">{coupon.nameCoupon}</span>
                                                    <span className="text-red-600 font-bold">-{coupon.discount}%</span>
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    Đơn tối thiểu: {formatPrice(coupon.minPrice)}
                                                </p>
                                                {isSelected && (
                                                    <p className="text-xs text-green-600 mt-1 font-semibold">
                                                        ✓ Đã áp dụng
                                                    </p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tạm tính</span>
                                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                                </div>

                                {selectedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá ({selectedCoupon.nameCoupon})</span>
                                        <span className="font-semibold">-{formatPrice(discount)}</span>
                                    </div>
                                )}

                                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                                    <span>Tổng cộng</span>
                                    <span className="text-red-600">{formatPrice(finalPrice)}</span>
                                </div>
                            </div>

                            <Link to="/checkout">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition mt-6"
                                >
                                    Tiến Hành Thanh Toán
                                </button>
                            </Link>
                            <Link to="/">
                                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold mt-3 hover:bg-gray-50 transition">
                                    Tiếp Tục Mua Sắm
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Xác Nhận Xóa</h3>
                        </div>

                        <p className="text-gray-700 mb-2">Bạn có chắc chắn muốn xóa sản phẩm</p>
                        <p className="text-gray-900 font-semibold mb-6">"{deleteModal.product?.name}" khỏi giỏ hàng?</p>

                        <div className="flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleRemoveProduct(deleteModal.product?._id)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartUser;

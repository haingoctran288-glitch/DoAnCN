import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { productDetail } from '../config/ProductRequest';
import { Button, InputNumber, Tag, Breadcrumb, Image, Spin, Descriptions, Divider, message } from 'antd';
import {
    ShoppingCartOutlined,
    HomeOutlined,
    HeartOutlined,
    ShareAltOutlined,
    MinusOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useStore } from '../hooks/useStore';
import { requestAddToCart } from '../config/CartRequest';

function DetailProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { dataUser, getCart } = useStore();

    const fetchProductDetail = async () => {
        // setLoading(true);
        try {
            const res = await productDetail(id);
            setProduct(res.metadata.product);
        } catch (error) {
            console.error('Error fetching product:', error);
            message.error('Không thể tải thông tin sản phẩm');
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    if (loading) {
        return (
            <div>
                <Header />
                <div className="flex justify-center items-center h-screen">
                    <Spin size="large" tip="Đang tải..." />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-600">Không tìm thấy sản phẩm</h2>
                    <Button type="primary" onClick={() => navigate('/')} className="mt-4">
                        Về trang chủ
                    </Button>
                </div>
            </div>
        );
    }

    // Calculate discounted price
    const discountedPrice = product.priceProduct - (product.priceProduct * product.discountProduct) / 100;

    // Format price to VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleAddToCart = async () => {
        try {
            const data = {
                productId: id,
                quantity,
            };
            const res = await requestAddToCart(data);
            await fetchProductDetail();
            await getCart();
            message.success(res.message);
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const handleBuyNow = () => {
        message.info('Chức năng đang phát triển');
    };

    const onLogin = () => {
        navigate('/login');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white border-b pt-20">
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link to="/">
                                        <HomeOutlined /> Trang chủ
                                    </Link>
                                ),
                            },
                            {
                                title: 'Sản phẩm',
                            },
                            {
                                title: product.nameProduct,
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Product Detail */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Gallery */}
                        <div>
                            {/* Main Image */}
                            <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4">
                                <Image
                                    src={product?.imagesProduct[selectedImage]}
                                    alt={product.nameProduct}
                                    className="w-full h-auto object-cover"
                                    style={{ maxHeight: '500px' }}
                                />
                                {product.discountProduct > 0 && (
                                    <div className="absolute top-4 right-4">
                                        <Tag color="red" className="text-lg font-bold px-4 py-2">
                                            -{product.discountProduct}%
                                        </Tag>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {product.imagesProduct.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.imagesProduct.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-blue-500 shadow-lg'
                                                    : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.nameProduct} ${index + 1}`}
                                                className="w-full h-20 object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            {/* Product Name */}
                            <h1 className="text-3xl font-bold text-gray-900">{product.nameProduct}</h1>

                            {/* Author */}
                            {product.metadata?.author && (
                                <p className="text-gray-600">
                                    <span className="font-semibold">Tác giả:</span> {product.metadata.author}
                                </p>
                            )}

                            {/* Stock Status */}
                            <div className="flex items-center gap-3">
                                {product.stockProduct > 0 ? (
                                    <Tag color="green" className="text-sm px-3 py-1">
                                        Còn hàng ({product.stockProduct} sản phẩm)
                                    </Tag>
                                ) : (
                                    <Tag color="red" className="text-sm px-3 py-1">
                                        Hết hàng
                                    </Tag>
                                )}
                            </div>

                            {/* Price */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                {product.discountProduct > 0 ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-bold text-red-600">
                                                {formatPrice(discountedPrice)}
                                            </span>
                                            <span className="text-lg text-gray-400 line-through">
                                                {formatPrice(product.priceProduct)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Tiết kiệm: {formatPrice(product.priceProduct - discountedPrice)}
                                        </p>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(product.priceProduct)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Mô tả:</h3>
                                <p className="text-gray-700 leading-relaxed">{product.descriptionProduct}</p>
                            </div>

                            <Divider />

                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng:</label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        icon={<MinusOutlined />}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    />
                                    <InputNumber
                                        min={1}
                                        max={product.stockProduct}
                                        value={quantity}
                                        onChange={(value) => setQuantity(value || 1)}
                                        className="w-20 text-center"
                                    />
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={() => setQuantity(Math.min(product.stockProduct, quantity + 1))}
                                        disabled={quantity >= product.stockProduct}
                                    />
                                    <span className="text-gray-600 ml-2">{product.stockProduct} sản phẩm có sẵn</span>
                                </div>
                            </div>
                            {!dataUser && !dataUser._id ? (
                                <Button onClick={onLogin} type="primary" className="w-full">
                                    Vui lòng đăng nhập để mua hàng{' '}
                                </Button>
                            ) : (
                                <div className="flex gap-3">
                                    <Button
                                        type="primary"
                                        danger
                                        size="large"
                                        icon={<ShoppingCartOutlined />}
                                        className="flex-1"
                                        onClick={handleBuyNow}
                                        disabled={product.stockProduct === 0}
                                    >
                                        Mua ngay
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ShoppingCartOutlined />}
                                        className="flex-1"
                                        onClick={handleAddToCart}
                                        disabled={product.stockProduct === 0}
                                    >
                                        Thêm vào giỏ
                                    </Button>
                                </div>
                            )}

                            {/* Secondary Actions */}
                            <div className="flex gap-3">
                                <Button icon={<HeartOutlined />} className="flex-1">
                                    Yêu thích
                                </Button>
                                <Button icon={<ShareAltOutlined />} className="flex-1">
                                    Chia sẻ
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <Divider />
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin chi tiết</h2>
                        <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
                            {product.metadata?.author && (
                                <Descriptions.Item label="Tác giả">{product.metadata.author}</Descriptions.Item>
                            )}
                            {product.metadata?.publisher && (
                                <Descriptions.Item label="Nhà xuất bản">{product.metadata.publisher}</Descriptions.Item>
                            )}
                            {product.metadata?.publishingHouse && (
                                <Descriptions.Item label="Nhà phát hành">
                                    {product.metadata.publishingHouse}
                                </Descriptions.Item>
                            )}
                            {product.metadata?.translator && (
                                <Descriptions.Item label="Dịch giả">{product.metadata.translator}</Descriptions.Item>
                            )}
                            {product.metadata?.size && (
                                <Descriptions.Item label="Kích thước">{product.metadata.size}</Descriptions.Item>
                            )}
                            {product.metadata?.coverType && (
                                <Descriptions.Item label="Loại bìa">{product.metadata.coverType}</Descriptions.Item>
                            )}
                            <Descriptions.Item label="Số lượng kho">{product.stockProduct}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailProduct;

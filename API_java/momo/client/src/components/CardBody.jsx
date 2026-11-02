import { Card, Tag, Button, Image, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { requestAddToCart } from '../config/CartRequest';

function CardBody({ dataItem }) {
    const [imageError, setImageError] = useState(false);

    const { getCart } = useStore();

    // Calculate discounted price
    const discountedPrice = dataItem.priceProduct - (dataItem.priceProduct * dataItem.discountProduct) / 100;

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
                productId: dataItem._id,
                quantity: 1,
            };
            const res = await requestAddToCart(data);
            await getCart();
            message.success(res.message);
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    return (
        <Card
            hoverable
            className="h-full overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            cover={
                <div className="relative overflow-hidden h-72 bg-gray-100">
                    <Image
                        alt={dataItem.nameProduct}
                        src={
                            imageError
                                ? 'https://via.placeholder.com/300x400?text=No+Image'
                                : dataItem.imagesProduct?.[0]
                        }
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                        preview={{
                            mask: <EyeOutlined className="text-2xl" />,
                        }}
                    />

                    {/* Discount Badge */}
                    {dataItem.discountProduct > 0 && (
                        <div className="absolute top-3 right-3">
                            <Tag color="red" className="text-base font-bold px-3 py-1 rounded-full">
                                -{dataItem.discountProduct}%
                            </Tag>
                        </div>
                    )}

                    {/* Stock Badge */}
                    {dataItem.stockProduct && (
                        <div className="absolute top-3 left-3">
                            <Tag color="orange" className="text-xs font-semibold">
                                Chỉ còn {dataItem.stockProduct} sản phẩm
                            </Tag>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<HeartOutlined />}
                            className="shadow-lg"
                        />
                    </div>
                </div>
            }
        >
            {/* Product Info */}
            <div className="space-y-3">
                {/* Author & Publisher */}
                {dataItem.metadata?.author && (
                    <p className="text-xs text-gray-500 truncate">
                        <span className="font-semibold">Tác giả:</span> {dataItem.metadata.author}
                    </p>
                )}

                {/* Product Name */}
                <Link to={`product/${dataItem._id}`}>
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors">
                        {dataItem.nameProduct}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2">{dataItem.descriptionProduct}</p>

                {/* Price Section */}
                <div className="space-y-1">
                    {dataItem.discountProduct > 0 ? (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-red-600">{formatPrice(discountedPrice)}</span>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(dataItem.priceProduct)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <span className="text-xl font-bold text-gray-800">{formatPrice(dataItem.priceProduct)}</span>
                    )}
                </div>

                {/* Additional Info Tags */}
                <div className="flex flex-wrap gap-1">
                    {dataItem.metadata?.publisher && <Tag className="text-xs">{dataItem.metadata.publisher}</Tag>}
                    {dataItem.metadata?.size && <Tag className="text-xs">{dataItem.metadata.size}</Tag>}
                </div>

                {/* Action Button */}
                <Button
                    type="primary"
                    size="large"
                    onClick={handleAddToCart}
                    icon={<ShoppingCartOutlined />}
                    className="w-full rounded-lg font-semibold"
                    disabled={dataItem.stockProduct === 0}
                >
                    {dataItem.stockProduct === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                </Button>
            </div>
        </Card>
    );
}

export default CardBody;

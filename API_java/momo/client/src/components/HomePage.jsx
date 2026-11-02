import { useEffect, useState } from 'react';
import { listCategory } from '../config/CategoryRequest';
import { listProduct, listProductByCategory } from '../config/ProductRequest';
import CardBody from './CardBody';
import { Menu, Spin } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

function HomePage() {
    const [dataCategory, setDataCategory] = useState([]);
    const [dataProduct, setDataProduct] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    const fetchCategory = async () => {
        const res = await listCategory();
        setDataCategory(res.metadata);
    };

    const fetchProduct = async () => {
        const res = await listProduct();
        setDataProduct(res.metadata);
    };

    // Initial load - fetch categories and all products
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchCategory();
            await fetchProduct();
            setLoading(false);
        };
        fetchData();
    }, []);

    // Fetch products when category changes
    useEffect(() => {
        if (!selectedCategory) return;

        const fetchProductByCategory = async () => {
            setLoading(true);
            try {
                if (selectedCategory === 'all') {
                    // Fetch all products
                    const res = await listProduct();
                    setDataProduct(res.metadata);
                } else {
                    // Fetch products by category ID
                    const res = await listProductByCategory(selectedCategory);
                    setDataProduct(res.metadata);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setDataProduct([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProductByCategory();
    }, [selectedCategory]);

    // Prepare menu items for categories
    const menuItems = [
        {
            key: 'all',
            icon: <AppstoreOutlined />,
            label: 'Tất cả sản phẩm',
        },
        ...dataCategory.map((category) => ({
            key: category._id,
            label: category.nameCategory,
            icon: category.imageCategory ? (
                <img src={category.imageCategory} alt="" className="w-5 h-5 object-cover rounded" />
            ) : (
                <AppstoreOutlined />
            ),
        })),
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Sidebar - Category Menu */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-md sticky top-24 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4">
                                <h2 className="text-lg font-bold">Danh mục sản phẩm</h2>
                            </div>
                            <Menu
                                mode="inline"
                                selectedKeys={[selectedCategory || 'all']}
                                items={menuItems}
                                onClick={({ key }) => {
                                    setSelectedCategory(key === 'all' ? 'all' : key);
                                }}
                                className="border-0"
                            />
                        </div>
                    </aside>

                    {/* Main Content - Product Grid */}
                    <main className="flex-1">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                {selectedCategory === 'all'
                                    ? 'Tất cả sản phẩm'
                                    : dataCategory.find((cat) => cat._id === selectedCategory)?.nameCategory ||
                                      'Sản phẩm'}
                            </h1>
                            <p className="text-gray-600">Hiển thị {dataProduct.length} sản phẩm</p>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="flex justify-center items-center h-96">
                                <Spin size="large" tip="Đang tải sản phẩm..." />
                            </div>
                        ) : (
                            <>
                                {/* Product Grid - 5 columns */}
                                {dataProduct.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {dataProduct.map((item) => (
                                            <CardBody key={item._id} dataItem={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                            Không tìm thấy sản phẩm
                                        </h3>
                                        <p className="text-gray-500">Danh mục này chưa có sản phẩm nào</p>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

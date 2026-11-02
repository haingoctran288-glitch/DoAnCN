import logo from '../assets/images/logo.webp';
import { Button, Input, Avatar, Dropdown, message, Badge } from 'antd';
import { SearchOutlined, UserOutlined, DownOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import { useStore } from '../hooks/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { requestLogout } from '../config/UserRequest';

function Header() {
    const { dataUser, cart } = useStore();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await requestLogout();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const userMenuItems = [
        { key: 'profile', label: 'Thông tin cá nhân', href: '/info-user', onClick: () => navigate('/profile') },
        { key: 'bookings', label: 'Đơn hàng của tôi', href: '/bookings', onClick: () => navigate('/order') },
        { key: 'warranty', label: 'Quản lý bảo hành', href: '/warranty', onClick: () => navigate('/warranty') },
        { key: 'logout', label: 'Đăng xuất', onClick: handleLogout },
    ];

    return (
        <div className="bg-white shadow-md fixed top-0 z-50 w-full">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-row items-center justify-between gap-8">
                    {/* Logo */}
                    <Link to={'/'}>
                        <div className="flex items-center gap-2">
                            <img
                                src={logo}
                                alt="logo"
                                className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity rounded-lg"
                            />
                            <h1 className="text-2xl font-bold">L2 Team</h1>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl">
                        <Input
                            size="large"
                            placeholder="Tìm kiếm sản phẩm, danh mục..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="rounded-lg"
                            style={{ borderRadius: '8px' }}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Link to={'/cart'}>
                            <Badge count={cart?.cart?.products?.length} size="small">
                                <Button
                                    type="text"
                                    icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                                    size="large"
                                    className="hover:bg-gray-100"
                                >
                                    Giỏ hàng
                                </Button>
                            </Badge>
                        </Link>

                        {dataUser && dataUser._id ? (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                trigger={['click']}
                                dropdownRender={(menu) => (
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 mt-1 min-w-[200px] overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-medium text-gray-800">
                                                {dataUser.fullName || 'Người dùng'}
                                            </p>

                                            <p className="text-xs text-gray-500 truncate">{dataUser.email}</p>
                                        </div>
                                        {menu}
                                    </div>
                                )}
                            >
                                <div className="flex items-center cursor-pointer gap-2">
                                    <Avatar
                                        icon={<UserOutlined />}
                                        className="bg-green-500 flex items-center justify-center"
                                        size="large"
                                        src={`${import.meta.env.VITE_API_URL}/uploads/avatars/${dataUser.avatar}`}
                                    />
                                    <div className="hidden md:block">
                                        <span className="text-sm font-medium">{dataUser.fullName || 'Người dùng'}</span>
                                        <DownOutlined className="text-xs ml-1" />
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            <Link to={'/login'}>
                                <Button type="primary" icon={<UserOutlined />} size="large" className="rounded-lg">
                                    Đăng nhập
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;

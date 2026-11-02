import Header from '../components/Header';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { requestLogin } from '../config/UserRequest';

function LoginUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await requestLogin(values);

            message.success('Đăng nhập thành công!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            message.error(error.response.data.message);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error('Vui lòng kiểm tra lại thông tin!');
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header />

            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-5rem)]">
                    <div className="w-full max-w-md">
                        {/* Login Card */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
                                <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
                            </div>

                            {/* Login Form */}
                            <Form
                                name="login"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                layout="vertical"
                                size="large"
                            >
                                {/* Email Field */}
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập email!',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email không hợp lệ!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        placeholder="example@email.com"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                {/* Password Field */}
                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mật khẩu!',
                                        },
                                        {
                                            min: 6,
                                            message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="••••••••"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                {/* Remember & Forgot */}
                                <Form.Item>
                                    <div className="flex items-center justify-between">
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                                        </Form.Item>
                                        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                </Form.Item>

                                {/* Submit Button */}
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full h-12 text-base font-semibold rounded-lg"
                                        loading={loading}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>

                            {/* Divider */}
                            <Divider className="my-6">
                                <span className="text-gray-500 text-sm">Hoặc đăng nhập với</span>
                            </Divider>

                            {/* Social Login */}

                            {/* Register Link */}
                            <div className="text-center">
                                <span className="text-gray-600">Chưa có tài khoản? </span>
                                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <p className="text-center text-gray-500 text-sm mt-6">
                            Bằng việc đăng nhập, bạn đồng ý với{' '}
                            <Link to="/terms" className="text-blue-600 hover:underline">
                                Điều khoản dịch vụ
                            </Link>{' '}
                            và{' '}
                            <Link to="/privacy" className="text-blue-600 hover:underline">
                                Chính sách bảo mật
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LoginUser;

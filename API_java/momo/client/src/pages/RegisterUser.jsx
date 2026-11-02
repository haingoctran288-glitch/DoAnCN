import Header from '../components/Header';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { requestRegister } from '../config/UserRequest';

function RegisterUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = values;
            await requestRegister(values);
            message.success('Đăng ký thành công');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            navigate('/');
        } catch (error) {
            message.error(error.response?.data?.message || 'Đăng ký thất bại!');
            console.error('Register error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error('Vui lòng kiểm tra lại thông tin!');
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <Header />

            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-5rem)]">
                    <div className="w-full max-w-md">
                        {/* Register Card */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký tài khoản</h1>
                                <p className="text-gray-600">Tạo tài khoản mới để bắt đầu mua sắm!</p>
                            </div>

                            {/* Register Form */}
                            <Form
                                form={form}
                                name="register"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                layout="vertical"
                                size="large"
                                scrollToFirstError
                            >
                                {/* Name Field */}
                                <Form.Item
                                    label="Họ và tên"
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập họ tên!',
                                        },
                                        {
                                            min: 2,
                                            message: 'Họ tên phải có ít nhất 2 ký tự!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="text-gray-400" />}
                                        placeholder="Nguyễn Văn A"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

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

                                {/* Phone Field (Optional) */}
                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        {
                                            pattern: /^[0-9]{10,11}$/,
                                            message: 'Số điện thoại không hợp lệ!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined className="text-gray-400" />}
                                        placeholder="0912345678"
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
                                    hasFeedback
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="••••••••"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                {/* Confirm Password Field */}
                                <Form.Item
                                    label="Xác nhận mật khẩu"
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng xác nhận mật khẩu!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="••••••••"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                {/* Submit Button */}
                                <Form.Item className="mb-4">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full h-12 text-base font-semibold rounded-lg"
                                        loading={loading}
                                    >
                                        Đăng ký
                                    </Button>
                                </Form.Item>
                            </Form>

                            {/* Login Link */}
                            <div className="text-center">
                                <span className="text-gray-600">Đã có tài khoản? </span>
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <p className="text-center text-gray-500 text-sm mt-6">
                            Bằng việc đăng ký, bạn đồng ý với{' '}
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

export default RegisterUser;

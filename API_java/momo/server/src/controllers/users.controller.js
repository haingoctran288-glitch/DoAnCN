const { ConflictRequestError, NotFoundError, AuthFailureError, BadRequestError } = require('../core/error.response');
const { Created, OK } = require('../core/success.response');

const userModel = require('../models/user.model');
const otpModel = require('../models/otp.model');
const jwt = require('jsonwebtoken');

const { createAccessToken, createRefreshToken, verifyToken } = require('../auth/checkAuth');
const SendMailForgotPassword = require('../utils/mailForgotPassword');

const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');

function setCookie(res, accessToken, refreshToken) {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'strict',
    });
    res.cookie('logged', 1, {
        httpOnly: false,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'strict',
    });
}

class UsersController {
    async register(req, res) {
        const { fullName, email, password } = req.body;
        const findUser = await userModel.findOne({ email });
        if (findUser) {
            throw new ConflictRequestError('Email đã tồn tại');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await userModel.create({
            fullName,
            email,
            password: hashedPassword,
        });

        const accessToken = createAccessToken({ id: newUser._id });
        const refreshToken = createRefreshToken({ id: newUser._id });

        setCookie(res, accessToken, refreshToken);

        return new Created({
            message: 'Đăng ký thành công',
            metadata: newUser,
        }).send(res);
    }
    async login(req, res) {
        const { email, password } = req.body;
        const findUser = await userModel.findOne({ email });

        if (!findUser) {
            throw new NotFoundError('Tài khoản hoặc mật khẩu không chính xác !');
        }

        const isMathPassword = await bcrypt.compare(password, findUser.password);

        if (!isMathPassword) {
            throw new AuthFailureError('Tài khoản hoặc mật khẩu không chính xác !');
        }

        const accessToken = createAccessToken({ id: findUser._id });
        const refreshToken = createRefreshToken({ id: findUser._id });

        setCookie(res, accessToken, refreshToken);

        return new OK({
            message: 'Đăng nhập thành công',
            metadata: { accessToken, refreshToken },
        }).send(res);
    }

    async authUser(req, res) {
        const userId = req.user;
        if (!userId) {
            throw new AuthFailureError('Vui lòng đăng nhập lại');
        }
        const findUser = await userModel.findById(userId);
        if (!findUser) {
            throw new NotFoundError('Người dùng không tồn tại');
        }

        return new OK({
            message: 'Xác thực thành công',
            metadata: findUser,
        }).send(res);
    }

    async logout(req, res) {
        const userId = req.user;
        const findUser = await userModel.findById(userId);
        if (!findUser) {
            throw new NotFoundError('Người dùng không tồn tại');
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('logged');
        return new OK({
            message: 'Đăng xuất thành công',
            metadata: findUser,
        }).send(res);
    }

    async forgotPassword(req, res) {
        const { email } = req.body;
        const findUser = await userModel.findOne({ email });
        if (!findUser) {
            throw new NotFoundError('Email không tồn tại');
        }

        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const tokenForgotPassword = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '5m',
        });

        res.cookie('tokenForgotPassword', tokenForgotPassword, {
            httpOnly: false,
            secure: true,
            maxAge: 5 * 60 * 1000, // 5 minutes
            sameSite: 'strict',
        });

        await otpModel.create({
            otp,
            email,
        });

        await SendMailForgotPassword(email, otp);

        return new OK({
            message: 'Mã OTP đã được gửi đến email của bạn',
            metadata: true,
        }).send(res);
    }

    async verifyForgotPassword(req, res) {
        const { otp, password } = req.body;
        const tokenForgotPassword = req.cookies.tokenForgotPassword;
        if (!tokenForgotPassword || !otp) {
            throw new BadRequestError('Bạn đang thiếu thông tin');
        }
        const decoded = jwt.verify(tokenForgotPassword, process.env.JWT_SECRET);
        if (!decoded) {
            throw new BadRequestError('Vui lòng gửi lại yêu cầu ');
        }

        const email = decoded.email;

        const findOtp = await otpModel.findOne({ email, otp });
        if (!findOtp) {
            throw new BadRequestError('Mã OTP không hợp lệ');
        }

        const findUser = await userModel.findOne({ email });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        findUser.password = hashedPassword;

        await findUser.save();

        await otpModel.deleteMany({ email });
        res.clearCookie('tokenForgotPassword');

        return new OK({
            message: 'Khôi phục mật khẩu thành công',
            metadata: true,
        }).send(res);
    }

    async refreshToken(req, res) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AuthFailureError('Vui lòng đăng nhập lại');
        }
        const decoded = await verifyToken(refreshToken);
        if (!decoded) {
            throw new AuthFailureError('Vui lòng đăng nhập lại');
        }
        const accessToken = createAccessToken({ id: decoded.id });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'strict',
        });

        return new OK({
            message: 'Refresh token thành công',
            metadata: true,
        }).send(res);
    }
}

module.exports = new UsersController();

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentModel = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
                quantity: { type: Number, default: 1 },
            },
        ],
        totalPrice: { type: Number, default: 0 }, // 100.000đ
        fullName: { type: String, require: true },
        phoneNumber: { type: String, require: true },
        address: { type: String, require: true },
        email: { type: String, require: true },
        finalPrice: { type: Number, default: 0 }, // 90.000đ
        couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'coupon' },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'delivered', 'completed', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: { type: String, enum: ['cod', 'momo', 'vnpay'], require: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('payment', paymentModel);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const couponModel = new Schema(
    {
        nameCoupon: { type: String, require: true },
        discount: { type: Number, require: true },
        quantity: { type: Number, require: true },
        startDate: { type: Date, require: true },
        endDate: { type: Date, require: true },
        minPrice: { type: Number, require: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('coupon', couponModel);

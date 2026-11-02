const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpModel = new Schema(
    {
        otp: { type: String, require: true },
        email: { type: String, require: true },
        expiredAt: { type: Date, default: new Date(Date.now() + 5 * 60 * 1000) }, // 5 minutes
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('otp', otpModel);

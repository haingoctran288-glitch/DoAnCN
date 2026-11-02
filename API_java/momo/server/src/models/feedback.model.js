const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackModel = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'payment' },
        imagesFeedback: { type: Array, default: [] },
        content: { type: String, require: true },
        rating: { type: Number, require: true, default: 5 },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('feedback', feedbackModel);

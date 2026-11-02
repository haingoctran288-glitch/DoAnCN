const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productModel = new Schema(
    {
        imagesProduct: { type: Array, require: true },
        nameProduct: { type: String, require: true },
        priceProduct: { type: Number, require: true },
        discountProduct: { type: Number, default: 0 },
        stockProduct: { type: Number, default: 0 },
        descriptionProduct: { type: String, require: true },
        categoryProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
        metadata: { type: mongoose.Schema.Types.Mixed },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('products', productModel);

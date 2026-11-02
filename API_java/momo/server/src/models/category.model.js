const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoryModel = new Schema(
    {
        nameCategory: { type: String, require: true },
        imageCategory: { type: String, require: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('category', categoryModel);

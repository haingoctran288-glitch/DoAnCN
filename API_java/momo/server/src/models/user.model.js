const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userModel = new Schema(
    {
        fullName: { type: String, require: true },
        email: { type: String, require: true },
        password: { type: String, require: true },
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('User', userModel);

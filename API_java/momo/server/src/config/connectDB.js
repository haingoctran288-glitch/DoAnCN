const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Kết nối thành công đến MongoDB');
    } catch (error) {
        console.log('Kết nối thất bại đến MongoDB', error);
    }
};

module.exports = connectDB;

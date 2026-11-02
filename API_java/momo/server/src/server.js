const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/connectDB');
const routes = require('./routes/index.routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(cookieParser());

connectDB();

app.get('/', (req, res) => {
    return res.json({
        message: 'ok',
        metadata: { message: 'Ok' },
    });
});

routes(app);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log(err);
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Lỗi server',
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

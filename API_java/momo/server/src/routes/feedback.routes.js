const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/feedback');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const { asyncHandler } = require('../auth/checkAuth');
const { authAdmin, authUser } = require('../middleware/authUser');

const feedbackController = require('../controllers/feedback.controller');

router.post('/create', authUser, upload.array('imagesFeedback', 10), asyncHandler(feedbackController.createFeedback));

module.exports = router;

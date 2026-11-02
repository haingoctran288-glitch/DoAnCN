const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/categorys');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const { asyncHandler } = require('../auth/checkAuth');
const { authAdmin } = require('../middleware/authUser');

const categoryController = require('../controllers/category.controller');

router.post('/create', authAdmin, upload.single('imageCategory'), asyncHandler(categoryController.createCategory));
router.get('/list', asyncHandler(categoryController.getAllCategory));
router.put('/update/:id', authAdmin, upload.single('imageCategory'), asyncHandler(categoryController.updateCategory));
router.delete('/delete/:id', authAdmin, asyncHandler(categoryController.deleteCategory));

module.exports = router;

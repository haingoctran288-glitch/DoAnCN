const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/products');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const { asyncHandler } = require('../auth/checkAuth');
const { authAdmin } = require('../middleware/authUser');

const productController = require('../controllers/product.controller');

router.post('/create', authAdmin, upload.array('imagesProduct', 100), asyncHandler(productController.createProduct));
router.get('/list', asyncHandler(productController.getAllProduct));
router.put('/update/:id', authAdmin, upload.array('imagesProduct', 100), asyncHandler(productController.updateProduct));
router.get('/detail/:id', asyncHandler(productController.getProductById));
router.delete('/delete/:id', authAdmin, asyncHandler(productController.deleteProduct));

router.get('/list/:idCategory', asyncHandler(productController.getProductByCategory));

module.exports = router;

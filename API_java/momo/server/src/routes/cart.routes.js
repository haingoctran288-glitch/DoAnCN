const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../auth/checkAuth');
const { authUser } = require('../middleware/authUser');

const cartController = require('../controllers/cart.controller');

router.post('/create', authUser, asyncHandler(cartController.createCart));
router.put('/update', authUser, asyncHandler(cartController.updateCart));
router.delete('/delete/:productId', authUser, asyncHandler(cartController.deleteProductInCart));
router.get('/get', authUser, asyncHandler(cartController.getCartInUser));
router.put('/update-info', authUser, asyncHandler(cartController.updateInfoCart));
router.put('/apply-coupon', authUser, asyncHandler(cartController.applyCoupon));

module.exports = router;

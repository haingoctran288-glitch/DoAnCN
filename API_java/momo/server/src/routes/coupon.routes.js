const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../auth/checkAuth');
const { authAdmin } = require('../middleware/authUser');

const couponController = require('../controllers/coupon.controller');

router.post('/create', authAdmin, asyncHandler(couponController.createCoupon));
router.get('/list', authAdmin, asyncHandler(couponController.getAllCoupon));
router.put('/update/:id', authAdmin, asyncHandler(couponController.updateCoupon));
router.delete('/delete/:id', authAdmin, asyncHandler(couponController.deleteCoupon));

module.exports = router;

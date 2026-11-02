const feedbackModel = require('../models/feedback.model');
const paymentModel = require('../models/payment.model');

const { NotFoundError, BadRequestError } = require('../core/error.response');
const { Created, OK } = require('../core/success.response');

const cloudinary = require('../config/cloudDinary');

class FeedbackController {
    async createFeedback(req, res) {
        const id = req.user;
        const { paymentId, content, rating, productId } = req.body;
        const dataImages = req.files;
        const findPayment = await paymentModel.findById(paymentId);

        if (!findPayment) {
            throw new NotFoundError('Đơn hàng không tồn tại');
        }

        if (findPayment.status !== 'completed') {
            throw new BadRequestError('Đơn hàng chưa hoàn thành');
        }

        let imagesFeedback = [];

        for (const image of dataImages) {
            const { path, filename } = image;
            const { url } = await cloudinary.uploader.upload(path, {
                folder: 'feedbacks',
                resource_type: 'image',
            });
            imagesFeedback.push(url || filename);
        }

        const newFeedback = await feedbackModel.create({
            userId: id,
            productId,
            content,
            rating: Number(rating),
            imagesFeedback,
        });

        return new Created({
            message: 'Đánh giá sản phẩm thành công',
            metadata: newFeedback,
        }).send(res);
    }
}

module.exports = new FeedbackController();

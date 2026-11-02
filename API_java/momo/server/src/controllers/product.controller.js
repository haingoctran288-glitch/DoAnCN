const cloudinary = require('../config/cloudDinary');
const { Created, OK } = require('../core/success.response');
const { NotFoundError, BadRequestError } = require('../core/error.response');

const getPublicId = require('../utils/getPublicId');

const productModel = require('../models/product.model');
const feedbackModel = require('../models/feedback.model');

class ProductController {
    async createProduct(req, res) {
        const dataImages = req.files;
        const {
            nameProduct,
            priceProduct,
            discountProduct,
            stockProduct,
            descriptionProduct,
            categoryProduct,
            metadata,
        } = req.body;
        if (
            !nameProduct ||
            !priceProduct ||
            !discountProduct ||
            !stockProduct ||
            !descriptionProduct ||
            !categoryProduct ||
            !dataImages ||
            !metadata
        ) {
            throw new BadRequestError('Thiếu thông tin sản phẩm');
        }

        let imagesProduct = [];

        for (const image of dataImages) {
            const { path, filename } = image;
            const { url } = await cloudinary.uploader.upload(path, {
                folder: 'products',
                resource_type: 'image',
            });
            imagesProduct.push(url || filename);
        }

        const newProduct = await productModel.create({
            nameProduct,
            priceProduct,
            discountProduct,
            stockProduct,
            descriptionProduct,
            categoryProduct,
            metadata: JSON.parse(metadata),
            imagesProduct,
        });

        return new Created({
            message: 'Tạo sản phẩm thành công',
            metadata: newProduct,
        }).send(res);
    }

    async getAllProduct(req, res) {
        const products = await productModel.find();
        return new OK({
            message: 'Lấy danh sách sản phẩm thành công',
            metadata: products,
        }).send(res);
    }

    async updateProduct(req, res) {
        const { id } = req.params;
        const {
            nameProduct,
            priceProduct,
            discountProduct,
            stockProduct,
            descriptionProduct,
            categoryProduct,
            metadata,
            oldImagesProduct,
        } = req.body;

        const dataImages = req.files;

        if (
            !id ||
            !nameProduct ||
            !priceProduct ||
            !discountProduct ||
            !stockProduct ||
            !descriptionProduct ||
            !categoryProduct ||
            !metadata ||
            !oldImagesProduct
        ) {
            throw new BadRequestError('Thiếu thông tin sản phẩm');
        }

        const findProduct = await productModel.findById(id);
        if (!findProduct) {
            throw new NotFoundError('Sản phẩm không tồn tại');
        }

        let imagesProduct = [];

        if (dataImages && dataImages.length > 0) {
            for (const image of dataImages) {
                const { path, filename } = image;
                const { url } = await cloudinary.uploader.upload(path, {
                    folder: 'products',
                    resource_type: 'image',
                });
                imagesProduct.push(url || filename);
            }
        }

        const parserOldImages = oldImagesProduct ? JSON.parse(oldImagesProduct) : [];

        const finalImages = [...parserOldImages, ...imagesProduct];

        const parserMetadata = metadata ? JSON.parse(metadata) : undefined;

        const updateProduct = await productModel.findByIdAndUpdate(
            id,
            {
                nameProduct,
                priceProduct,
                discountProduct,
                stockProduct,
                descriptionProduct,
                categoryProduct,
                metadata: parserMetadata,
                imagesProduct: finalImages,
            },
            { new: true },
        );

        if (!updateProduct) {
            throw new NotFoundError('Cập nhật sản phẩm thất bại');
        }

        return new OK({
            message: 'Cập nhật thông tin sản phẩm thành công',
            metadata: updateProduct,
        }).send(res);
    }

    async getProductById(req, res) {
        const { id } = req.params;
        const product = await productModel.findById(id);
        const feedbacks = await feedbackModel.find({ productId: id });
        if (!product) {
            throw new NotFoundError('Sản phẩm không tồn tại');
        }

        return new OK({
            message: 'Lấy thông tin sản phẩm thành công',
            metadata: { product, feedbacks },
        }).send(res);
    }

    async deleteProduct(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Thiếu thông tin sản phẩm');
        }

        const findProduct = await productModel.findById(id);
        if (!findProduct) {
            throw new NotFoundError('Sản phẩm không tồn tại');
        }

        for (const image of findProduct.imagesProduct) {
            await cloudinary.uploader.destroy(getPublicId(image));
        }

        await findProduct.deleteOne();

        return new OK({
            message: 'Xóa sản phẩm thành công',
            metadata: findProduct,
        }).send(res);
    }

    async getProductByCategory(req, res) {
        const { idCategory } = req.params;

        let product = [];
        if (idCategory) {
            product = await productModel.find({ categoryProduct: idCategory });
        } else {
            product = await productModel.find();
        }

        return new OK({
            message: 'Lấy sản phẩm theo danh mục thành công',
            metadata: product,
        }).send(res);
    }
}

module.exports = new ProductController();

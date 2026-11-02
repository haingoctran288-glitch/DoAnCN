const cloudinary = require('../config/cloudDinary');
const categoryModel = require('../models/category.model');
const { Created, OK } = require('../core/success.response');
const { BadRequestError, NotFoundError } = require('../core/error.response');

const fs = require('fs/promises');

const getPublicId = require('../utils/getPublicId');

class CategoryController {
    async createCategory(req, res) {
        const { path, filename } = req.file;
        const { nameCategory } = req.body;
        if (!nameCategory || !path || !filename) {
            await fs.unlink(path);
            throw new BadRequestError('Thiếu thông tin danh mục');
        }
        const { url } = await cloudinary.uploader.upload(path, {
            folder: 'categorys',
            resource_type: 'image',
        });

        const newCategory = await categoryModel.create({
            nameCategory,
            imageCategory: url || filename,
        });

        await fs.unlink(path);

        return new Created({
            message: 'Tạo danh mục thành công',
            metadata: newCategory,
        }).send(res);
    }

    async getAllCategory(req, res) {
        const categories = await categoryModel.find();
        return new OK({
            message: 'Lấy danh mục thành công',
            metadata: categories,
        }).send(res);
    }

    async updateCategory(req, res) {
        const { id } = req.params;
        const { nameCategory } = req.body;
        if (!nameCategory || !id) {
            throw new BadRequestError('Thiếu thông tin danh mục');
        }

        const findCategory = await categoryModel.findById(id);
        if (!findCategory) {
            throw new NotFoundError('Danh mục không tồn tại');
        }

        let imageCategory = findCategory.imageCategory;

        if (req.file) {
            const { path, filename } = req.file;

            const { url } = await cloudinary.uploader.upload(path, {
                folder: 'categorys',
                resource_type: 'image',
            });

            imageCategory = url || filename;

            await fs.unlink(path);

            await cloudinary.uploader.destroy(getPublicId(imageCategory));
        }

        const updateCategory = await categoryModel.findByIdAndUpdate(
            id,
            { nameCategory, imageCategory },
            { new: true },
        );

        return new OK({
            message: 'Cập nhật danh mục thành công',
            metadata: updateCategory,
        }).send(res);
    }

    async deleteCategory(req, res) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError('Thiếu thông tin danh mục');
        }

        const findCategory = await categoryModel.findById(id);

        if (!findCategory) {
            throw new NotFoundError('Danh mục không tồn tại');
        }

        await cloudinary.uploader.destroy(getPublicId(findCategory.imageCategory));

        await findCategory.deleteOne();

        return new OK({
            message: 'Xóa danh mục thành công',
            metadata: findCategory,
        }).send(res);
    }
}

module.exports = new CategoryController();

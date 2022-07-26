const { catchAsync } = require('../utils/catchAsync.util')
const { Product } = require('../models/product.model')
const { Category } = require('../models/category.model')

const { User } = require('../models/user.model')
const { AppError } = require('../utils/app.Error.util')
const { ref, uploadBytes } = require('firebase/storage')
const { Storage } = require('../utils/firebase.util')
const { ProductImg } = require('../models/productImage.model')

const createProduct = catchAsync(async (req, res, next) => {
    const { sessionUser } = req
    const { title, description, price, quantity, categoryId } = req.body

    const newProduct = await Product.create({
        title,
        description,
        quantity,
        price,
        categoryId,
        userId: sessionUser.id,
    })

    const imgsPromises = req.files.productImg.map(async (img) => {
        const imgName = `/img/products/${newProduct.id}-${sessionUser.id}-${img.originalname}`
        const imgRef = ref(Storage, imgName)

        const result = await uploadBytes(imgRef, img.buffer)

        await ProductImg.create({
            imgUrl: result.metadata.fullPath,
            productId: newProduct.id,
        })
    })

    await Promise.all(imgsPromises)

    res.status(201).json({ status: 'success', data: { newProduct } })
})

const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
        required: false,
        where: { status: 'active' },
        include: [
            { model: Category, attributes: ['name'] },
            { model: User, attributes: ['userName', 'email'] },
        ],
    })
    res.status(200).json({ products })
})

const getProductById = catchAsync(async (req, res, next) => {
    const { product } = req
    res.status(200).json({ product })
})

const updateProduct = catchAsync(async (req, res, next) => {
    const { product } = req
    const { title, description, price, quantity } = req.body
    const updateProd = await product.update({
        title,
        description,
        quantity,
        price,
    })
    res.status(200).json({ status: 'success', updateProd })
})

const deleteProduct = catchAsync(async (req, res, next) => {
    const { product } = req
    await product.update({ status: 'deleted' })

    res.status(200).json({
        status: 'success',
    })
})

const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.findAll({
        required: false,
        where: { status: 'active' },
    })
    res.status(200).json({ categories })
})

const createNewCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body

    if (name.length === 0) {
        return next(new AppError('Name cannot be empty', 400))
    }

    const newCategory = await Category.create({
        name,
    })
    res.status(201).json({ status: 'success', newCategory })
})

const updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    const categorie = await Category.findOne({ where: { id } })

    if (!categorie) {
        return next(new AppError('Categorie not found', 400))
    }

    await categorie.update({
        name,
    })

    res.status(201).json({
        status: 'success',
        categorie,
    })
})

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllCategories,
    createNewCategory,
    updateCategory,
}

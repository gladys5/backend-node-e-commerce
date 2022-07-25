const { Product } = require('../models/product.model')
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/app.Error.util')

const productExists = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const product = await Product.findOne({
        required: false,
        where: { id, status: 'active' },
    })

    if (!product) {
        return next(new AppError('Product does not exist with given Id', 404))
    }

    req.product = product
    next()
})

const protectProductOwner = catchAsync(async (req, res, next) => {
    const { sessionUser } = req
    const { product } = req
    if (product.userId !== sessionUser.id) {
        return next(new AppError('You do not own this account', 403))
    }
    next()
})

module.exports = { productExists, protectProductOwner }

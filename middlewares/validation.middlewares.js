const { body, validationResult } = require('express-validator')

const createUserValidations = [
    body('userName').notEmpty().withMessage('Name cannot be empty'),
    body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Must be a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
]

const createCategoryValidations = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
]

const createProductValidations = [
    body('title').isString().notEmpty().withMessage('Enter a valid title'),
    body('description')
        .isString()
        .notEmpty()
        .withMessage('Enter a valid description'),
    body('price')
        .isDecimal()
        .custom((value) => value > 0)
        .withMessage('Enter a valid price'),
    body('quantity')
        .isNumeric()
        .custom((value) => +value > 0)
        .withMessage('Enter a valid quantity'),
    body('categoryId')
        .isInt({ min: 1 })
        .withMessage('Must provide a valid category'),
]

const checkValidations = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const messages = errors.array().map(({ msg }) => msg)

        const errorMsg = messages.join('. ')

        return res.status(400).json({
            status: 'error',
            message: errorMsg,
        })
    }

    next()
}
const checkParameters = async (req, res, next) => {
    const { productId, quantity } = req.body

    const product = await Product.findOne({
        where: {
            id: productId,
            status: 'active',
        },
    })

    if (!product) {
        return next(new AppError('Product dont exists', 404))
    }

    if (parseInt(quantity) > product.quantity || parseInt(quantity) < 0) {
        return next(
            new AppError(
                `There are only ${product.quantity} items of ${product.title}`,
                404
            )
        )
    }

    next()
}

const cartValidator = [
    body('productId').isInt().withMessage('Product Id must be a number'),
    body('quantity').isInt().withMessage('Quantit must be an integer'),
    checkValidations,
    checkParameters,
]
module.exports = {
    createProductValidations,
    createUserValidations,
    createCategoryValidations,
    checkValidations,
    checkParameters,
    cartValidator,
}

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
module.exports = {
    createProductValidations,
    createUserValidations,
    createCategoryValidations,
    checkValidations,
}

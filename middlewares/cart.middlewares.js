const { Cart } = require('../models/cart.model')
const { Category } = require('../models/category.model')
const { Product } = require('../models/product.model')
const { ProductInCart } = require('../models/productInCart.model')
const { User } = require('../models/user.model')

//utils
const { AppError } = require('../utils/app.Error.util')
const { catchAsync } = require('../utils/catchAsync.util')

const cartExists = catchAsync(async (req, res, next) => {
    const { userSession } = req

    const cart = await Cart.findOne({
        where: {
            userId: userSession.id,
            status: 'active',
        },
        include: [
            {
                model: ProductInCart,
                include: {
                    model: Product,
                    include: [
                        {
                            model: User,
                            required: false,
                            where: {
                                status: 'active',
                            },
                            attributes: {
                                exclude: ['password', 'status', 'role'],
                            },
                        },
                        {
                            model: Category,
                            required: false,
                            where: {
                                status: 'active',
                            },
                        },
                    ],
                    required: false,
                    where: {
                        status: 'active',
                    },
                    attributes: { exclude: ['categoryId', 'userId', 'status'] },
                },
                required: false,
                where: {
                    status: 'active',
                },
                attributes: { exclude: ['cartId', 'productId', 'status'] },
            },
        ],
        attributes: { exclude: ['userId', 'status'] },
    })

    if (!cart) {
        return next(new AppError('User do not have an active cart', 404))
    }

    req.cart = cart

    next()
})

module.exports = { cartExists }

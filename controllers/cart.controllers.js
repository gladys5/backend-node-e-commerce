const { Cart } = require('../models/cart.model')
const { ProductInCart } = require('../models/productInCart.model')
const { Product } = require('../models/product.model')
const { Order } = require('../models/order.model')
const { AppError } = require('../utils/app.Error.util')
const { catchAsync } = require('../utils/catchAsync.util')
const { User } = require('../models/user.model')
const { Email } = require('../utils/email.util')

const getCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req

    const cart = await Cart.findOne({
        required: false,
        where: { userId: sessionUser.id, status: 'purchased' },
        include: [
            {
                model: ProductInCart,
                include: [{ model: Product }],
            },
        ],
    })

    res.status(200).json({ status: 'success', cart })
})

const getAllCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findAll({
        required: false,
        where: { status: 'purchased' },
        include: [
            {
                model: ProductInCart,
                include: [{ model: Product }],
            },
        ],
    })

    res.status(200).json({ status: 'success', cart })
})

const addProduct = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body
    const { sessionUser } = req
    const product = await Product.findOne({ where: { id: productId } })

    if (!product) {
        return next(new AppError('Invalid product', 404))
    } else if (quantity > product.quantity) {
        return next(
            new AppError(
                `This product only has ${product.quantity} items available`,
                400
            )
        )
    }

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: 'active' },
    })

    if (!cart) {
        const newCart = await Cart.create({ userId: sessionUser.id })

        await ProductInCart.create({ cartId: newCart.id, productId, quantity })
    } else {
        const findProduct = await ProductInCart.findOne({
            required: false,
            where: { cartId: cart.id, productId, status: 'active' },
        })

        const newProductAdd = await ProductInCart.create({
            cartId: cart.id,
            productId,
            quantity,
        })
    }
    res.status(201).json({ status: 'success', cart })
})
//al actualizar a pursached me trae la cuenta actual y todos los registros anteriores🤔
const updateCart = catchAsync(async (req, res, next) => {
    const { newQty, productId } = req.body
    const { sessionUser } = req

    const cart = await Cart.findOne({
        required: false,
        where: { status: 'active', userId: sessionUser.id },
    })

    if (!cart) {
        return next(new AppError('Must create a cart first', 400))
    }

    const productInCart = await ProductInCart.findOne({
        where: { status: 'active', cartId: cart.id, productId },
        include: [{ model: Product }],
    })

    if (!productInCart) {
        return next(
            new AppError('This product does not exist in your cart', 404)
        )
    }

    if (newQty < 0 || newQty > productInCart.product.quantity) {
        return next(
            new AppError(
                `Invalid selected quantity, this product only has ${productInCart.product.quantity} items available`,
                400
            )
        )
    }

    if (newQty === 0) {
        await productInCart.update({ quantity: 0, status: 'removed' })
    } else if (newQty > 0) {
        await productInCart.update({ quantity: newQty })
    }

    res.status(200).json({ status: 'success', productInCart })
})
//envio el correo pero sale vacio por que no le he puesto html pug🤦‍♀️ y las variables tienen que traer el total y los articulos
const purchase = catchAsync(async (req, res, next) => {
    const { sessionUser } = req

    const cart = await Cart.findOne({
        required: false,
        where: { status: 'active', userId: sessionUser.id },
        include: [
            {
                model: ProductInCart,
                required: false,
                where: { status: 'active' },
                include: [{ model: Product }],
            },
        ],
    })

    if (!cart) {
        return next(new AppError('This cart does not have a cart yet.', 400))
    }

    let totalPrice = 0

    const cartPromises = cart.productInCarts.map(async (productInCart) => {
        const updatedQty =
            productInCart.product.quantity - productInCart.quantity

        await productInCart.product.update({ quantity: updatedQty })

        const productPrice =
            productInCart.quantity * +productInCart.product.price
        totalPrice += productPrice

        return await productInCart.update({ status: 'purchased' })
    })

    await Promise.all(cartPromises)
    await cart.update({ status: 'purchased' })

    const newOrder = await Order.create({
        userId: sessionUser.id,
        cartId: cart.id,
        totalPrice,
    })

    await new Email(sessionUser.email).sendNewPost(totalPrice)

    res.status(200).json({ status: 'success', cart, newOrder })
})

const removeProduct = catchAsync(async (req, res, next) => {
    const { sessionUser } = req

    const cart = await Cart.findOne({
        required: false,
        where: { userId: sessionUser.id, status: 'active' },
    })

    if (!cart) {
        return next(new AppError('Please get a shopping cart', 404))
    }

    const removeProduct = ProductInCart.findOne({
        where: { status: 'active ', cartId: cart.id },
        include: [{ model: Product }],
    })

    if (!removeProduct) {
        return next(new AppError('Product is not in cart', 404))
    } else {
        await cart.update({
            status: 'removed',
        })
    }

    res.status(200).json({ status: 'success', cart })
})

module.exports = {
    getAllCart,
    addProduct,
    updateCart,
    purchase,
    removeProduct,
    getCart,
}

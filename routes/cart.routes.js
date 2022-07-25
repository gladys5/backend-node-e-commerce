const express = require('express')

// Controllers
const {
    addProduct,
    getCart,
    purchase,
    removeProduct,
    updateCart,
    getAllCart,
} = require('../controllers/cart.controllers')
const { orderExists } = require('../middlewares/order.middleware')

// Middlewares
const { protectToken } = require('../middlewares/user.middleware')
const {
    productExists,
    protectProductOwner,
} = require('../middlewares/product.middleware')

const router = express.Router()
router.use(protectToken)
router.post('/purchase', purchase)
router.get('/orders', getAllCart)
router.get('/orders/:id', orderExists, getCart)
router.post('/add-product', addProduct)

router.patch('/update-cart', updateCart)

router.post('/purchase', purchase)

router.delete('/:productId', removeProduct)

module.exports = { CartRouter: router }

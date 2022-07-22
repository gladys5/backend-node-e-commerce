const express = require('express')

// Controllers
const {
    addProduct,
    getCart,
    purchase,
    removeProduct,
    updateCart,
} = require('../controllers/cart.controllers')

// Middlewares
const { protectToken } = require('../middlewares/user.middleware')

const router = express.Router()

router.use(protectToken)

router.get('/', getCart)

router.post('/add-product', addProduct)

router.patch('/update-cart', updateCart)

router.post('/purchase', purchase)

router.delete('/:productId', removeProduct)

module.exports = { CartRouter: router }

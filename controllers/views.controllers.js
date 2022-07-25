const path = require('path')

// Models
const { Cart } = require('../models/cart.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')

const renderIndex = catchAsync(async (req, res, next) => {
    const cart = await Cart.findAll()

    res.status(200).render('index', {
        title: 'Rendered with Pug',
        cart,
    })

    // Serve static html
    // const indexPath = path.join(__dirname, '..', 'public', 'index.html');

    // res.status(200).sendFile(indexPath);
})

module.exports = { renderIndex }

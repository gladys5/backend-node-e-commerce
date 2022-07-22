const { Order } = require('../models/order.model')
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/app.Error.util')

const orderExists = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const order = await Order.findOne({
        where: { id, status: 'active' },
    })

    if (!order) {
        return next(new AppError('Order does not exist with given Id', 404))
    }

    req.order
    next()
})

module.exports = { orderExists }

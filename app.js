const express = require('express')

const { globalErrorHandler } = require('./controllers/error.controller')
const { AppError } = require('./utils/app.Error.util')
const { UserRouter } = require('./routes/user.routes')
const { CartRouter } = require('./routes/cart.routes')
const { ProductRouter } = require('./routes/produt.routes')

const app = express()
app.use(express.json())
app.use('/api/v1/users', UserRouter)
app.use('/api/v1/carts', CartRouter)
app.use('/api/v1/products', ProductRouter)
app.all('*', (req, res, next) => {
    next(
        new AppError(
            `${req.method} ${req.originalUrl} not found in this server`,
            404
        )
    )
})
app.use(globalErrorHandler)

module.exports = { app }

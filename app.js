const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const path = require('path')
const { globalErrorHandler } = require('./controllers/error.controller')
const { AppError } = require('./utils/app.Error.util')
const { UserRouter } = require('./routes/user.routes')
const { CartRouter } = require('./routes/cart.routes')
const { ProductRouter } = require('./routes/products.routes')
//const { viewsRouter } = require('./routes/views.routes')
const app = express()
app.use(express.json())

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: 'Number of requests have been exceeded',
})

app.use(limiter)

app.use(helmet())

app.use(compression())

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
else app.use(morgan('combined'))

//app.use('/', viewsRouter)
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

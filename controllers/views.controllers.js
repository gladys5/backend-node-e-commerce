const path = require('path')

// Models
const { Category } = require('../models/category.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util')

const renderIndex = catchAsync(async (req, res, next) => {
    const categorys = await Category.findAll()

    res.status(200).render('index', {
        title: 'Rendered with Pug',
        categorys,
    })

    // Serve static html
    // const indexPath = path.join(__dirname, '..', 'public', 'index.html');

    // res.status(200).sendFile(indexPath);
})

module.exports = { renderIndex }

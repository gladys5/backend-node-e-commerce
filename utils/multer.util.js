const multer = require('multer')

const { AppError } = require('./app.Error.util')

const multerStorage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new AppError('Invalid file', 400), false)
    }
    cb(null, true)
}

const multerUpload = multer({ storage: multerStorage, fileFilter })

module.exports = { multerUpload }

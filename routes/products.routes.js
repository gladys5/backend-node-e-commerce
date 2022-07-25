const express = require('express')

const {
    createProductValidations,
    checkValidations,
} = require('../middlewares/validation.middlewares')

const { protectToken } = require('../middlewares/user.middleware')

const {
    productExists,
    protectProductOwner,
} = require('../middlewares/product.middleware')

const {
    createNewCategory,
    createProduct,
    deleteProduct,
    getAllCategories,
    getAllProducts,
    getProductById,
    updateCategory,
    updateProduct,
} = require('../controllers/product.controller')

const { multerUpload } = require('../utils/multer.util')

const router = express.Router()

router.get('/categories', getAllCategories)
router.get('/:id', productExists, getProductById)
router.get('/', getAllProducts)

router.use(protectToken)

router.post(
    '/',
    multerUpload.fields([{ name: 'productImg', maxCount: 10 }]),

    createProduct
)
router
    .route('/:id')
    .patch(productExists, protectProductOwner, updateProduct)
    .delete(productExists, protectProductOwner, deleteProduct)

router.post('/categories', createNewCategory)
router.patch('/categories/:id', updateCategory)

module.exports = { ProductRouter: router }

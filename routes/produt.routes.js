const express = require('express')

const {
    createCategoryValidations,
    createUserValidations,
    checkValidations,
} = require('../middlewares/validation.middlewares')

const {
    protectAccountOwner,
    protectToken,
} = require('../middlewares/user.middleware')

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

const router = express.Router()

router.get('/categories', getAllCategories)
router.get('/:id', productExists, getProductById)
router.get('/', getAllProducts)
router.use(protectToken)
router
    .route('/:id')
    .patch(productExists, updateProduct)
    .delete(productExists, protectProductOwner, deleteProduct)

router.post('/categories', createNewCategory)
router.post('/', createProduct)

router.patch('/categories/:id', updateCategory)

module.exports = { ProductRouter: router }

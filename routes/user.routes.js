const express = require('express')

const {
    signUp,
    login,
    updateUser,
    desactiveUser,
    getUser,
} = require('../controllers/user.controller')
const {
    createUserValidations,
} = require('../middlewares/validation.middlewares')
const {
    protectToken,
    userExist,
    protectAccount,
} = require('../middlewares/user.middleware')
const router = express.Router()

router.post('/signup', createUserValidations, signUp)
router.post('/login', login)
router.patch('/:id', protectToken, userExist, updateUser)
router.delete('/:id', protectToken, desactiveUser)
router.get('/me', protectToken, getUser)

module.exports = { UserRouter: router }

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
    checkValidations,
} = require('../middlewares/validation.middlewares')
const {
    protectToken,
    userExist,
    protectAccountOwner,
} = require('../middlewares/user.middleware')
const router = express.Router()

router.post('/', signUp, createUserValidations, checkValidations)
router.post('/login', login)

router.patch('/:id', protectToken, userExist, updateUser)
router.delete('/:id', protectToken, desactiveUser)
router.get('/me', protectToken, getUser)

module.exports = { UserRouter: router }

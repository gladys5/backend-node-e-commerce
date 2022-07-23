const express = require('express')

// Controller
const { renderIndex } = require('../controllers/views.controllers')

const viewsRouter = express.Router()

viewsRouter.get('/', renderIndex)

module.exports = { viewsRouter }

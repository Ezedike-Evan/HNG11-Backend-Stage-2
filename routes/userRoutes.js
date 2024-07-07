const express = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/:id' , authMiddleware.authMiddleware , userController.getUser)

module.exports = router
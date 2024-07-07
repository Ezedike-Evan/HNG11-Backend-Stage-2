const express = require('express')
const organisationController = require('../controllers/organisationController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/',authMiddleware.authMiddleware , organisationController.getOrg)
router.post('/',authMiddleware.authMiddleware , organisationController.postOrg)
router.get('/:orgId',authMiddleware.authMiddleware , organisationController.getOrgId)

module.exports = router
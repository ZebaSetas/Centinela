const express = require('express')
const TestController = require('../../controllers/test-controller')
const testController = new TestController()
const router = express.Router()

router.get('', testController.get)
router.post('', testController.other)
router.put('', testController.other)
router.patch('', testController.other)

module.exports = router

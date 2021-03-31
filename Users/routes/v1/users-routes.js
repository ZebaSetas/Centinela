const express = require('express');
const UserController = require('../../controllers/user-controller');
const userController = new UserController()
const auth = require('../../services/auth-service')
const router = express.Router();
const ROLE = require('../../models/role')

router.post('', userController.createAdminUser);
router.get('', auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER]), userController.getUsers);

module.exports = router;

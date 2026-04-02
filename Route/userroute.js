const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroll');

// Read users and create users.
router.get('/', userController.getAllUsers);
router.post('/', userController.adduser);

module.exports = router;
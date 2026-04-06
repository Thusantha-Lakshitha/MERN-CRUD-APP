const express = require('express');
const router = express.Router();
const {
	getAllUsers,
	adduser,
	getById,
	updateById,
	deleteById,
} = require('../controllers/usercontroll');

// Read users and create users.
router.get('/', getAllUsers);
router.post('/', adduser);
router.get('/:id', getById);
router.put('/:id', updateById);
router.delete('/:id', deleteById);


module.exports = router;
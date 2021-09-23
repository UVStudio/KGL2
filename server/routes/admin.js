const express = require('express');
const { deleteUserById } = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.delete('/:id', protect, authorize('admin'), deleteUserById);

module.exports = router;

const express = require('express');
const { deleteUserById } = require('../controllers/admin');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.delete('/:id', protect, deleteUserById);

module.exports = router;

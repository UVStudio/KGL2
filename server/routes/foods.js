const express = require('express');
const {
  getFoods,
  createFood,
  deleteFood,
  updateFood,
} = require('../controllers/foods');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/', getFoods);
router.post('/', protect, authorize('admin'), createFood);
router.delete('/:id', protect, authorize('admin'), deleteFood);
router.put('/:id', protect, authorize('admin'), updateFood);

module.exports = router;

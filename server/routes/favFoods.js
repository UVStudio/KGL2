const express = require('express');
const {
  getFavFoods,
  addFavFood,
  deleteFavFood,
  deleteFavFoods,
} = require('../controllers/favFoods');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getFavFoods);
router.delete('/', protect, deleteFavFoods);
router.put('/:id', protect, addFavFood);
router.delete('/:id', protect, deleteFavFood);

module.exports = router;

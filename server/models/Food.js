const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  foodType: {
    type: String,
    enum: [
      'branded',
      'meat',
      'vegetables',
      'fruits',
      'nuts',
      'seeds',
      'seafood',
      'dairy',
      'drinks',
      'oil',
      'spices',
    ],
    required: true,
  },
  imageUrl: {
    type: String,
  },
  protein: {
    type: Number,
    required: true,
  },
  fats: {
    type: Number,
    required: true,
  },
  fiber: {
    type: Number,
    required: true,
  },
  netCarbs: {
    type: Number,
    required: true,
  },
  macrosSplit: {
    protein: {
      type: Number,
      required: true,
    },
    fats: {
      type: Number,
      required: true,
    },
    fiber: {
      type: Number,
      required: true,
    },
    netCarbs: {
      type: Number,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Food = mongoose.model('Food', FoodSchema);

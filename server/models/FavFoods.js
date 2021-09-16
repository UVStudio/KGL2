const mongoose = require('mongoose');

const FavFoodsSchema = new mongoose.Schema({
  favFoodsArray: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Food',
      },
    ],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = FavFoods = mongoose.model('FavFoods', FavFoodsSchema);

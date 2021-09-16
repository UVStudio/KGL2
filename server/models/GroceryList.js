const mongoose = require('mongoose');

const GroceryListSchema = new mongoose.Schema({
  groceryListArray: {
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
  name: {
    type: String,
    required: true,
    default: new Date().toLocaleDateString(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = GroceryList = mongoose.model('GroceryList', GroceryListSchema);

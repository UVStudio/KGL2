const User = require('../models/User');
const FavFoods = require('../models/FavFoods');
const GroceryList = require('../models/GroceryList');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

//desc    DELETE user by ID
//route   DELETE /api/admin/:id
//access  private - admin
exports.deleteUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const userToBeDeleted = await User.findById(req.params.id);

  if (user.role !== 'admin') {
    return next(
      new ErrorResponse('User is not authorized to delete users.', 400)
    );
  }

  if (!userToBeDeleted) {
    return next(new ErrorResponse('This user is not found.', 400));
  }

  if (userToBeDeleted.role === 'admin') {
    return next(new ErrorResponse('Cannot delete admin!', 400));
  }

  await FavFoods.findOneAndRemove({ user: req.params.id });
  await GroceryList.deleteMany({ user: req.params.id });
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: `User has been deleted.`,
  });
});

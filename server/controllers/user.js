const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json(users);
});

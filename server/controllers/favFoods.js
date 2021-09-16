const Food = require('../models/Food');
const FavFoods = require('../models/FavFoods');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    ADD Food to FavFoods by ID
//route   PUT /api/favFoods/:id
//access  private
exports.addFavFood = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const food = await Food.findOne({ _id: req.params.id });
  let favFoods = await FavFoods.findOne({ user: user });

  if (!favFoods) {
    favFoods = await FavFoods.create({
      user,
      favFoodsArray: [],
    });
  }

  for (const fav of favFoods.favFoodsArray) {
    if (food.name === fav.name) {
      return next(
        new ErrorResponse('This item is already on your favourite list', 400)
      );
    }
  }

  favFoods.favFoodsArray.push(food._id);
  favFoods.save();

  res.status(200).json({
    success: true,
    data: favFoods,
  });
});

//desc    DELETE Food from FavFoods
//route   DELETE /api/favFoods/:id
//access  private
//notes   !food and !favFoods should not be possible from UI
exports.deleteFavFood = asyncHandler(async (req, res, next) => {
  await FavFoods.updateOne(
    { user: req.user.id },
    { $pull: { favFoodsArray: req.params.id } }
  );

  let favFoods = await FavFoods.findOne({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: favFoods,
  });
});

//desc    GET FavFoods by logged in user
//route   GET /api/favFoods/
//access  private
exports.getFavFoods = asyncHandler(async (req, res, next) => {
  const favFoods = await FavFoods.findOne({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: favFoods,
  });
});

//desc    DELETE logged in user's FavFoods sub doc
//route   DELETE /api/favFoods/
//access  private
exports.deleteFavFoods = asyncHandler(async (req, res, next) => {
  await FavFoods.findOneAndRemove({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});

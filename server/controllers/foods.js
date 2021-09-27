const Food = require('../models/Food');
const FavFoods = require('../models/FavFoods');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const GroceryList = require('../models/GroceryList');

//desc    CREATE Food
//route   POST /api/foods/
//access  admin
exports.createFood = asyncHandler(async (req, res, next) => {
  const { name, foodType, imageUrl, protein, fats, fiber, netCarbs } = req.body;

  let food = await Food.findOne({ name });

  if (food) {
    return next(new ErrorResponse('This food already exists', 400));
  }

  const totalMacros = protein + fats + fiber + netCarbs;

  let macrosSplit;

  if (totalMacros > 0) {
    macrosSplit = {
      protein: protein / totalMacros,
      fats: fats / totalMacros,
      fiber: fiber / totalMacros,
      netCarbs: netCarbs / totalMacros,
    };
  } else {
    macrosSplit = {
      protein: 0,
      fats: 0,
      fiber: 0,
      netCarbs: 0,
    };
  }

  food = await Food.create({
    name,
    foodType,
    imageUrl,
    protein,
    fats,
    fiber,
    netCarbs,
    macrosSplit,
  });

  res.status(200).json({
    success: true,
    data: food,
  });
});

//desc    DELETE food by id
//route   DELETE /api/foods/:id
//access  admin
//note:   food in GroceryList and FavFoods will also get removed
exports.deleteFood = asyncHandler(async (req, res, next) => {
  const foodToRemove = await Food.findByIdAndDelete(req.params.id);
  const groceryLists = await GroceryList.find();
  const favFoodsLists = await FavFoods.find();

  for (const list of groceryLists) {
    list.groceryListArray = list.groceryListArray.filter(
      (food) => food !== foodToRemove.name
    );
    list.save();
  }

  for (const list of favFoodsLists) {
    list.favFoodsArray = list.favFoodsArray.filter(
      (food) => food !== foodToRemove.name
    );
    list.save();
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

//desc    UPDATE food by ID
//route   PUT /api/foods/:id
//access  admin
exports.updateFood = asyncHandler(async (req, res, next) => {
  let food = await Food.findById({ _id: req.params.id });

  if (!food) {
    return next(
      new ErrorResponse(`Food not found with id of ${req.params.id}`, 404)
    );
  }

  food = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: food,
  });
});

//desc    GET all foods
//route   GET /api/foods/
//access  public
exports.getFoods = asyncHandler(async (req, res, next) => {
  const foods = await Food.find();

  res.status(200).json({
    success: true,
    data: foods,
  });
});

//desc    GET food by ID
//route   GET /api/foods/:id
//access  public
exports.getFoodById = asyncHandler(async (req, res, next) => {
  let food = await Food.findById({ _id: req.params.id });

  if (!food) {
    return next(
      new ErrorResponse(`Food not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: food,
  });
});

const GroceryList = require('../models/GroceryList');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    GET saved lists
//route   GET /api/groceryList/
//access  private
exports.getSavedLists = asyncHandler(async (req, res, next) => {
  const groceryLists = await GroceryList.find({ user: req.user.id });

  if (!groceryLists) {
    return next(ErrorResponse('You do not have any saved grocery list', 400));
  }

  res.status(200).json({
    success: true,
    data: groceryLists,
  });
});

//desc    SAVE New Grocery list
//route   POST /api/groceryList/
//access  private
exports.saveNewList = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const { foods, name } = req.body; //needs array of food object Id's to be passed from FE

  const groceryList = await GroceryList.create({
    user,
    name,
    groceryListArray: foods,
    updatedAt: Date.now,
  });
  res.status(200).json({
    success: true,
    data: groceryList,
  });
});

//desc    UPDATE existing list by Id
//route   PUT /api/groceryList/:id
//access  private
exports.updateExistingListById = asyncHandler(async (req, res, next) => {
  let list = await GroceryList.findOne({ _id: req.params.id });

  if (!list) {
    return next(
      new ErrorResponse(`List not found with id of ${req.params.id}`, 404)
    );
  }

  list = await GroceryList.findByIdAndUpdate(
    req.params.id,
    {
      groceryListArray: req.body.foods,
      name: req.body.name,
      lastModifiedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: list,
  });
});

//desc    DELETE logged in user's all grocery lists
//route   DELETE /api/groceryList/
//access  private
exports.deleteAllGroceryLists = asyncHandler(async (req, res, next) => {
  await GroceryList.deleteMany({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});

//desc    DELETE logged in user's grocery list by Id
//route   DELETE /api/groceryList/
//access  private
exports.deleteGroceryListById = asyncHandler(async (req, res, next) => {
  await GroceryList.findOneAndRemove({ _id: req.params.id });

  const updateLists = await GroceryList.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: updateLists,
  });
});

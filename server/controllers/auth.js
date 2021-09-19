const User = require('../models/User');
const FavFoods = require('../models/FavFoods');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const GroceryList = require('../models/GroceryList');
const sgMail = require('@sendgrid/mail');

//desc    REGISTER user
//route   POST /api/auth/register
//access  public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse('This email already exists', 400));
  }

  if (!name || !email || !password) {
    return next(
      new ErrorResponse('Please provide name, email and password', 400)
    );
  }

  user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

//desc    LOGIN user
//route   POST /api/auth/login
//access  public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  //Check for user
  const user = await User.findOne({ email }).select('+password'); //need to see password for login

  if (!user) {
    return next(new ErrorResponse('Invalid email', 401));
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  sendTokenResponse(user, 200, res);
});

//desc    GET current logged in user
//route   GET /api/auth/me
//access  private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

//desc    FORGOT Password
//route   POST /api/auth/forgotpassword
//access  public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  //get reset token
  const veriCode = user.getVerificationCode();

  await user.save({ validateBeforeSave: false });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const mailText = `Here is your 4 digit verification code: <strong>${veriCode}</strong>`;
  console.log(veriCode);

  try {
    await sgMail.send({
      to: user.email,
      from: 'info@uvstudio.ca',
      subject: 'Nordin Keto App notification',
      html: `<p>Hello ${user.name}, <br><br>
        ${mailText}<br>
        <br>
        Thanks, <br><br>
        Leonard, Nordin Keto App<br>
        UV Studio
        </p>`,
    });
    res.status(200).json({
      success: true,
      data: veriCode,
    });
  } catch (err) {
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

//desc    POST verification code
//route   PUT /api/auth/verificationCode/:vericode
//access  public
exports.verificationCode = asyncHandler(async (req, res, next) => {
  //get hashed token
  const verificationCode = crypto
    .createHash('sha256')
    .update(req.params.vericode)
    .digest('hex');

  const user = await User.findOne({
    verificationCode,
    verificationCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid verification code', 400));
  }

  //set new password
  user.password = req.body.password;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//desc    LOGOUT user / clear cookie
//route   GET /api/auth/logout
//access  private
exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
  });

  res.status(200).json({
    success: true,
    data: 'You have logged out',
  });
});

//desc    UPDATE user details
//route   PUT /api/auth/updatedetails
//access  private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { name, email } = req.body;

  //Validate email and password // password requirement removed
  if (!name || !email) {
    return next(
      new ErrorResponse('Please provide a name, email and password', 400)
    );
  }

  //Check for user
  if (!user) {
    return next(new ErrorResponse('Invalid email', 401));
  }

  //Check if password matches
  // const isMatch = await user.matchPassword(password);
  // if (!isMatch) {
  //   return next(new ErrorResponse('Invalid password', 401));
  // }

  user.name = name;
  user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

//desc     update password
//route    PUT /api/auth/password
//access   Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+password');

  console.log(req.body);

  const { oldPassword, newPassword } = req.body;

  //Check if password matches
  const isMatch = await user.matchPassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  //mongoDB syntax requires bcrypting the password as Model pre save function doesn't apply
  const salt = await bcrypt.genSalt(10);
  const encrypted = await bcrypt.hash(newPassword, salt);

  await User.updateOne(
    { _id: req.user.id },
    {
      $set: {
        password: encrypted,
        lastModifiedAt: Date.now(),
      },
    }
  );

  user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

//desc    DELETE user
//route   DELETE /api/auth/
//access  private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  await FavFoods.findOneAndRemove({ user: req.user.id });
  await GroceryList.deleteMany({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});

/*** HELPER ***/
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  //where we save token to cookie, with options
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ token, user, options });
};

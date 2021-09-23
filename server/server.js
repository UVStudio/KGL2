const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const errorHandler = require('./middleware/error');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

//.env setup
dotenv.config({ path: '.env' });

//db setup
connectDB();

//express setup
const app = express();
app.use(express.json());
app.use(cookieParser());

//Routes
const auth = require('./routes/auth');
const users = require('./routes/users');
const foods = require('./routes/foods');
const favFoods = require('./routes/favFoods');
const groceryList = require('./routes/groceryList');
const admin = require('./routes/admin');

//Routes setup
// app.get('/', (req, res) => {
//   console.log('Route connected');
//   res.send('Route connected');
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname + '/view'));

app.get('/error', (req, res) => {
  throw new Error('broken');
});

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent XSS attacks
app.use(xss());

//rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/foods', foods);
app.use('/api/favFoods', favFoods);
app.use('/api/groceryList', groceryList);
app.use('/api/admin', admin);

//custom error handling middleware
app.use(errorHandler);

//PORT
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Handle unhandled Promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});

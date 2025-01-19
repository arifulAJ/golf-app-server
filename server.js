
require('dotenv').config();
const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const logger=require('morgan')
const path = require('path');

// Importing routers
const routers = require('./routers');



// database connection setup

const {connectToDatabase}=require('./config/database')

// initial the express app
const app=express()


// connect to database

connectToDatabase();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Routes setup
app.use('/api', routers);


// Test route
app.get('/api/v1/test', (req, res) => {
    res.send('I am responding!');
  });

//   app.use(function(req, res, next) {
//     console.log(res.stack);
//     next(res.status(404).json("your request method is wrong"));
// });
app.use(function (req, res, next) {
  // Create a custom error for handling 404
  const error = new Error("Your request method is wrong");
  error.status = 404;

  // Log the error stack to the console
  console.error("Error stack trace:", error.stack);

  // Pass the error to the next middleware
  next(error);
});
// Error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error'
    });
  });

  

  module.exports=app
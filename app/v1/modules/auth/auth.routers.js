const express = require('express');
const { signUp, verifyOtp } = require('./auth.controllers');




const router = express.Router();

// this is sign up routers
router.post('/sign-up',signUp);

// this is verify otp  routers
router.post('/verify-otp',verifyOtp);













  
  module.exports = router;
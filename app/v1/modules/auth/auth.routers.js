const express = require('express');
const { signUp, verifyOtp, resendOtp } = require('./auth.controllers');




const router = express.Router();

// this is sign up routers
router.post('/sign-up',signUp);

// this is verify otp  routers
router.post('/verify-otp',verifyOtp);

// this is resend  otp  routers
router.post('/resend-otp',resendOtp);













  
  module.exports = router;
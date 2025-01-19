const express = require('express');


const authRouter=require('../modules/auth/auth.routers')


const router = express.Router();

// this the auth router 
router.use('/auth', authRouter);









  
  module.exports = router;
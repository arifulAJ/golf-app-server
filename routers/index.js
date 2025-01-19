const express = require('express');
const v1Routes = require('../app/v1/routes');

const router = express.Router();

// Mount versioned routes
router.use('/v1', v1Routes); // Mounts /api/v1

// // Catch-all for undefined routes
// router.use((req, res,next) => {
//     res.status(404).json({
//         status: 'error',
//         message: 'Endpoint not found',
//     });
//     next()
// });

// Catch-all for undefined routes (404 error)
router.use((req, res, next) => {
    const error = new Error('Endpoint not found');
     res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
    });
    error.status = 404;  // Set the status code to 404
    next(error);  // Pass the error to the next middleware (which is the error handler)
  });

module.exports = router;

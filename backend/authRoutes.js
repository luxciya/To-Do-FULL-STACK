// backend/routes/authRoutes.js
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CLIENT SECRET:", process.env.GOOGLE_CLIENT_SECRET);
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback after Google authenticates the user
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/dashboard',  // Replace with your frontend dashboard route
    failureRedirect: '/login'       // Replace with your frontend login route
  })
);

module.exports = router;

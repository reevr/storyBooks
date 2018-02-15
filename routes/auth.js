const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
function(req, res) {
    // Successful authentication, redirect home.
    console.log('logged in ');
    res.redirect('/dashboard');
  });


module.exports = router;
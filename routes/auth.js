const passport = require('passport');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// console.log(mongoose.model('stories'));

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
    // Successful authentication, redirect home.
    console.log('logged in ');
    res.redirect('/dashboard');
  }); 

  router.get('/verify', (req, res) => {
    if (req.user) {
        console.log(req.user);
    } else {
        console.log('not  logged in');
    }
  });

  router.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/');
  })

module.exports = router;
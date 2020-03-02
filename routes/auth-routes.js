const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    // failureFlash: true,
    passReqToCallback: true
  })
);

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('/main', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        score: 0
      });

       newUser.save();

      req.login(newUser, () => {
        return res.redirect("/");
      });
      res.redirect('/');
    })
    .catch(error => {
      res.render('auth/signup', { message: 'Something went wrong' });
    });
});

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('private', { user: req.user });
});

router.get('/public-page', (req, res) => {
  res.render('public', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;

// Google login routes
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login" // here you would redirect to the login page using traditional login approach
  })
);

// Facebook login routes
router.get(
  '/auth/facebook', 
  passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: '/',
    failureRedirect: '/login' }));


    //router.post('/delete/:id', (req, res, next) => {
      //const { id } = req.params;
      //console.log(id)

      //res.render('auth/login');
    //});
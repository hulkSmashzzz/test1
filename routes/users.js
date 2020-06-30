

const express = require('express');
const routes = express.Router();
const Joi = require('joi');
const randomstring = require('randomstring');
const mongoose = require('mongoose');
const mailer = require('../misc/mailer');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
//const mongourl = require('../config/mongokey');
//require('./passport')(passport);



// using Bodyparser for getting form data
routes.use(bodyparser.urlencoded({ extended: true }));
// using cookie-parser and session 
routes.use(cookieParser('secret'));
routes.use(session({
    secret: 'secret',
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
}));
// using passport for authentications 
routes.use(passport.initialize());
routes.use(passport.session());
// using flash for flash messages 
routes.use(flash());

// MIDDLEWARES
// Global variable
routes.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});
// // Validation Schema
const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  confirmpassword: Joi.any().valid(Joi.ref('password')).required()
});

// const checkAuthenticated = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
//         return next();
//     } else {
//         res.redirect('/');
//     }
// }
// Authorization 
const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('error', 'Sorry, but you are already logged in!');
    res.redirect('/');
  } else {
    return next();
  }
};

// Connecting To Database
// using Mongo Atlas as database
// mongoose.connect(mongourl ,{
//     useNewUrlParser: true, useUnifiedTopology: true,
// }).then(() => console.log("Database Connected")
// );


// ALL THE ROUTES 
// routes.get('/', (req, res) => {
//     res.render('index');
// })


routes.route('/reg')
  .get(isNotAuthenticated, (req, res) => {
    res.render('auth/reg');
  })
  .post(async (req, res, next) => {
    try {
      const result = Joi.validate(req.body, userSchema);
      if (result.error) {
        req.flash('error_message', 'Data is not valid. Please try again.');
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx");
        res.redirect('/users/reg');
        return;
      }

      // Checking if email is already taken
      const user = await User.findOne({ 'email': result.value.email });
      if (user) {
        req.flash('error_message', 'Email is already in use.');
        res.redirect('/users/reg');
        return;
      }

      // Hash the password
      const hash = await User.hashPassword(result.value.password);
      const secretToken=randomstring.generate();
      result.value.secretToken=secretToken;

      //flag the account has inactive
      result.value.active=false;

      // Save user to DB
      delete result.value.confirmpassword;
      result.value.password = hash;

      const newUser = await new User(result.value); 
      console.log('newUser', newUser);
      await newUser.save();
      //commpose Email
      const html = `Hi there,
      <br/>
      Thank You for registering!
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${secretToken}</b>
      <br/>
      On the following page:
      <a href ="http://localhost:3000/users/verify"> http://localhost:3000/users/verify </a>
      <br/><br/>
      Have a pleasent day!`;

      //send the mail
      await mailer.sendmail('admin@happytohelp.com',result.value.email,'Please verify your email',html);

      req.flash('success_message', 'Please check your email.');
      res.redirect('/users/verify');
    } catch(error) {
      next(error);
    }
  });

// routes.post('/register', (req, res) => {
//     var { email, username, password, confirmpassword } = req.body;
//     var err;
//     if (!email || !username || !password || !confirmpassword) {
//         err = "Please Fill All The Fields...";
//         res.render('index', { 'err': err });
//     }
//     if (password != confirmpassword) {
//         err = "Passwords Don't Match";
//         res.render('index', { 'err': err, 'email': email, 'username': username });
//     }
//     if (typeof err == 'undefined') {
//         user.findOne({ email: email }, function (err, data) {
//             if (err) throw err;
//             if (data) {
//                 console.log("User Exists");
//                 err = "User Already Exists With This Email...";
//                 res.render('index', { 'err': err, 'email': email, 'username': username });
//             } else {
//                 bcrypt.genSalt(10, (err, salt) => {
//                     if (err) throw err;
//                     bcrypt.hash(password, salt, (err, hash) => {
//                         if (err) throw err;
//                         password = hash;
//                         user({
//                             email,
//                             username,
//                             password,
//                         }).save((err, data) => {
//                             if (err) throw err;
//                             req.flash('success_message', "Registered Successfully.. Login To Continue..");
//                             res.redirect('/login');
//                         });
//                     });
//                 });
//             }
//         });
//     }
// });


// // Authentication Strategy
// // ---------------


routes.route('/verify')
.get(isNotAuthenticated, (req, res) => {
  res.render('auth/verify');
  })
.post(async(req,res,next)=>{
  try{
    const { secretToken }= req.body;
    //const  secretToken = req.body.secretToken;
    console.log(secretToken);

    //find the account that matches the email.
    const user= await User.findOne({ 'secretToken': secretToken});
    if(!user){
      //req.flash('error_message', 'No user found');
      req.flash('error_message', 'No user found.');
      res.redirect('/users/verify');
      return;
    }
    user.active=true;
    user.secretToken='';
    await user.save();

    req.flash('success_message','Thank You! Now you may login');
    res.redirect('/users/login');

  }catch(error){
    next(error);
  }
});



// routes.get('/login', (req, res) => {
//     res.render('login');
// });

routes.route('/login')
  .get(isNotAuthenticated, (req, res) => {
    res.render('auth/login');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  
  }));

// routes.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         failureRedirect: '/login',
//         successRedirect: '/success',
//         failureFlash: true,
//     })(req, res, next);
// });

// routes.get('/success', checkAuthenticated, (req, res) => {
//     res.render('success', { 'user': req.user });
// });


// routes.route('/logout')
//   .get(isAuthenticated, (req, res) => {
//     req.logout();
//     req.flash('success_message', 'Successfully logged out. Hope to see you soon!');
//     res.redirect('/');
//   });

routes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});



module.exports = routes;




var passport = require('passport');
const mongoose = require('mongoose');
var validator = require('express-validator');

mongoose.connect('mongodb//:localhost/FutaChat');
var LocalStrategy = require('passport-local').Strategy;
var User =  require('../models/User');
passport.serializeUser(function(user , done ){
    done(null , user.id);

});
passport.deserializeUser(function (id  , done ){
    User.findById(id , function (err , user) {
        done(err , user);
    });

});

passport.use('locals.signup' , new LocalStrategy({
    usernameField: 'username',
    passwordField : 'password',
    passReqToCallback: true
},

    function(req , username , password , done) {
        req.checkBody('username', 'Please enter username!!!').notEmpty();
        req.checkBody('password', 'please enter password').notEmpty().isLength({min: 4});
        req.checkBody('password2', 'password does not match').equals(req.body.password);
        var errors = req.validationErrors();
        if (errors) {
            var message = [];
            errors.forEach(function (error) {
                message.push(error.msg);
            });
            return done(null, false, req.flash('error', message));
        }


        User.findOne({'username' : username}, function (err , user) {
            if(err){
                return done(err)
            }
            if(user) {
                return done(null , false , {message : 'Username has been taken already'});

            }
            const  newUser = new User();
            newUser.username = username;
            newUser.friend_requests=[];
            newUser.password = newUser.encryptPassword(password);
            newUser.save(function (err , user) {
              if(err){
                  return done(err);

              }
              return done(null , user , {message : 'Welcome'});
            })
        });
    }));



// passport.use('locals.signup' , new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback: true
// },
// function(req , username , password){
//     User.findOne({'': })
//
// }
//
// ));


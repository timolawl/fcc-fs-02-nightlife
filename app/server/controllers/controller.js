'use strict';

const User = require('../models/user.js');
//const socket = require('./middleware/socketio');

module.exports = function controller () { // can't use arrow notation here because the this is execution context this and not lexical this
  this.loadProfile = (req, res) => {
    /* // req.user isn't defined here yet.
    console.log('req.user.id before home: ' + req.user.id);
    console.log('req.session.passport before home: ' + req.session.passport);
    console.log('req.session.passport.user before home: ' + req.session.passport.user);
    */
  //  console.log('home page');
    if (req.isAuthenticated()) { // authenticated using which method though?
    //  console.log('user is authenticated');
      // load profile for user
     // console.log('req.user.id is... ' + req.user.id);
     // console.log('req.session is... ' + req.session);
      /*
      for (var property in req.session) {
        console.log(property + '=' + req.session[property]);
      }*/
      // borrowed function to analyze the contents of req.session
      /*
      var my_stringify2 = function (obj) {
          var objKeys = Object.keys(obj);
          var keyValueArray = new Array();
          for (var i = 0; i < objKeys.length; i++) {
              var keyValueString = '"' + objKeys[i] + '":';
              var objValue = obj[objKeys[i]];
              keyValueString = (typeof objValue == "string") ? 
                  keyValueString = keyValueString + '"' + objValue + '"' : 
                  keyValueString = keyValueString + my_stringify2(objValue);
              keyValueArray.push(keyValueString);
          }
          return "{" + keyValueArray.join(",") + "}";
      }
      console.log(my_stringify2(req.session));
      */

   //   console.log('req.session.passport.user: ' + req.session.passport.user);
      User.findOne({ _id: req.user.id }, function (err, user) {
        if (err) throw err;
        if (!user) {
          console.error('This should never happen..');
        }
        else {
          // load user social media platform used for login
          if (user.provider === 'twitter') {
            res.render('index', { loggedIn: 'true', provider: 'Twitter', displayName: user.twitterDisplayName });
          }
          else if (user.provider === 'facebook') {
            res.render('index', { loggedIn: 'true', provider: 'Facebook', displayName: user.facebookDisplayName });
          }
        }
      });
    }
    else res.render('index', { loggedIn: 'false' });
  };
/*
  this.initTwitterAuth = (req, res) {
    // use the req.user.id as the _id for the user
    console.log('Socket search location: ' + socket.request.session.searchLocation);
    passport.authenticate('twitter');
  };
  */
};



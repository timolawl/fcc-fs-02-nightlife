'use strict';

// best I can do is check validity and existence of email.

const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../../models/user');
// [WITH EMAIL]
// const email = require('./email'); // email middleware for sending emails

module.exports = passport => {
  //serialization/deserialization of user for session..
  // serialize called when user logs in
  passport.serializeUser((user, done) => {
    console.log('serializing user (user.id): ' + user._id);
    done(null, user._id);
  });

  // deserialize the opposite, though explanation somewhat confusing:
  // takes the id stored in the session and we use that id to retrieve our user.
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      console.log('deserializing user (id): ' + id);
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/login/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(() => {
        User.findOrCreate(profile, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
      });
    }
  ));

  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://localhost:5000/login/twitter/callback'
      //callbackURL: 'https://timolawl-nightlife.herokuapp.com'
    },
    function (token, tokenSecret, profile, cb) {
      process.nextTick(() => {
        console.log('hello?');
        console.log('profile id: ' + profile.id);
        console.log('token: ' + token);
        console.log('tokenSecret: ' + tokenSecret);
        console.log('profile: ' + profile);
        console.log('profile.provider: ' + profile.provider);
        console.log('profile.displayName: ' + profile.displayName);
        User.findOrCreate(profile, function (err, user) {
          return cb(err, user);
        });
      });
    }
  ));
};

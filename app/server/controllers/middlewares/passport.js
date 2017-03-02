'use strict';

// best I can do is check validity and existence of email.


const User = require('../../models/user');
// [WITH EMAIL]
// const email = require('./email'); // email middleware for sending emails

module.exports = passport => {
    //serialization/deserialization of user for session..
    // serialize called when user logs in
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // deserialize the opposite, though explanation somewhat confusing:
    // takes the id stored in the session and we use that id to retrieve our user.
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

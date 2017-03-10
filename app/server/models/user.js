'use strict';

const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  // _id                 : Number, // don't specify and it will be auto generated
  // specify and it won't be auto generated
  twitterID           : { type: String, unique: true },
  twitterDisplayName  : { type: String, unique: true },
  twitterToken        : { type: String, unique: true, select: false },
  twitterTokenSecret  : { type: String, unique: true, select: false },
  facebookID          : { type: String, unique: true },
  facebookDisplayName : { type: String, unique: true },
  provider            : String // the provider with which the user authenticated
      // no need to put the votes here. Just display them on the actual bar schema
    // and check if the userID is found on that bar schema - if so then have it highlighted
      
    //  username        : { type: String, required: true, unique: true },
    //  email           : { type: String, required: true, unique: true },
    //  password        : { type: String, required: true, select: false },
    //  accountStatus   : String,
    //  accountConfirmationToken: String,
    //  accountConfirmationExpires: Date,
    //  resetPasswordToken: String,
    //  resetPasswordExpires: Date,
    //  polls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }],
    //  pollsVotedOn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }]
});



/*
userSchema.pre('save', function (next) {
    const user = this;
    // only hash the password if it has been modified or is new
    if (!user.isModified('local.password')) return next();

    // generate a salt:
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.local.password, salt, (err, hash) => {
            if (err) return next(err);

            user.local.password = hash;
            return next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.local.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};
*/



userSchema.statics.findOrCreate = function (profile, cb) {
  var newUser = new this();

  this.findOne({ $or: [{ twitterID: profile.id }, { facebookID: profile.id }] }, function (err, result) {
    if (err) throw err;
    if (!result) {
      console.log('making new profile...');
      console.log('provider is: ' + profile.provider);
      //console.log('req.user.id is: ' + req.user.id);
      //newUser._id = req.user.id;
      //newUser._id = profile.id; // testing
      newUser.provider = profile.provider;

      if (profile.provider === 'facebook') {
        newUser.facebookID = profile.id;
        newUser.facebookDisplayName = profile.displayName;
      }

      if (profile.provider === 'twitter') {
        newUser.twitterID = profile.id; // do I need to save token and token secret?
        newUser.twitterDisplayName = profile.displayName;
      }
      
      console.log('newUser: ' + newUser);
      newUser.save(cb); // interesting statement
    }
    else cb(err, result);
  });
};

module.exports = mongoose.model('User', userSchema);

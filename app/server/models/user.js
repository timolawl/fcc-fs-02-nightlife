'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const Poll = require('./poll');

const userSchema = new mongoose.Schema({
    local               : {
        _id             : Number,
        username        : { type: String, required: true, unique: true },
        email           : { type: String, required: true, unique: true },
        password        : { type: String, required: true, select: false },
      //  accountStatus   : String,
      //  accountConfirmationToken: String,
      //  accountConfirmationExpires: Date,
      //  resetPasswordToken: String,
      //  resetPasswordExpires: Date,
      //  polls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }],
      //  pollsVotedOn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }]
    }
});

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

module.exports = mongoose.model('User', userSchema);

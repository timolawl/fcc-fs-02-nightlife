'use strict';

const uuid = require('node-uuid');
const mailer = require('nodemailer');


// need to pass back a confirmation nonce/host etc?
// need to pass in whether it is an account confirmation or password reset
//
// 
//
module.exports = { // it doesn't have to be a function as far as I'm aware.
    toConfirmAccount: () => {
        console.log('confirm account.');
    },

    toResetPassword: () => {
        console.log('reset password.');
    }
}

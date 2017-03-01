'use strict';

const mongoose = require('mongoose');
/*
const optionSchema = new mongoose.Schema({
  //  _poll: { type: String, ref: 'Poll' },
    text: { type: String, required: true, unique: true },
    voteCount: { type: Number, default: 0 }
});

//const Option = mongoose.model('Option', optionSchema);
*/
const pollSchema = new mongoose.Schema({
  _creator: String,
  lastActivity: { type: Date, default: Date.now },
  title: { type: String, required: true },
//  options: [{ type: mongoose.Schema.ObjectId, ref: 'Option' }],
//  options: [optionSchema],
//  Default values don't work with arrays, but can use pre-save hook.
//  http://stackoverflow.com/questions/31845282/why-doesnt-my-schema-to-add-default-values-in-mongoose-arrays
//  
  options: [ { optionText: { type: String }, 
              voteCount: { type: Number }} ],
  permalink: { type: String, unique: true, required: true },
  voters: [ String ]
});


module.exports = mongoose.model('Poll', pollSchema);

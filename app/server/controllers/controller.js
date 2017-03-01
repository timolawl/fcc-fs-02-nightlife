'use strict'

const uuid = require('node-uuid'); // nonce creation

const Poll = require('../models/poll');


function controller () {
  this.createpoll = (req, res) => {
    const newPoll = new Poll();
    newPoll._creator = req.user.id;
    // newPoll.dateCreated = Date.now(); // not needed; will default to Date.now() on every save
    newPoll.title = req.body.name;
    let optionsLength = req.body.options.length;
    for (let i = 0; i < optionsLength; i++) {
      newPoll.options.push({ optionText: req.body.options[i], voteCount: 0 });
    }
    newPoll.permalink = uuid.v4();
    
    newPoll.save(err => {
      if (err) throw err;
    });

    // it's not a render because the path changes; thus it must be a redirect..
    // question is, can I pass local variables through a redirect?
    // maybe this isn't necessary as it can always be queried from the db
    // but direct queries is not necessary as this individual is the creator.
    // still, a local variable passed saying that this poll was just created would help..
    res.redirect('/poll/' + newPoll.permalink); // , { permalink: newPoll.permalink });
    // the above option should go through the normal behavior of going through controller.renderpoll.. check to make sure later.

  };

  this.renderpoll = (req, res) => {
    // leave any previous rooms then join the current room


    // pull up the poll data using the nonce
    Poll.findOne({ 'permalink': req.path.slice(6) }).exec((err, poll) => {
      if (err) throw err;
      if (!poll) {
        // no poll exists at this permalink; redirect individual to 404 page.
        res.redirect('/404');
      }
      else {
        let voted = 'false';
        // tease out data first..
        const creator = poll._creator;
        const pollTitle = poll.title;
        const voteCount = poll.options.map(x => x.voteCount);
        const optionText = poll.options.map(x => x.optionText);
        const voters = poll.voters;


        // check if already voted:
        if (req.isAuthenticated()) {
          if (voters.indexOf(req.user.id) > -1)
            voted = 'true';
        }

        const permalink = req.protocol + '://' + req.get('host') + req.originalUrl; // for allowing the copy paste function

        if (req.isAuthenticated()) {
          if (req.user && req.user.id && req.user.id === creator) {
            res.render('poll', { owner: 'true', loggedIn: 'true', permalink: permalink, path: 'poll', optionText: optionText, voteCount: voteCount, pollTitle: pollTitle, voted: voted });
          }
          else res.render('poll', { owner: 'false', loggedIn: 'true', permalink: permalink, path: 'poll', optionText: optionText, voteCount: voteCount, pollTitle: pollTitle, voted: voted });
        }
        else res.render('poll', { owner: 'false', loggedIn: 'false', permalink: permalink, path: 'poll', optionText: optionText, voteCount: voteCount, pollTitle: pollTitle, voted: voted });  
      }
    });

  };
/*
  this.updatepoll = (req, res) => {
    // socket io no room change as it is an update

    // on post on a poll page, do this:
    // two pieces of essential information is the submit type and the option.
    console.log('test');
    console.log('New option submitted: ' + req.body.option);
  };
*/
  this.deletepoll = (req, res) => {
  
    Poll.findOneAndRemove({ 'permalink': req.path.slice(6) }).exec(err => {
      if (err) throw err;
    });

    res.redirect('/')

  };

}

module.exports = controller;

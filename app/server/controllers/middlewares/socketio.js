'use strict';

const Poll = require('../../models/poll');

module.exports = io => {

  

  io.on('connection', function(socket) {
    // this only works if the user is already registered and logged in:
    if (socket.request.session.passport) {
      var userID = socket.request.session.passport.user;
     // console.log(`Your user ID is ${userID}`);
    }

    // problem with this approach is that a client is on a page that doesn't require rooms, client remains connected to an old room...
    // perhaps the proper approach is to leave any rooms upon joining the non-room pages
    //

    socket.on('leave room', function (data) {
      if (socket.room !== undefined)
        socket.leave(socket.room);
    });

    socket.on('change room', function (data) {
      if (socket.room !== undefined)
        socket.leave(socket.room);
      socket.room = data.room;
      socket.join(socket.room);
    });
    
    socket.on('add vote', function (data) {
      Poll.findOne({ 'permalink': data.path }).exec((err, poll) => {
        if (err) throw err;
        if (!poll) throw err;
        else {
          // get the correct option
          for (let i = 0; i < poll.options.length; i++) {
            if (poll.options[i].optionText === data.vote) {
              poll.options[i].voteCount++;
              poll.voters.push(userID);
              poll.lastActivity = new Date();
              poll.save(err => {
                if (err) throw err;
              });
              break;
            }
          }

          // http://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender-socket-io
          io.in(data.path).emit('update poll', { pollOptions: poll.options });
        }
      });
    });

    socket.on('add option', function (data) {
      Poll.findOne({ 'permalink': data.path }).exec((err, poll) => {
        if (err) throw err;
        if (!poll) throw err;
        else {
          let duplicate = false;

          // check if unique first, if not add to existing.
          for (let i = 0; i < poll.options.length; i++) {
            if (poll.options[i].optionText === data.option) { // currently case matters
              poll.options[i].voteCount++;
              poll.voters.push(userID);
              poll.lastActivity = new Date();
              poll.save(err => {
                if (err) throw err;
              });
              duplicate = true;
              break;
            }
          }
          if (!duplicate) {
            poll.options.push({ optionText: data.option, voteCount: 1 });
            poll.voters.push(userID);
            poll.save(err => {
              if (err) throw err;
            });
          }
          io.in(data.path).emit('update poll', { pollOptions: poll.options });
        }
      }); 
    });
    
    socket.on('vote check', function (data) {
      // check the vote status of current user
       Poll.findOne({ 'permalink': data.path }).exec((err, poll) => {
        if (err) throw err;
        if (!poll) throw err;
        else {
          let voters = poll.voters;
          if (voters.indexOf(userID) >= -1) {
            // voted
            socket.emit('voted', {});
          }
        }
      });

    });

    socket.on('list all polls', function (data) {
      Poll.find().sort({ lastActivity: -1 }).exec((err, polls) => {
        let pollNames = polls.map(x => x.title);
        let pollLinks = polls.map(x => x.permalink);
        // need the permalink and the title.
        socket.emit('populate all polls', { titles: pollNames, permalinks: pollLinks });
      });
    });

    socket.on('list my polls', function (data) {
      Poll.find({ _creator: userID }).sort({ lastActivity: -1 }).exec((err, polls) => {
        let pollNames = polls.map(x => x.title);
        let pollLinks = polls.map(x => x.permalink);
        // need the permalink and the title.
        socket.emit('populate my polls', { titles: pollNames, permalinks: pollLinks });
      });

    });

  });

};

'use strict';

const fetch = require('node-fetch');

const Bar = require('../../models/bar');

module.exports = io => {

  // acting as route and controller here.
  // the structured formatting would help for sure..
  

  io.on('connection', function (socket) {
    // this only works if the user is already registered and logged in:
    let userID;

    if (socket.request.session.passport) {
      userID = socket.request.session.passport.user;
      //socket.request.session.searchLocation
  //    console.log(`Your user ID is ${userID}`);
      //console.log(`Search Location: ${socket.request.session.searchLocation}`);
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

    socket.on('bar search', function (data) {
   //   console.log('socket search!');
   //   console.log('location: ' + data.location);

      const params = 'grant_type=client_credentials' + '&' +
        'client_id=' + process.env.YELP_APP_ID + '&' +
        'client_secret=' + process.env.YELP_APP_SECRET;

      const reqTokenURL = 'https://api.yelp.com/oauth2/token';
      const searchNearbyURL = 'https://api.yelp.com/v3/businesses/search';
      const location = 'location=' + encodeURIComponent(data.location);
      //console.log(location);
     // socket.request.session.searchLocation = data.location;
   //   console.log(socket.request.session);
   //   console.log('socket session id: ' + socket.request.session.id);
      const businessesQueryURL = `${searchNearbyURL}?${location}&categories=bars`;
      let authorizationHeader = '';

      //var yelpSearchResults = {}; // temporary storage in order to add in the one review
     
      // lookup in database which bars have attendees
      /*
      Bar.find({ guestlist: { $exists: true, $ne: [] }}).exec((err, result) => {
        if (err) throw err;
        if (!result) { console.log('no bars yet..') };
        else {
          console.log(result);
        }
      });
*/


      fetch(reqTokenURL, { method: 'POST', body: params })
        .then(res => res.json())
        .then(json => {
          authorizationHeader = json.token_type + ' ' + json.access_token;
          // here you want to do the actual search
          return fetch(businessesQueryURL, { method: 'GET', headers: { Authorization: authorizationHeader } })
        })
        .then(res => res.json())
        .then(json => {
          let promises = json.businesses.slice(0).map(business => {
            var businessReviewURL = `https://api.yelp.com/v3/businesses/${business.id}/reviews`;
            return fetch(businessReviewURL, { method: 'GET', headers: { Authorization: authorizationHeader } })
              .then(res => res.json())
              .then(json => {
                if (json.reviews[0]) {
                  business.excerpt = json.reviews[0].text; // save excerpt
                }
                return business;
              });
          });

          Promise.all(promises).then(businessListings => {
            // returned data is in arguments[0], arguments[1]...
       //     console.log('all excerpts received!');
            // retrieve only the relevant statistics
            
           // console.log(yelpReviews);
            let businessIDs = businessListings.map(business => business.id);

            let yelpReviews = businessListings.map(businessListing => {
              const condensedReview = {};
              condensedReview.id = businessListing.id; // needed for lookup later.
              condensedReview.image_url = businessListing.image_url;
              condensedReview.url = businessListing.url;
              condensedReview.name = businessListing.name;
              condensedReview.excerpt = businessListing.excerpt;
              condensedReview.guestCount = 0;
              condensedReview.attending = false;
              return condensedReview;
            });

          

            // compare the listings with the bars with attendees

            let promise = Bar.find({
              name: { $in: businessIDs },
              guestCount: { $gt: 0 }
            }).exec((err, docs) => {
              if (err) throw err;
         //     console.log('logging docs...');
              // business names, number attending, user included?
         //     console.log(docs);
              // ill have an array of places that
              docs.forEach(doc => {
                let businessToUpdateIndex = yelpReviews.findIndex(biz => biz.id === doc.name);
               // console.log(yelpReviews.findIndex(biz => biz.id === doc.name));
                if (businessToUpdateIndex > -1) { // business found
         //         console.log('business to update..');
                  yelpReviews[businessToUpdateIndex].guestCount = doc.guestCount;
                  if (doc.guestList.find(user => user === userID)) {
                    yelpReviews[businessToUpdateIndex].attending = true;
                  }
                 // console.log(yelpReviews);
                }

              });
            });

            promise.then(() => {
              socket.emit('bar results', { reviews: yelpReviews });
            });


          }, function (err) {
            console.error('rip..');
          });
          
       //   console.log('results have been found!');
        });
    });

    socket.on('add attendance', function (data) {
      // remove all old rsvps from all bars

      //console.log('Adding attendance to: ' + data.bar);  
      Bar.findOne({ 'name': data.bar }).exec((err, bar) => {
        if (err) throw err;
        if (!bar) {
          const newBar = new Bar();
          newBar.name = data.bar;
          //newBar.guestList.push({ attendee: userID, timeOfRSVP: Date.now() });
          newBar.guestList.push(userID);
          newBar.guestCount += 1;
        //  console.log(newBar);
          
          newBar.save(err => {
            if (err) {
              console.log(err);
              console.log('something went wrong');
            } // throw err;
            // broadcast the update to all other users
            socket.broadcast.emit('update', { bar: newBar });
          });
        }
        else {
          //bar.guestList.push({ attendee: userID, timeOfRSVP: Date.now() });
          bar.guestList.push(userID);
          bar.guestCount += 1;
          bar.save(err => {
            if (err) throw err;
          });
          socket.broadcast.emit('update', { bar: bar });
       //   console.log('adding');
       //   console.log(bar);
        }
      });

    });

    socket.on('remove attendance', function (data) {

      //console.log('Removing attendance from: ' + data.bar);
/*
      Bar.update(
        { 'name': data.bar },
        { $pull: { 'guestList': userID },
          $inc: { 'guestCount': -1 } }
      );
*/
      
      Bar.findOneAndUpdate({ 'name': data.bar }, 
        { $pull: { 'guestList': userID },
          $inc: { 'guestCount': -1 } },
        { new: true }, (err, bar) => { // option true sets mongodb to return changed doc
          if (err) throw error;
          else {
            bar.save(err => {
              if (err) throw err;
            });
            socket.broadcast.emit('update', { bar: bar });
       //     console.log('removing');
       //     console.log(bar);
          }
        });
      
      
      /*
      Bar.findOne({ 'name': data.bar }).exec((err, bar) => {
        if (err) throw err;
        if (!bar) throw err;
        else {
         // bar.guestList.remove({ attendee: userID }, (err, bar) => {
        
          bar.remove(userID, (err, bar) => {
            if (err) throw err;
            else {
              bar.guestCount -= 1;
              bar.save(err => {
                if (err) throw err;
              });
            }
          });
        }
      });
      */
    });

  });
};

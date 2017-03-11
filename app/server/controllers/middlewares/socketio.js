'use strict';

const Poll = require('../../models/poll');
const fetch = require('node-fetch');

module.exports = io => {

  // acting as route and controller here.
  // the structured formatting would help for sure..
  

  io.on('connection', function (socket) {
    // this only works if the user is already registered and logged in:
    if (socket.request.session.passport) {
      var userID = socket.request.session.passport.user;
      //socket.request.session.searchLocation
      console.log(`Your user ID is ${userID}`);
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

   // socket.on('

    socket.on('bar search', function (data) {
      console.log('socket search!');
      console.log('location: ' + data.location);
      // get stuff from yelp now..then emit it back to the user
      // very interesting to perform a REST call inside a socket io method...
      // but the environmental variables are needed
      /* // can't do xhr server side unless using a module 
       * might as well use fetch module instead then
      var xhr = new XMLHttpRequest();
      var params = 'grant_type=client_credentials' + '&' +
        'client_id=' + process.env.YELP_APP_ID + '&' +
        'client_secret=' + process.env.YELP_APP_SECRET;
      var url = 'https://api.yelp.com/oauth2/token';
      xhr.open('POST', url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { console.log('xhr response: ' + xhr.responseText); }
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Content-length', params.length);
        xhr.setRequestHeader('Connection', 'close');
        xhr.send(params);
      };
      */
      const params = 'grant_type=client_credentials' + '&' +
        'client_id=' + process.env.YELP_APP_ID + '&' +
        'client_secret=' + process.env.YELP_APP_SECRET;

      const reqTokenURL = 'https://api.yelp.com/oauth2/token';
      const searchNearbyURL = 'https://api.yelp.com/v3/businesses/search';
      const location = 'location=' + encodeURIComponent(data.location);
      //console.log(location);
     // socket.request.session.searchLocation = data.location;
      console.log(socket.request.session);
      console.log('socket session id: ' + socket.request.session.id);
      const businessesQueryURL = `${searchNearbyURL}?${location}&categories=bars`;
      let authorizationHeader = '';

      var yelpSearchResults = {}; // temporary storage in order to add in the one review
      

      fetch(reqTokenURL, { method: 'POST', body: params })
        .then(res => res.json())
        .then(json => {
          authorizationHeader = json.token_type + ' ' + json.access_token;
          // here you want to do the actual search
          return fetch(businessesQueryURL, { method: 'GET', headers: { Authorization: authorizationHeader } })
        })
        .then(res => res.json())
        .then(json => {
          // needed:
          // id for lookup
          // image_url for displaying the image
          // url
          // name
          
          // yelpSearchResults = Object.create(json);
          // console.log(yelpSearchResults);
          //
          //yelpSearchResults = json.businesses.slice(0); // clone the business array
          //console.log(yelpSearchResults);

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
            console.log('all excerpts received!');
            //console.log(businessListings);
            // retrieve only the relevant statistics
            let yelpReviews = businessListings.map(businessListing => {
              const condensedReview = {};
              //condensedReview.id = businessListing.id;
              condensedReview.image_url = businessListing.image_url;
              condensedReview.url = businessListing.url;
              condensedReview.name = businessListing.name;
              condensedReview.excerpt = businessListing.excerpt;
              return condensedReview;
            });

           // console.log(yelpReviews);

            socket.emit('bar results', { reviews: yelpReviews });


          }, function (err) {
            console.error('rip..');
          });
          

          //console.log(yelpSearchResults);


          // send this to the client through a socket emit
          // then socket.on the data and have the client build the content client side.
          //for (let i = 0; i < json.businesses.length; i++) {
          //  json.businesses[i]
          //}
          
          // store the businesses in an object first


          //socket.emit('bar results', { results: json.businesses });


          // no need to save any to the db unless voted upon
          // but for holding search, can hold in memory?
          // if I do more than 6 entries, then I'll also need to remember the page
          // upon redirect
          //
          // maybe just save the most recent search and page for the redirects..
          // and if the redirect was from a login, then show the same as before
          // just save into recent search
          // and if the redirect comes from a successful login redirect
          // then redisplay the previous content also check if the login attempt
          // was from a click of attendence.
          // In any case, the state needs to be saved on sign in (attempt?)
          // or on successful login?
          // well, once it reaches this section, a search has been done,
          // and i can save this section as part of the users most recent search
          // but this section can be accessed independent of login status
          // so the saving will only be as a server variable instead of in the database..
          // I can't save it to session because at this point session is read only
          // and I can't save it to db because user has not logged in yet potentially
          //
          // however, it may actually be better to have a loaded page with
          // query strings with the search parameters at the top
          // then redirect to that and it would be easy to pull up right?
          // problem with that approach is that it can be XSSed and script injected
          // 
          // or i can only get the query string when it is generated and then i store it
          // should never be from the bar to the server, only from server to server
          // are SPAs overrated? should I separate out the events?.
         /* 
          json.businesses.map(business => {
          //  business.
          });
*/
          // data needed:
          // json.businesses (the businesses array)
          // json.businesses.map(x => {});
          //
          // business id (for review lookup)
          // 
        //  console.log(json);
          console.log('results have been found!');

          // here you want to look up the top review
        });
    });
  });
};

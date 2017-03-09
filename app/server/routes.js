'use strict';

const Controller = require('./controllers/controller');

module.exports = (app, passport) => {

  const controller = new Controller();

  app.route('/')
    .get(controller.loadProfile);


  app.route('/login/twitter')
    .get(passport.authenticate('twitter'));

  app.route('/login/twitter/callback')
    .get(passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
      // the request should have the token etc right? // it's also getting in the url..
      console.log('spilling contents of the callback..');
      console.log(req.body);
      // successful authentication, redirect home
      res.redirect('/');
    });
      
      
  
  app.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/'); // should redirect depending on content in input box
    });

  app.use((req, res) => {
    if (req.isAuthenticated())
      res.render('404', { loggedIn: 'true', path: '404' });
    else res.render('404', { loggedIn: 'false', path: '404' });
  });
  //app.use((req, res) => { res.status(400).send('Bad request.'); });


};

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) // isAuthenticated is a passport JS add-on method
    return next();
  res.redirect('/');
}

function isNotLoggedIn (req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/');
  else return next();
}


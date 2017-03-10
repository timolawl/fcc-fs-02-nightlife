'use strict';

// socket io -- the cdnjs script is in the HTML template above this script file
var socket = io();

window.onload = function () {

  var logStatus = document.querySelector('.mainbox__log-button').textContent;

  Array.prototype.forEach.call(document.querySelectorAll('.mainbox__log-button'), el => el.addEventListener('click', () => {
    if (logStatus === 'Log In') {
      document.querySelector('.overlay').classList.remove('visibility--hide');
      document.querySelector('.modal').classList.remove('display--hide');
    }
    else if (logStatus === 'Log Out') {
      location.href = '/logout';
    }
  }));

  // on submit, reveal results and unfix the display of footer
  document.querySelector('.mainbox__search').addEventListener('click', e => {
    // on submit button press and with content in input box:
    if (e.target.classList.contains('mainbox__search--submit') && document.querySelector('.mainbox__search--input').value) { // submit button pressed with inputted content
      // emit socket
      // server side environmental variables are needed so the ajax call is better off not performed here
      socket.emit('bar search', { location: document.querySelector('.mainbox__search--input').value });
      document.querySelector('footer').classList.remove('footer--unsearched');
      document.querySelector('.bar-list').classList.remove('visibility--hide');
    }
  });

  document.querySelector('.mainbox__search').addEventListener('keyup', e => {
    // on mainbox focus and enter key press with content in input box:
    //e.preventDefault();
    var key = e.which || e.keyCode;
    if (key === 13 && document.querySelector('.mainbox__search--input').value) { // on enter key press
      
      socket.emit('bar search', { location: document.querySelector('.mainbox__search--input').value });
      document.querySelector('footer').classList.remove('footer--unsearched');
      document.querySelector('.bar-list').classList.remove('visibility--hide');
    }
  });

  // when there is input, change view to have search bar at the top of the page
  document.querySelector('.mainbox__search--input').addEventListener('input', e => {
    if (e.target.value || e.target.length !== 0) {
/*
      // clicking the log out button at the top triggers a logout event
      // needed here as well because can't add event listener on a display none
      if (logStatus === 'Log Out') { // meaning user is logged in
        document.querySelector('.mainbox__log-button--top').addEventListener('click', e => {
          location.href = '/logout';
        });
      }
      */

      

      // hide/unhide operations
      document.querySelector('.mainbox').classList.add('mainbox--top'); // move mainbox to top
      document.querySelector('.mainbox__search').classList.add('mainbox__search--top'); // left-aign search input
      document.querySelector('.mainbox__title-row').classList.add('display--hide');
      document.querySelector('.mainbox__title-row--top').classList.remove('display--hide');
      document.querySelector('.mainbox__subtitle-row').classList.add('display--hide');
      document.querySelector('.mainbox__log-row').classList.add('display--hide');
      document.querySelector('.mainbox__log-row--top').classList.remove('display--hide');
      if (logStatus === 'Log Out') {
        document.querySelector('.mainbox__login-details--top').classList.remove('display--hide');
      }
    }
  });

  // When the modal close button or the overlay is clicked, exit the modal condition
  document.querySelector('.social-login__close').addEventListener('click', () => {
    document.querySelector('.overlay').classList.add('visibility--hide');
    document.querySelector('.modal').classList.add('visibility--hide');
  });
  
  document.querySelector('.overlay').addEventListener('click', () => {
    document.querySelector('.overlay').classList.add('visibility--hide');
    document.querySelector('.modal').classList.add('visibility--hide');
  });

};


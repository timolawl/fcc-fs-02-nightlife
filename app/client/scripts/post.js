'use strict';

// socket io -- the cdnjs script is in the HTML template above this script file
var socket = io();

window.onload = function () {
  var logStatus = document.querySelector('.mainbox__log-button').textContent;

  // on submit, reveal results and unfix the display of footer
  document.querySelector('.mainbox__search').addEventListener('click', e => {
    if (e.target.classList.contains('mainbox__search--submit') && document.querySelector('.mainbox__search--input').value) { // submit button pressed with inputted content
      document.querySelector('footer').classList.remove('footer--unsearched');
      document.querySelector('.bar-list').classList.remove('visibility--hide');
    }
  });
  // when there is input, change view to have search bar at the top of the page
  document.querySelector('.mainbox__search--input').addEventListener('input', e => {
    if (e.target.value || e.target.length !== 0) {
      document.querySelector('.mainbox').classList.add('mainbox--top'); // move mainbox to top
      document.querySelector('.mainbox__search').classList.add('mainbox__search--top'); // left-aign search input
      document.querySelector('.mainbox__title-row').classList.add('display--hide');
      document.querySelector('.mainbox__title-row--top').classList.remove('display--hide');
      document.querySelector('.mainbox__subtitle-row').classList.add('display--hide');
      document.querySelector('.mainbox__log-form').classList.add('display--hide');
      document.querySelector('.mainbox__log-form--top').classList.remove('display--hide');
    }
  });

  // When log in button is pressed, unhide overlay and modal
  var logBtnArr = [];
    logBtnArr.push(document.querySelector('.mainbox__log-button'));
    logBtnArr.push(document.querySelector('.mainbox__log-button--top'));

  // if log in, make buttons open log in modal
  if (logStatus === 'Log In') {
    logBtnArr.forEach(el => el.addEventListener('click', e => {
      document.querySelector('.overlay').classList.remove('visibility--hide');
      document.querySelector('.modal').classList.remove('visibility--hide');
    }));
  }
  // else as log out, make buttons log out only
  /*
  else logBtnArr.forEach(el => el.addEventListener('click', e => {
    
  }));
  */
  

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


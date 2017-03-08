'use strict';

// socket io -- the cdnjs script is in the HTML template above this script file
var socket = io();

window.onload = function () {
  // reveal results and unfix the display of footer
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
      document.querySelector('.mainbox__titlerow').classList.add('display--hide');
      document.querySelector('.mainbox__titlerow--top').classList.remove('display--hide');
      document.querySelector('.mainbox__subcontent').classList.add('display--hide');
      document.querySelector('.mainbox__log-button--top').classList.remove('display--hide');
      /*
      Array.prototype.forEach.call(document.querySelectorAll('.mainbox__subtitle'), e => {
        e.classList.add('display--hide');
      });
      */
      // document.querySelector('.mainbox__log-button').classList.add('display--hide');
    }
  });

  // When log in button is pressed, unhide overlay and modal
  document.querySelector('.mainbox__log-button').addEventListener('click', e => {
    console.log('test');
    document.querySelector('.overlay').classList.remove('visibility--hide');
    document.querySelector('.modal').classList.remove('visibility--hide');
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


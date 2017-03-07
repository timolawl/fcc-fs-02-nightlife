'use strict';

// socket io -- the cdnjs script is in the HTML template above this script file
var socket = io();

window.onload = function () {
  document.querySelector('.mainbox__search').addEventListener('click', e => {
    if (e.target.classList.contains('mainbox__search--submit')) {
      console.log(document.querySelector('.mainbox__search--input').value);
      // on clicking the submit button, the box moves up
      // and the results appear one by one transitioning from visibility 0 to full
      // a total of 9 results -- 3 rows worth
      // what if more results from the same area are wanted?
      // multiple pages? arrow keys to go onto the next list (w/o page refresh)
      // once a letter is typed, move the input field to the top as a mainbox at the top
    }
  });
  document.querySelector('.mainbox__search--input').addEventListener('input', e => {
    if (e.target.value || e.target.length !== 0) {
      document.querySelector('.mainbox').classList.add('mainbox--top'); // move mainbox to top
      document.querySelector('.mainbox__search').classList.add('mainbox__search--top'); // left-aign search input
      document.querySelector('.mainbox__titlerow').classList.add('display--hide');
      document.querySelector('.mainbox__titlerow--top').classList.remove('display--hide');
      Array.prototype.forEach.call(document.querySelectorAll('.mainbox__subtitle'), e => {
        e.classList.add('display--hide');
      });
      document.querySelector('.mainbox__log-button').classList.add('display--hide');
    }
  });
};



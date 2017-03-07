'use strict';

// socket io -- the cdnjs script is in the HTML template above this script file
var socket = io();

window.onload = function () {
  document.querySelector('.bar__search').addEventListener('click', e => {
    if (e.target.classList.contains('bar__search--submit')) {
      console.log(document.querySelector('.bar__search--input').value);
    }
  });
};



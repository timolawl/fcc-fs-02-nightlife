'use strict';

// socket io -- the cdnjs script is in the HTML template above this script file
var socket = io();

window.onload = function () {


  var logStatus = document.querySelector('.mainbox__log-button').textContent;

  var logoBtn = document.querySelector('.bn-logo--link').addEventListener('click', e => {
    sessionStorage.removeItem('searchLocation');
    location.href = '/';
  });

  var searchInput;

  // if a search of a previous session has been completed..
  if (sessionStorage.getItem('searchLocation')) {
    searchInput = sessionStorage.getItem('searchLocation');
  }
  else searchInput = '';

  // if document referrer was the login completion,
  // and logstatus is logged in
  // populate the input field with the previous input and do a search.
  console.log('document.referrer: ' + document.referrer);
  console.log('search input: ' + searchInput);
  
  if (searchInput) {
    document.querySelector('.mainbox__search--input').value = searchInput;
    // move items to top
    toggleView(searchInput.length, false, logStatus);
        // generate results
    conductSearch(searchInput);
  }


  // show modal on clicking the log in button
  Array.prototype.forEach.call(document.querySelectorAll('.mainbox__log-button'), el => el.addEventListener('click', () => {
    if (logStatus === 'Log In') {
      document.querySelector('.overlay').classList.remove('visibility--hide');
      document.querySelector('.modal').classList.remove('display--hide');
    }
    else if (logStatus === 'Log Out') {
      sessionStorage.removeItem('searchLocation');
      // adding this because the redirect to find out that there should be nothing here is a bit slow...
      document.querySelector('.mainbox__search--input').value = '';

      
      //basically conductSearch in reverse
      document.querySelector('.bar-list').classList.add('visibility--hide');
      document.querySelector('footer').classList.add('footer--unsearched');
      if (document.querySelector('.mainbox').classList.contains('mainbox--top')) {
        toggleView(0, true, logStatus); // passing a length of 0
      }
      location.href = '/logout'; 
    }
  }));

  // on submit, reveal results and unfix the display of footer
  document.querySelector('.mainbox__search').addEventListener('click', e => {
    searchInput = document.querySelector('.mainbox__search--input').value;
    // on submit button press and with content in input box:
    if (e.target.classList.contains('mainbox__search--submit') && searchInput) { // submit button pressed with inputted content
      // emit socket
      // server side environmental variables are needed so the ajax call is better off not performed here
      conductSearch(searchInput);
    }
  });

  document.querySelector('.mainbox__search').addEventListener('keyup', e => {
    // on mainbox focus and enter key press with content in input box:
    searchInput = document.querySelector('.mainbox__search--input').value;
    var key = e.which || e.keyCode;
    if (key === 13 && searchInput) { // on enter key press
      conductSearch(searchInput);
    }
  });


  // when there is input, change view to have search bar at the top of the page
  document.querySelector('.mainbox__search--input').addEventListener('input', e => {
    // if there is content and the previous state was empty, toggle
    //if ((e.target.value || e.target.length !== 0) && previousState.length === 0) {
    
    //}
    console.log(e.target.value);
    console.log(e.target.length);
    toggleView(e.target.value.length, false, logStatus);
  });

  // When the modal close button or the overlay is clicked, exit the modal condition
  document.querySelector('.social-login__close').addEventListener('click', () => {
    document.querySelector('.overlay').classList.add('visibility--hide');
    document.querySelector('.modal').classList.add('display--hide');
  });
  
  document.querySelector('.overlay').addEventListener('click', () => {
    document.querySelector('.overlay').classList.add('visibility--hide');
    document.querySelector('.modal').classList.add('display--hide');
  });

};


function conductSearch (searchValue) {
  socket.emit('bar search', { location: searchValue });
  // store the most recent search location in sessionStorage
  sessionStorage.setItem('searchLocation', searchValue);
  console.log('session storage set: ' + sessionStorage.getItem('searchLocation'));

  document.querySelector('footer').classList.remove('footer--unsearched');
  document.querySelector('.bar-list').classList.remove('visibility--hide');

}

function toggleView (inputLength, logoutAction, logStatus) {
  // if there is content and the top display is not already displayed, then toggle
  // or if there is no content and regular display is not already displayed, then toggle
  if ((inputLength && !document.querySelector('.mainbox').classList.contains('mainbox--top')) || logoutAction) {
    document.querySelector('.mainbox').classList.toggle('mainbox--top'); // move mainbox to top
    document.querySelector('.mainbox__search').classList.toggle('mainbox__search--top'); // left-aign search input
    document.querySelector('.mainbox__title-row').classList.toggle('display--hide');
    document.querySelector('.mainbox__title-row--top').classList.toggle('display--hide');
    document.querySelector('.mainbox__subtitle-row').classList.toggle('display--hide');
    document.querySelector('.mainbox__log-row').classList.toggle('display--hide');
    document.querySelector('.mainbox__log-row--top').classList.toggle('display--hide');
    
    if (logStatus === 'Log Out') {
      document.querySelector('.mainbox__login-details--top').classList.toggle('display--hide');
    }
    
  }
}

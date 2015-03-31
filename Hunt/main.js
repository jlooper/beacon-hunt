// configure the path to the text plugin since it is not in the same directory
// as require.js
require.config({
  paths: {
    'text': 'bower_components/requirejs-text/text'
  }
}); 
define([
  'app'
], function (app) {

  // if we are running on device, listen for cordova deviceready event
  if (kendo.mobileOs) {
    
    document.addEventListener('deviceready', function () {

      navigator.splashscreen.hide();

      app.init();
      
    }, false);    
  }
  
  else {

   app.init();

  
  }

});

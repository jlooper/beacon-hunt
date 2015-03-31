define([
  'views/Host/Host',
  'views/Attend/Attend'
  
  
], function () {

  // create a global container object
  var app = window.app = window.app || {};
  
    app.formatDate = function(dateString) {
        var formattedDate = kendo.toString(new Date(dateString), 'G');
        
        return formattedDate;
    };
    app.constants = {
        NO_API_KEY_MESSAGE: '<h3>Backend Services <strong>API Key</strong> is not set.</h3><p><span>API Key</span> links the sample mobile app to a project in Telerik Backend Services.</p><p>To set the <span>API Key</span> open the <span>/scripts/config.js</span> file and replace <strong>$EVERLIVE_API_KEY$</strong> with the <span>API Key</span> of your Backend Services project.</p>',
        EMULATOR_MODE: false
    };
  
  var init = function () {

    // intialize the application
    app.instance = new kendo.mobile.Application(

      document.body, 
        { skin: 'flat', loading: "<h1>Please wait...</h1>" }
    );  

    
  };
 
  return {
    init: init
  };

});

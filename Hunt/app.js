define([
  'views/Host/Host',
  'views/Home/Home',
  'views/Connected/Connected',
  'views/Offline/Offline',
  'views/MessageBoards/MessageBoards',
  'views/Trophies/Trophies'
  
  
], function () {

    
    
  // create a global container object
  var app = window.app = window.app || {};
  
    app.formatDate = function(dateString) {
        var formattedDate = kendo.toString(new Date(dateString), 'G');
        
        return formattedDate;
    };
    app.constants = {
        NO_API_KEY_MESSAGE: '<h3>Backend Services <strong>API Key</strong> is not set.</h3>',
        EMULATOR_MODE: false,
        EL: new Everlive({
          apiKey: 'my-api-key',
          offlineStorage: true,
          url: '//api.everlive.com/v1/',
          scheme: 'https'
      })
    };
  
  var init = function () {
           
    // intialize the application
    if(!app.constants.EMULATOR_MODE){
        StatusBar.overlaysWebView(false)
    	StatusBar.backgroundColorByHexString('#000');
    	StatusBar.styleLightContent();
    }
      
     //Switch to online mode when the device connects to the network
        document.addEventListener("online", function() {
           	appConsole.clear();
            appConsole.log("Your connection is now online");
            app.constants.EL.online();   
            app.constants.EL.sync();
        });

        //Switch to offline mode when the device looses network connectivity   
        document.addEventListener("offline", function() {
            appConsole.clear();
            appConsole.log("Your connection is offline");            
            app.constants.EL.offline();
        });
      
    app.instance = new kendo.mobile.Application(

      document.body, 
        { skin: 'flat', loading: "<h1>Please wait...</h1>" }
    );  

    
  };
 
  return {
    init: init
  };

});

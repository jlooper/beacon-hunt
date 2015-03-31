define([
  'views/view',
  'text!views/Attend/Attend.html'
], function (View, html) {

  var view, navbar, body, page;
    
    var apiKey = localStorage.getItem("apiKey");
          var el = new Everlive({
          apiKey: apiKey,
          url: '//api.everlive.com/v1/',
          scheme: 'https'
      });
    

  
  var model = kendo.observable({
      
       _onDeviceIsSuccessfullyInitialized : function () {
            appConsole.log("Verifying registration...");
        },
        _onDeviceIsSuccessfullyRegistered : function () {
            appConsole.log("Yay! You can receive push notifications. Time to start hunting!");            
        },

        _onDeviceIsAlreadyRegistered : function () {
            appConsole.log("Your device is already registered in Telerik Backend Services. Updating...");
        },

        _onDeviceIsNotRegistered : function () {
        },

        _onDeviceRegistrationUpdated : function () {
            appConsole.log("Successfully updated the device registration. Time to start hunting!");
        },

        _onPushErrorOccurred : function (message) {
            appConsole.log("Error: " + message, true);
        },

        _processPushMessage : function (message, date) {
            
            /*var chime = new Media("styles/chime.wav", onSuccess, onError);
                 chime.play();*/
                        
            appConsole.log(message);
        },
    
        onAndroidPushReceived : function (e) {
            
           var message = e.message;
            var dateCreated = app.formatDate(e.payload.customData.dateCreated);
        
            model._processPushMessage(message, dateCreated);
        },
    
        onWpPushReceived : function (e) {
           if (e.type === "toast" && e.jsonContent) {
                var message = e.jsonContent["wp:Text2"];
                model._processPushMessage(message, new Date());
            }
        },

        onIosPushReceived : function (e) {
            var message = e.alert;
            var dateCreated = app.formatDate(e.dateCreated);

            model._processPushMessage(message, dateCreated);
        },

        push: function(color) {
            var PIN = localStorage.getItem("registeredHunt");
            var filter = {
              "Parameters.Hunt": PIN
            };
            var notification = {
                "Filter": JSON.stringify(filter),
                "Android": {
                    "data": {
                        "title": "Beacon found!",
                        "message": "The "+color+" beacon was found!",
                        "hunt": PIN
                    }
                },
                "IOS": {
                    "aps": {
                        "alert": "The "+color+" beacon was found!",
                        "badge": 1,
                        "sound": "default",
                        "category": PIN
                    }
                }
            }
                
            appConsole.log("Notifying members of this hunt...");
        
            el.push.notifications.create(notification, function (data) {
                appConsole.log("Notification created");
            }, function (err) {
                appConsole.log("Failed to create push notification: " + err.message, true);
            });

            
        },
        
        enablePushNotifications : function () {
            
            var devicePlatform = device.platform; // get the device platform from the Cordova Device API
            appConsole.log("Registering this device for push notifications");

            var currentDevice = el.push.currentDevice(app.constants.EMULATOR_MODE);
            
            var pushSettings = {
                android: {
                    senderID: 'XXX'
                },
                iOS: {
                    badge: "true",
                    sound: "true",
                    alert: "true"
                },
                wp8: {
                    channelName: "EverlivePushChannel"
                },
                notificationCallbackWP8: model.onWpPushReceived,
                notificationCallbackAndroid: model.onAndroidPushReceived,
                notificationCallbackIOS: model.onIosPushReceived,
            };

            var customDeviceParameters = {
                "Hunt":localStorage.getItem('registeredHunt')
            };

            currentDevice.enableNotifications(pushSettings)
                .then(
                    function (initResult) {
                        model._onDeviceIsSuccessfullyInitialized();

                        return currentDevice.getRegistration();
                    },
                    function (err) {
                        model._onPushErrorOccurred(err.message);
                    }
                    ).then(
                        function (registration) {
                           model._onDeviceIsAlreadyRegistered();

                            currentDevice
                                .updateRegistration(customDeviceParameters)
                                .then(function () {
                                    model._onDeviceRegistrationUpdated();
                                }, function (err) {
                                    model._onPushErrorOccurred(err.message);
                                });
                        },
                        function (err) {
                            if (err.code === 801) {
                                model._onDeviceIsNotRegistered();

                                currentDevice.register(customDeviceParameters)
                                    .then(function (regData) {
                                        model._onDeviceIsSuccessfullyRegistered();
                                    }, function (err) {
                                        model._onPushErrorOccurred(err.message);
                                    });
                            }
                            else {
                                model._onPushErrorOccurred(err.message);
                            }
                        }
                        );
        },
            
     registerForHunt: function(e){
         
         if (!this.myHuntPIN){
             appConsole.log("PIN number is required to join a hunt")
             return
         }
         var filter = { 
                'huntPIN': this.myHuntPIN
            };
        localStorage.setItem('registeredHunt',this.myHuntPIN);   
            var data = el.data('Hunts');
            
             data.get(filter)
             
                .then(function(data){
                 
                 if (!data.result.length) {
                      appConsole.log("Sorry, there was a problem with that hunt PIN")
                  }
                 
                 else{
                     //register for push
                     model.enablePushNotifications();
                     window.location.href = "#Beacons";       
                 }
             });
             
            
     },
     start: function () {
        $("#Ice").hide();
        $("#Blueberry").hide();
        $("#Mint").hide();
        document.getElementById('beaconlog').innerHTML = "Searching for beacons!";
        appConsole.clear();
        window.estimote.startRanging("Beacons");       
    },

    stop: function () {
        $("#Ice").hide();
        $("#Blueberry").hide();
        $("#Mint").hide();
        appConsole.clear();    
        window.estimote.stopRanging();           
    },
    claimMint: function(){
        model.push("Mint");
    },
    claimIce: function(){
       model.push("Ice");
    },
    claimBlueberry: function(){
       model.push("Blueberry");
    },
      // define a beacon callback function
    onBeaconsReceived : function(result) {
        
            if (result.beacons && result.beacons.length > 0) {
                var msg = "<b>I found " + result.beacons.length + " beacons!";
                for (var i=0; i<result.beacons.length; i++) {
                    var beacon = result.beacons[i];
                    if(beacon.distance > 0){
                        msg += "<br/>";

                        if (beacon.color !== undefined) {
                            msg += "There is a <b>" + beacon.color + "</b> beacon ";
                        }
                        

                    msg += "within " + beacon.distance + " meters of this location.<br/>";
                    
                    if (beacon.distance < 1) {
                           $("#"+beacon.color+"").show();
                           msg += "When you see it, press the button above!<br/>";

                        }
                    
                    }
                    else{
                        //msg += "...but it's too far to find. Keep hunting!<br/>";
                    }

                }

            }

            else {
                var msg = "I haven't found a beacon just yet. Let's keep looking!"
            }
    
    document.getElementById('beaconlog').innerHTML = msg;
}


});

document.addEventListener('beaconsReceived', model.onBeaconsReceived, false);

var events = {
    init: function (e) {

     
     },
     dataShow:function(e){
      
     }
  };

  // create a new view
  view = new View('Attend', html, model, events);



});



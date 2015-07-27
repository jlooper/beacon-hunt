define([
  'views/view',
  'text!views/Connected/Connected.html'
], function (View, html) {

  var view, navbar, body, page;
    
  
  
  var model = kendo.observable({
      
       _onDeviceIsSuccessfullyInitialized : function () {
            appConsole.log("Verifying registration...");
        },
        _onDeviceIsSuccessfullyRegistered : function () {
            appConsole.log("Yay! You can receive push notifications. Time to start hunting!");            
        },

        _onDeviceIsAlreadyRegistered : function () {
            appConsole.log("Your device is already registered. Updating...");
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
            var customData = {
                "hunt": PIN
            };
            var notification = {
                "Filter": JSON.stringify(filter),
                "Android": {
                    "data": {
                        "title": "Beacon found!",
                        "message": "The "+color+" beacon was found!",
                        "customData": customData
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
        
            app.constants.EL.push.notifications.create(notification, function (data) {
                appConsole.log("Notification created");
            }, function (err) {
                appConsole.log("Failed to create push notification: " + err.message, true);
            });

            
        },
        
        enablePushNotifications : function () {
            
            var devicePlatform = device.platform; // get the device platform from the Cordova Device API
            appConsole.log("Registering this device for push notifications");

            var currentDevice = app.constants.EL.push.currentDevice(app.constants.EMULATOR_MODE);
            
            var pushSettings = {
                android: {
                    senderID: '1035774783743'
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
         //check if offline
         if(navigator.network.connection.type == Connection.NONE){
                 appConsole.log("You appear to be offline. Try the Offline hunt instead!")
                 return
         }
         //verify this PIN exists
         if (!this.myHuntPIN){
             appConsole.log("PIN number is required to join a hunt")
             return
         }
         var filter = { 
                'huntPIN': this.myHuntPIN
            };
        localStorage.setItem('registeredHunt',this.myHuntPIN);   
            var data = app.constants.EL.data('Hunts');
            
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
                        //Android hack
                       if (beacon.macAddress !== undefined) { // Android
                            if (beacon.macAddress.substring(0,2) == 'F5'){
                                beacon.color = 'Ice'
                            }
                            if (beacon.macAddress.substring(0,2) == 'D1'){
                                beacon.color = 'Blueberry'
                            }
                           if (beacon.macAddress.substring(0,2) == 'C0'){
                                beacon.color = 'Mint'
                           }
                       }
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
  view = new View('Connected', html, model, events);



});



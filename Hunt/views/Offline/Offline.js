define([
  'views/view',
  'text!views/Offline/Offline.html'
], function (View, html) {

  var view, navbar, body, page;
    
 var time = 0
 
  var model = kendo.observable({
      
      claimBeacon: function(color) {
          
         
          model.stop();
          
          var data = app.constants.EL.data('BeaconsFound');
          var name = localStorage.getItem('Name');
          var uuid = localStorage.getItem('UUID');
          
          /*testing var color = "Test"
          var time = 20*/
          
          data.create({ 'Name': name, 'BeaconColor': color, 'UUID': uuid, 'Time': time },
              function(data){
                  	appConsole.log("Beacon logged!");
              		window.location.href = "#Offline";
                 },
              function(error){
                   	appConsole.log("Sorry, there was a problem logging this beacon");
              		window.location.href = "#Offline";
                 });
         
    },
      
    claimMint: function(){
       model.claimBeacon("Mint");       
    },
      
    claimIce: function(){
      model.claimBeacon("Ice");      
    },
      
    claimBlueberry: function(){
      model.claimBeacon("Blueberry");       
    },
      
    resetTimer: function(e){
          if (typeof(Timer) !== 'undefined') {
			time = 0
        	currentTime = 0 // Current time in hundredths of a second
        	$('#stopwatch').html(formatTime(currentTime));
        	Timer.clearTimer();
      		}
     },
      
   stop: function () {
        model.resetTimer();
        window.estimote.stopRanging();
        $("#Ice-Offline").hide();
        $("#Blueberry-Offline").hide();
        $("#Mint-Offline").hide();
                   
    },
    
   start:function(e){
       
      $("#Ice-Offline").hide();
        $("#Blueberry-Offline").hide();
        $("#Mint-Offline").hide();
        document.getElementById('beaconlog-Offline').innerHTML = "Searching for beacons!";
        window.estimote.startRanging("Beacons");
        window.location.href = "#Offline-Beacons";
            
       
	  
      var $stopwatch, // Stopwatch element on the page
      incrementTime = 1000, // Timer speed in milliseconds
      currentTime = 0, // Current time in hundredths of a second
      currentSecond = 0

      updateTimer = function() {
          $stopwatch.html(formatTime(currentTime));
          currentTime += incrementTime / 10;
          currentSecond = currentTime/100;
          //this will be sent to the db
          time = Math.round(currentSecond/60);
          //if this timer runs past 15 minutes, timeout
          if (currentSecond > 900){

            
              appConsole.log("Sorry, this hunt is taking too long, please try again!");
              model.resetTimer();
              window.estimote.stopRanging();
            
              window.location.href="#Home";

                if (typeof(Timer) !== 'undefined') {
                  Timer.toggle()                                      
                }
                                     
            }
         
        },
        
      init = function() {
          $stopwatch = $('#stopwatch');
          Timer = $.timer(updateTimer, incrementTime, true);
      };    
    
      $(init);     
    }
      

      
});

function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60);
    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
}
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function onBeaconsReceived(result) {
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
                           $("#"+beacon.color+"-Offline").show();                       
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
    
    document.getElementById('beaconlog-Offline').innerHTML = msg;

}
document.addEventListener('beaconsReceived', onBeaconsReceived, false);

var events = {
    dataShow: function (e) {

        function guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
        var uuid = guid();
        if(!localStorage.getItem("UUID")){
            localStorage.setItem("UUID",uuid);
        }
     
     }
  };

  // create a new view
  view = new View('Offline', html, model, events);



});



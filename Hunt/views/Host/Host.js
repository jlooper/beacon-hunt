define([
  'views/view',
  'text!views/Host/Host.html'
], function (View, html) {

  var view, navbar, body, page;
   
  var apiKey = localStorage.getItem("apiKey");
          var el = new Everlive({
          apiKey: apiKey,
          url: '//api.everlive.com/v1/',
          scheme: 'https'
      });
    
  var model = kendo.observable({
    huntPIN: localStorage.getItem("huntPIN"),
      
   
    
    createHunt: function(e){ 
        
        appConsole.clear();
        
        //it must be something
        if (!this.huntPIN){
             appConsole.log("PIN number is required to create a hunt")
             return
         }
        //it must be exactly 6 chars
        if(this.huntPIN.length != 6) {
            appConsole.log("PIN length must be exactly six characters")
            return
        }
        
        //it must be unique
        var data = el.data('Hunts');
          var filter = { 
                'huntPIN': this.huntPIN
            };
            
            var data = el.data('Hunts');
        
            var PIN = this.huntPIN
            
             data.get(filter)
             
                .then(function(data){
                 
                 
                 if (data.count != 0) {
                      appConsole.log("Sorry, that hunt PIN already exists. Please try again.")
                  }
                 
                 else{
                     
                     
                      var data = el.data('Hunts');
                         data.create({ 'huntPIN' : PIN },
                            function(data){
                             
                               localStorage.setItem("huntPIN",PIN) 
                               model.set("huntPIN",PIN)
                               appConsole.log("Success! Your hunt has been created! Now, invite attendees on the next screen.")
                               window.location.href = "#Invite";
                               
                            },
                            function(error){
                               appConsole.log("Oops, there was a problem creating this hunt. Please try again")
                            });
                 }
             });
      },
      invite : function(e){
      // check for a configured email client
          
          var PIN = localStorage.getItem("huntPIN");
          if(PIN){
             var text = "You've been invited to a hunt! Download the app and input the code "+PIN+""
   
 	           window.plugins.socialsharing.shareViaEmail (
                   text,
                   'You\'ve been invited to a hunt!',
                   null, // TO: must be null or an array
                   null, // CC: must be null or an array
                   null, // BCC: must be null or an array
                   null,
                   this.onSuccess,
                   this.onError
               );  
          }
          else{
              appConsole.log("Please create a hunt PIN before inviting your guests.")
          }
                     
        }
  
      
});

var events = {
    dataShow:function(e){
       appConsole.clear();
     }
  };

  // create a new view
  view = new View('Host', html, model, events);



});



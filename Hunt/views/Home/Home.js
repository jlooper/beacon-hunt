define([
  'views/view',
  'text!views/Home/Home.html'
], function (View, html) {

  var view, navbar, body, page;
  
  var model = kendo.observable({
      
      createName: function() {
          if(this.name == null){
              $("#msg").html("Please enter a username.");
          }
          else{
            localStorage.setItem("Name",this.name);
            $("#create-name").data("kendoMobileModalView").close();
          }
      }
      
  });


var events = {
    init: function (e) {
     	
     },
     dataShow:function(e){
         
         if(!localStorage.getItem("Name")){
             $("#create-name").data("kendoMobileModalView").open();
         } 
      
     }
  };

  // create a new view
  view = new View('Home', html, model, events);



});



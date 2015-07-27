define([
  'views/view',
  'text!views/Trophies/Trophies.html'
], function (View, html) {

  var view, navbar, body, page;
    
  

  
  var model = kendo.observable({
      
       


});


var events = {
    init: function (e) {

     
     },
     dataShow:function(e){
         
      var uuid = localStorage.getItem("UUID");
      
      var data = app.constants.EL.data('BeaconsFound');
        
         var query = new Everlive.Query();
      	 query.where().equal('UUID', uuid).done().orderDesc('CreatedAt').take(30);
         data.get(query)
          .then(function(data){

            if(data.count) {

            var dataSource = new kendo.data.DataSource({
              data: data.result
            });
            
            $("#trophies-list").kendoListView({
                dataSource: dataSource,
                template: kendo.template($("#trophies-template").html()),
                
            });
         }
         else{
          var dataSource = new kendo.data.DataSource({
            data: [ { Message: "Aw, you haven't yet found a beacon!" }]
          }
      );
    
          $("#trophies-list").kendoListView({
              dataSource: dataSource,
              template: "<h1 class='msg'>#:Message#</h1>"
            });
         }
              

        },
        
        function(error){
          alert("Sorry, there was a problem fetching data")
        });


	}
  };
 

  // create a new view
  view = new View('Trophies', html, model, events);



});



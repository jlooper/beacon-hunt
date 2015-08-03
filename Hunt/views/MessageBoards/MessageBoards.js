define([
  'views/view',
  'text!views/MessageBoards/MessageBoards.html'
], function (View, html) {

  var view, navbar, body, page;
    
  

  
  var model = kendo.observable({
      
       


});


var events = {
    dataShow:function(e){
     
      var data = app.constants.EL.data('BeaconsFound');
      
         var query = new Everlive.Query();
      	 query.orderDesc('CreatedAt').take(30);
         data.get(query)
          .then(function(data){

            if(data.count) {

            var dataSource = new kendo.data.DataSource({
              data: data.result
            });
            
            $("#messages-list").kendoListView({
                dataSource: dataSource,
                template: kendo.template($("#messages-template").html()),
                
            });
         }
         else{
          var dataSource = new kendo.data.DataSource({
            data: [ { Message: "Aw, no one has found a beacon yet!" }]
          }
      );
    
          $("#messages-list").kendoListView({
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
  view = new View('MessageBoards', html, model, events);



});



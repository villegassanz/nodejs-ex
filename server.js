var express = require('express');  
var app = express();  
var server = require('http').Server(app);  



app.use(express.static('public'));

app.get('/', function(request,response){
  response.sendFile(__dirname + '/index.html');
});


server.listen(8080, function() {  
  console.log("Servidor corriendo en http://localhost:8080");
});
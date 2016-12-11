var express = require('express');  
var app = express();  
var server = require('http').Server(app);
var io = require('socket.io')(server); 

var messages = [
	{  
    id_autobus: "1",
    rfc: "Hola! que tal?"
	}
];

app.use(express.static('public'));

app.get('/', function(request,response){
  response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {  
  console.log('Alguien se ha conectado con Sockets');
  
	socket.emit('messages', messages);
 
  socket.on('new-message', function(data) {
    messages.push(data);
    io.sockets.emit('messages', messages);

    
  });

});

server.listen(8080, function() {  
  console.log("Servidor corriendo en http://172.30.214.15:8080");
});
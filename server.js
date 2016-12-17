var express = require('express');  
var app = express();  
var server = require('http').Server(app);
var io = require('socket.io')(server); 

var puerto = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var messages = [

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
  console.log("Servidor listo en el puerto");
});


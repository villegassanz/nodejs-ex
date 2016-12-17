var express = require('express');  
var app = express();  
var server = require('http').Server(app);
var io = require('socket.io')(server); 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var db = mongoose.connect('mongodb://127.0.0.1:27017/test');
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});


var puerto = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var messages = [

];
var Modelo_Mensaje = mongoose.model('principal', MensajeSchema);

var MensajeSchema = mongoose.Schema({
    _id: String,
    rfc: String,
    ruta: String,
    ejemplo:String,
    latitud: String,
    longitud: String,
    fecha: Date,
    hora_inicio: Date,
    hora_fin: Date
});


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
 var nuevoMensaje = new Modelo_Mensaje({
          _id: data.id_autobus, //en esta parte recibimos del arreglo data los valores que ingreso el usuario
          rfc: data.rfc,
          ruta: data.ruta,
          ejemplo: data.eje,
          fecha: new Date()
      });

server.listen(8080, function() {  
  console.log("Servidor listo en el puerto");
});


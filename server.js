var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);
var mongoose = require('mongoose');


/*Establecer la conexion con mongodb*/

mongoose.connect('mongodb://localhost/base', function(error){
   if(error){
      throw error; 
   }else{
      console.log('Conectado a MongoDB');
   }
});

/*Se crea el esquema a utilizar*/

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

/*'modeloMensaje' es el nombre de la "tabla" que en realidad es una coleccion,
el segundo parametro es el nombre del esquema antes creado. Todo esto se asocia a una variable 'Modelo_Mensaje'
que podrá acceder a los metodos desde javascript para insertar y obtener de la bd
*/
var Modelo_Mensaje = mongoose.model('principal', MensajeSchema);

var messages = [

];

app.use(express.static('public'));

app.get('/', function(request,response){
  response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {  
  console.log('Alguien se ha conectado con Sockets');

/*----Este es el metodo "select * from", los datos de la base se guardan en 
 el arreglo result, este arreglo se asocia a meesages, lo mismo que haciamos
 con mysql*/

  Modelo_Mensaje.find({}, function(error,result){
      if(error){
         throw error;
      }else{
         messages=result;
         socket.emit('messages', messages);
      }
   });
  //---
 
  socket.on('new-message', function(data) {
    messages.push(data);
    io.sockets.emit('messages', messages);
/* En esta parte se crea un nuevo objeto que será agregado a la coleccion
*/
    var nuevoMensaje = new Modelo_Mensaje({
          _id: data.id_autobus, //en esta parte recibimos del arreglo data los valores que ingreso el usuario
          rfc: data.rfc,
          ruta: data.ruta,
          ejemplo: data.eje,
          fecha: new Date()
      });
    // en esta parte se guarda el objeto.
      nuevoMensaje.save(function(error, result){
         if(error){
             throw error;
         }else{
            console.log("Registro exitoso");
         }
      });
    
  });

});

server.listen(8080, function() {  
  console.log("Servidor corriendo en http://localhost:8080");
});
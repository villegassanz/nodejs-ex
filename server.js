var express = require('express');  
var app = express();  
var server = require('http').Server(app);


var mongoose = require('mongoose');
/*
 * Primero necesitamos crear nuestro
 * servidor que será un servidor http
 */
var http = require('http');
//var mongoose = require('mongoose'); // Definimos el modulo de mongoose
mongoose.connect('mongodb://admin:zIfrXnRChzVx@127.0.0.1:27017/buslocation');  

//mongoose.connect('mongodb://localhost/users');

// Definimos el Schema de la base de datos
User = new mongoose.Schema({
  _id: Number,
  name: String,
  surname: String
}, { collection : 'usersList'}); // Añadimos la colleción que vamos acceder


// Añadimos el schema al modelo
User = mongoose.model('users', User);

/*
 * Creamos el servidor y un callback
 * que contendrá una respuesta(res) y una
 * solicitud(req)
 */
function peticionServidor(req,res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
    // Buscamos todos los usuarios
    User.find(function (err, data) {
      if (err) { return console.error(err); } // Si hay un error
      if (data === null) { // Si no hay ningún usuario
        console.log('There aren\'t users in database');
      }
    // data será todos los usuarios encontrados y lo que nos devuelve
    // será un array con todos los datos, esto se puede hacer de 
    // una manera mucho más sencilla que veremos más adelante:
    res.write('id\tname\tsurname\n'
      + data[0]._id + '\t' + data[0].name + '\t' + data[0].surname + '\n'
      + data[1]._id + '\t' + data[1].name + '\t' + data[1].surname);
    res.end();
    });
}



http.createServer(peticionServidor).listen(8080, function() {
  console.log("Node server running on http://localhost:3000");
}); // Escuchamos el servidor por el puerto 3000
var app = require('express')();  
//var app = express();  
//var http = require('http').Server(app);
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;



//var mongoose = require('mongoose');
//var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 

mongoose.connect('mongodb://tecnologias:12345@172.30.239.235:27017/buslocation');  

var beacons =
[
{
	mac: '[E6:20:24:20:0A:B2]',
	estado: 0,
	ruta: 'Tule Oaxaca',
	idSocket: ''
},
{
	mac: '[D3:40:0D:7B:0B:18]',
	estado: 0,
	ruta: 'Tec Oaxaca',
	idSocket: ''
},
{
	mac: '[F2:57:6B:A5:09:DB]',
	estado: 0,
	ruta: 'DIF Oaxaca',
	idSocket: ''
}
];


io.on('connection', function(socket) {
	console.log('El usuario: ' + socket.id + ' se ha conectado.');
	socket.on('enviarCoordenadas', function(mensaje) {
		var datos = mensaje.split(',');
		console.log(socket.id + ': ' + datos[2] + ', ' + datos[3]);
		for(var i = 0; i < beacons.length; i++) {
			if(datos[5] === beacons[i].mac && beacons[i].idSocket === '') {
				beacons[i].idSocket = socket.id;
			}
			if(beacons[i].idSocket === socket.id && datos[5] === beacons[i].mac) {
				socket.broadcast.emit('recibirCoordenadas', {
					idUser: datos[0],
					userName: datos[1],
					tipoUsuario: datos[2],
					idSocket: socket.id,
					latitud: datos[3],
					longitud: datos[4],
					ruta: beacons[i].ruta
				});
			}
		}
	});
	socket.on('bluetoothApagado', function() {
		for(var i = 0; i < beacons.length; i++) {
			if(beacons[i].idSocket === socket.id) {
				beacons[i].idSocket = '';
			}
		}
		socket.broadcast.emit('bluetoothApagadoAndroid', {
			idSocket: socket.id
		});
	});
	socket.on('disconnect', function() {
		console.log('El usuario: ' + socket.id + ' se ha desconectado.');
		for(var i = 0; i < beacons.length; i++) {
			if(beacons[i].idSocket === socket.id) {
				beacons[i].idSocket = '';
			}
		}
		socket.broadcast.emit('eliminarCoordenadas', {
			idSocket: socket.id
		});
	});
});
/////////////////////////////////////////////////////
	
	var UsuarioSchema = new mongoose.Schema({
    		nombre: String,
    		tipo_cuenta: String
	}, {collection : "usuario"});


	var UsuarioModel = mongoose.model('usuario', UsuarioSchema);

	var RutaSchema = new mongoose.Schema({  
		mac: String,
    		nombre_ruta: String,
    		id_usuario: { type:  mongoose.Schema.ObjectId, ref: "usuario" } 
	}, {collection : "ruta"});

	var RutaModel = mongoose.model('ruta', RutaSchema);

	app.get('/api/user', function(req, res){
	var obj_usuario = new UsuarioModel({nombre: req.query.nombre, tipo_cuenta: req.query.cuenta});
	obj_usuario.save(function(err,doc){
			res.json(doc);	
		});
	});

	app.get('/api/users',function(req, res){
	UsuarioModel.find(function(err, usuarios){
			res.json(usuarios);
		});
	});

	app.get('/api/ruta', function(req, res){
	var ruta1 = new RutaModel({mac: req.query.mac, nombre_ruta: req.query.ruta, id_usuario: req.query.id_usuario });
	ruta1.save(function(err,doc){
			res.json(doc);	
		});
	});

	app.get("/api/ruta_usuario", function(req, res) {  
    		RutaModel.find({}, function(err, rutaa) {
        	UsuarioModel.populate(rutaa, {path: "usuario"},function(err, rutaa){
            			res.json(rutaa);
        		}); 
    		});	
	});
	
	app.get('/api/rutas',function(req, res){
	RutaModel.find(function(err, rutas){
			res.json(rutas);
		});
	});	
/*
	var AutorSchema = new mongoose.Schema({  
    		nombre: String,
    		biografia: String,
    		fecha_de_nacimiento: Date,
    		nacionalidad: String
	}, {collection : "autor"});


	var AutorModel = mongoose.model('autor', AutorSchema);

	var LibroSchema = new mongoose.Schema({  
   		titulo: String,
    		paginas: Number,
    		isbn: String,
    		autor: { type:  mongoose.Schema.ObjectId, ref: "autor" } 
	}, {collection : "libro"});

	var LibroModel = mongoose.model('libro', LibroSchema);

	app.get('/api/author', function(req, res){
	var obj_autor = new AutorModel({autorId: req.query.id, nombre: req.query.nombre, biografia: req.query.biografia});
	obj_autor.save(function(err,doc){
			res.json(doc);	
		});
	});

	app.get('/api/authors',function(req, res){
	AutorModel.find(function(err, sites){
			res.json(sites);
		});
	});

	app.get('/api/book', function(req, res){
	var book1 = new LibroModel({nombre: req.query.titulo, paginas: req.query.paginas, autor: req.query.id_autor });
	book1.save(function(err,doc){
			res.json(doc);	
		});
	});

	app.get("/api/bookauthor", function(req, res) {  
    		LibroModel.find({}, function(err, libros) {
        	AutorModel.populate(libros, {path: "autor"},function(err, libros){
            			res.json(libros);
        		}); 
    		});	
	});
	
	app.get('/api/books',function(req, res){
	LibroModel.find(function(err, sites){
			res.json(sites);
		});
	});
*/

//app.listen(port, ip);


http.listen(8080, function() {  
  console.log("Servidor corriendo en http://localhost:8080");
});
/*
http.listen(port, ip, function() {
	console.log('Servidor listo en ' + ip + ':' + port + '...');
});
*/

var express = require('express');  
var app = express();  
var server = require('http').Server(app);


var mongoose = require('mongoose');

mongoose.connect('mongodb://villegas:12345@172.30.202.200:27017/buslocation');  

	var UsuarioSchema = new mongoose.Schema({
		_id: String,
		nombre : String,
		latitud : String,
		longitud : String,
		created : {type : Date, default: Date.now}
	}, {collection : "usuario"});

	var UsuarioModel = mongoose.model('usuario', UsuarioSchema);

	var WebSiteSchema = new mongoose.Schema({
		name: String,
		created : {type : Date, default: Date.now}
	}, {collection : "website"});

	var WebSiteModel = mongoose.model('WebSite', WebSiteSchema);

app.use(express.static('public'));

app.get('/', function(request,response){
  response.sendFile(__dirname + '/index.html');
});

app.get('/api/usuario', function(req, res){
	var user = new UsuarioModel({_id : req.query.id, nombre: req.query.name });
	user.save(function(err,doc){
		res.json(doc);	
	});
});

app.get('/api/website/:name', function(req, res){
	var website = new WebSiteModel({name : req.params.name });
	website.save(function(err,doc){
		res.json(doc);	
	});
});

app.get('/api/usuarios',function(req, res){
	UsuarioModel.find(function(err, sites){
		res.json(sites);
	});
});

app.get('/api/website',function(req, res){
	WebSiteModel.find(function(err, sites){
		res.json(sites);
	});
});

app.get('/process', function(req, res){
	res.json(process.env);
});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);


server.listen(8080, function() {  
  console.log("Servidor corriendo en http://localhost:8080");
});

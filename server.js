var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

//
user = [];
connections=[];
 


app.get('/', function (req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello! This is demo chat socket on openshift \n");
});
//
app.get('/', function(request,response){
  response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s socket connected', connections.length);
	
	//desconected
	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket),1);
		console.log('Deconnected: %s socket connected', connections/length);
	});
	//enviar mensaje
	socket.on('send message', function(data){
		//console.log(data);
		io.socket.emit('new message', {msg: data});
	});
	
});	
//

io.on("connection", function (socket){
    socket.on("CHAT", function(data){
        io.emit("CHAT", {message: data.message});
    });
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
//
console.log('Servet running ');
//
var ip = process.env.OPENSHIFT_NODEJS_IP;

http.listen(port, ip, function(){
    console.log("demo start success");
})
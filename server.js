var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);


app.get('/', function (req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello! This is demo chat socket on openshift \n");
});

io.on("connection", function (socket){
    socket.on("CHAT", function(data){
        io.emit("CHAT", {message: data.message});
    });
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP;

http.listen(port, ip, function(){
    console.log("demo start success!!!!!!!!!");
})
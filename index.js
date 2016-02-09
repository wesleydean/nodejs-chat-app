var app = require('express')(); //initialize the app
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket){
	// console.log('user connected');
	// socket.on('disconnect', function(){
	// 	console.log('user disconnected');
	// });

	socket.on('chat message', function(msg){
		io.emit('chat message', msg); //going to send a msg to everyone including the sender
		// console.log('message: ' + msg);
	});
});

http.listen(3000, function(){
	console.log('listening on*: port 3000');
}); //make the server listen on port 3000


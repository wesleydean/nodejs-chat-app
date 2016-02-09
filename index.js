var app = require('express')(); //initialize the app
var http = require('http').Server(app); //supply app (function handler) to http server
var io = require('socket.io')(http);
// var users = io.socket.clients()

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
	// res.send('<h1>Whatever the weather</h1>');
});

io.on('connection', function(socket){
	socket.broadcast.emit('user connected');
	// console.log('user connected');
	var usernames = io.sockets.sockets;
	console.log(usernames);
	// socket.set('nickname','Guest');

	for (var socketId in io.sockets.sockets){
		console.log(io.sockets.sockets[socketId]);
	}

	socket.on('disconnect', function(){
		console.log('user disconnected');
		console.log(socket.id + ' disconnected');
	});

	socket.on('chat message', function(msg){
		io.emit('chat message', msg); 
		//going to send a msg to everyone including the sender
		//io.emit('some event', { for: 'everyone' });

		console.log('message: ' + msg);
	});
	// console.log(Socket.server.Server.clients);

	
});

http.listen(3000, function(){
	console.log('listening on*: port 3000');
	// console.log('hello world');
}); //make the server listen on port 3000



// create usernames as an option
//show list of users

// create chatrooms, with option to create a chatroom
// upload images

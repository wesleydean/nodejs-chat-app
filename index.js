/*
Broadcast a message to connected users when someone connects or disconnects
Add support for nicknames/avatars 
- add initial form that sets a name for this user
- emit 'username + logged in' on connect
Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
Add “{user} is typing” functionality
Show who’s online
- get users for global '/' namespace
Add private messaging
- when user in list is clicked on, create a chatroom that receives messages from only that user in a new window/tab
*/


var app = require('express')(); //initialize the app
var http = require('http').Server(app); //supply app (function handler) to http server
var io = require('socket.io')(http);
var cfg = require('./package.json');
var nsp = io.of('/');
var userData = [], userNames = [];
var theLastUser = '';

// if(jsonData.hasOwnProperty('username')){
// 	console.log(
// 			 JSON.stringify(jsonData.username)
// 		);
// }

function createJSON(jsonArray,userid,usercolor,username) {

    var user = {};
    user["userID"] = userid;
    user["userColor"] = usercolor;
    user["userName"] = username;
    jsonArray.push(user);
    
}

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
	// res.send('<h1>Whatever the weather</h1>');

	if(req.url.indexOf('.css') != -1){ 
		//req.url has the pathname, check if it conatins '.css'

	  	app.readFile(__dirname + '/styles/style.css', function (err, data) {
		    if (err) console.log(err);
		    res.writeHead(200, {'Content-Type': 'text/css'});
		    res.write(data);
		    res.end();
	  	});
    }

});

io.on('connection', function(socket){



	var currentTime = new Date();
	hour = currentTime.getHours();
	min  = currentTime.getMinutes();
	day = currentTime.toDateString('dd:MM');
	console.log("current Time is " + day + ", " + hour + ":" + min);

	color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

    // create a register user handler
    // add to users array

	socket.on('register user', function(data){
		// io.emit('message', { message: 'welcome to the chat', username:'ChatBot' });
		
		io.emit('status update', {status:"online", userID:socket.id.substr(2), name:data.username});

		createJSON(userData,socket.id,color,data.username);

		// keep track of unread user messages for new message log, use unique array for each convo
		// use class of visible and maybe new length of array or similar to determine this
		io.emit('user object', userData);

		// console.log("your user object:" + Object.keys(users[socket.id]));
		userNames.push(data.username);
		// io.emit('user list', userNames);
		console.log("users logged in: " + userNames);
		// console.log(Object.keys(users).length + " users online");
		
		
		// if(users[socket.id]){
		// 	io.emit('status update', users[socket.id].name + ' connected');
		// }
		
	});

	socket.on('typing', function(data){
		data.userid = socket.id;
		io.emit('type notify', {notify:data.notify, notifyID:data.userid});
		console.log(data.notify + " is typing...");
	});


    socket.on('send', function (data) {
        io.emit('user match', {matchUser:matchUser(data.username, theLastUser)});
    	io.emit('message', data);
    });


    // function to compare users to create consistent messaging layout
    function matchUser(newUser, lastUser){
    	
    	if(lastUser != newUser){
    		theLastUser = newUser;
    		console.log("new user: "+ newUser +" last user:"+ lastUser);
    		return false
    	} else {
		 	console.log("new user: "+ newUser +" last user:"+ lastUser);
    		return true
    	}
    }

	socket.on('disconnect', function(data){
		io.emit('status update', {status:"offline", userID:socket.id.substr(2)});

		for(var i=0;i<userData.length;i++){
			var userid = userData[i].userID;
			// var username = userData[i].userName;

			if(userid == socket.id){
				userData.splice(i,1);
				// userNames.splice(i,1);
			} 
		}
		console.log("users logged in: " + userData.length);
		
		// if(i != -1) {
		// 	userData.splice(i, 1);
		// }
		io.emit('user object', userData);

		// // find user and remove from list
		// delete users[socket.id];
		// console.log(Object.keys(users).length + " users online");

	});

});

http.listen(3000, function(){
	console.log('listening on*: port 3000');
}); //make the server listen on port 3000


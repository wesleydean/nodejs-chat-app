var mysql = require("mysql");

var connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"root"
});

connection.connect(function(err){
	if(err){
		console.log('error connecting to database');
		return;
	}
	console.log('db connection established');
})

connection.end(function(err){
	//connection terminated gracefully
});
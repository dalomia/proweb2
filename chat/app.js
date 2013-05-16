var express = require('express'), http = require('http'), path = require('path');

var app = express();
app.configure(function() {
	app.set('port', process.env.PORT || 8124);
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});
app.get('/', function(req, res) {
	res.send('hello');
});

//var port  = process.env.PORT || 5000;
//var server = app.listen(port);

app.configure('development', function() {
	app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io').listen(server);
io.configure(function() {
	//io.set("transports", ["xhr-polling"]);
	//io.set("polling duration", 1);
});

io.sockets.on('connection', function(socket) {

	socket.on('addme', function(username) {
		socket.username = username;
		socket.emit('chat', 'SERVER', 'You have connected');
		socket.broadcast.emit('chat', 'SERVER', username + ' is on deck');
	});

	socket.on('sendchat', function(data) {
		io.sockets.emit('chat', socket.username, data);
	});

	socket.on('disconnect', function() {
		io.sockets.emit('chat', 'SERVER', socket.username + ' has left the building');
	});

});


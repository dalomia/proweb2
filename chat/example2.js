var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8124);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
io.sockets.on('connection', function (socket) {
   socket.counter = 1;
   socket.emit('news', { news: 'Counting...' });

   socket.on('echo', function (data) {
      if (socket.counter <= 50) {
         data.back+=socket.counter;
         socket.counter++;
         socket.emit('news', {news: data.back});
      }
   });
});

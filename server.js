var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('main.html');
  //res.sendfile('main.css');
});

app.get('/panel', function(req, res){
  res.sendfile('panel.html');
});


io.on('connection', function(socket){
  console.log('User Connected.');
  socket.on('disconnect', function(){
    console.log('User Disconnected');
    socket.on('chat message', function(msg){
      //console.log('Message: ' + msg);
      io.emit('chat message', msg);
  });
  
  });
});

http.listen(3000, function(){
  console.log('Listening on port 3000...');
});
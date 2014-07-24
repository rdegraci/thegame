
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var users = {}

function createUser() {
  return {
    x: 50,
    y: 50,
    direction: 0,
    keys: {
      forward: false,
      rotate: false
    }
  }
}

io.on('connection', function (socket) {
  users[socket.id] = createUser()

  socket.on('key

  // remove user and tell everyone the user is gone
  socket.on('disconnect', function() {
    delete users[socket.id]
    socket.broadcast.emit('remove_user', { id: socket.id })
  })
})

setInterval(function() {
  for (var i in users) {
    var user = users[i]
    user.x = Math.cos(user.direction*Math.PI/180)
    user.y = Math.sin(user.direction*Math.PI/180)
  }
}, 100)

setInterval(function() {
  io.sockets.emit('update', users)
}, 500)





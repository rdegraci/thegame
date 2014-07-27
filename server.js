
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var Game = require('./public/game')

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));


var game = new Game(100)

io.on('connection', function (socket) {
  for (var i in game.users) {
    socket.emit('newUser', { id: i, player: game.users[i] })
  }

  var me = game.createUser(socket.id, {})

  me.on('change', function() {
    socket.broadcast.emit('user_change', me)
  })

  socket.emit('me', { id: socket.id, me: me })
  socket.broadcast.emit('newUser', { id: socket.id, player: me })

  socket.on('keypress', function(key) {
    me.move(key)
    console.log(socket.id, key, me.x, me.y)
  })

  // remove user and tell everyone the user is gone
  socket.on('disconnect', function() {
    game.removeUser(socket.id)
    socket.broadcast.emit('remove_user', { id: socket.id })
  })
})

// Game Update Interval
setInterval(function() {
  console.log(Object.keys(game.users))
  io.sockets.emit('update', game.users)
}, 500)


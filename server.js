
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));


// var troll = prompt("You're walking through the forest, minding your own business, and you run into a troll! Do you FIGHT him, PAY him, or RUN?").toUpperCase();

// function usergo(action) {
//   switch(troll) {
//     case 'FIGHT':
//       var strong = prompt("How courageous! Are you strong (YES or NO)?").toUpperCase();
//       var smart = prompt("Are you smart?").toUpperCase();
//       if(strong === 'YES' || smart === 'YES') {
//         console.log("You only need one of the two! You beat the troll--nice work!");
//       } else {
//         console.log("You're not strong OR smart? Well, if you were smarter, you probably wouldn't have tried to fight a troll. You lose!");
//       }
//       break;
//     case 'PAY':
//       var money = prompt("All right, we'll pay the troll. Do you have any money (YES or NO)?").toUpperCase();
//       var dollars = prompt("Is your money in Troll Dollars?").toUpperCase();
//       if(money === 'YES' && dollars === 'YES') {
//         console.log("Great! You pay the troll and continue on your merry way.");
//       } else {
//         console.log("Dang! This troll only takes Troll Dollars. You get whomped!");
//       }
//       break;
//     case 'RUN':
//       var fast = prompt("Let's book it! Are you fast (YES or NO)?").toUpperCase();
//       var headStart = prompt("Did you get a head start?").toUpperCase();
//       if(fast === 'YES' || headStart === 'YES') {
//         console.log("You got away--barely! You live to stroll through the forest another day.");
//       } else {
//         console.log("You're not fast and you didn't get a head start? You never had a chance! The troll eats you.");
//       }
//       break;
//     default:
//       console.log("I didn't understand your choice. Hit Run and try again, this time picking FIGHT, PAY, or RUN!");
//   }
// }



var users = {}

function createUser() {
  return {
    x: 50,
    y: 50,
    direction: 0,
    keys: {
      forward: false,
      rotate: false
    },
    state: ''
  }
}

io.on('connection', function (socket) {
  users[socket.id] = createUser()

  socket.on('keydown', function(key) {
    users.keys[key] = true
  })

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





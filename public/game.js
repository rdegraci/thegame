function on(event_type, cb) {
  if (typeof this.events[event_type] == "undefined") this.events[event_type] = []
  this.events[event_type].push(cb)
}

function emit(event_type, data) {
  if (typeof this.events[event_type] == "undefined") this.events[event_type] = []
  for (var i=0; i<this.events[event_type].length; i++) {
    this.events[event_type][i].call(this,data)
  }
}

function Game(interval) {
  this.users = {}
  this.events = {
    render: [],
    render_user: []
  }
  var self = this

  setInterval(function() {
    self.emit('step')
    self.loop()
  }, 100)
}

Game.prototype.loop = function() {
  for (var i in this.users) {
    var user = this.users[i]
  }

  for (var i in this.users) {
    for (var j = this.events['render_user'].length - 1; j >= 0; j--) {
      this.events['render_user'][j](this.users[i])
    }
  }
  for (var i = this.events['render'].length - 1; i >= 0; i--) {
    this.events['render'][i](this)
  }
}

Game.prototype.createUser = function(id, data) {
  data.id = id
  var user = new User(data)
  var self = this
  this.users[id] = user
  user.on('change', function() {
    self.loop()
  })
  this.emit('user_created', user)
  return user
}

Game.prototype.removeUser = function(id) {
  delete this.users[id]
  this.emit('user_removed', id)
}

Game.prototype.on = on
Game.prototype.emit = emit



function User(data) {
  this.events = {}
  this.id = data.id
  this.x = data.x || 50
  this.y = data.y || 50
  this.step = 10
}

User.prototype.update = function(u) {
  this.x = u.x
  this.y = u.y
  this.emit('user_change', this)
}

User.prototype.move = function(key) {
  if (key == 'up') {
    this.y -= this.step
  } else if (key == 'down') { 
    this.y += this.step
  } else if (key == 'right') { 
    this.x += this.step
  } else if (key == 'left') { 
    this.x -= this.step
  }
  this.emit('change')
}

User.prototype.on = on
User.prototype.emit = emit




if (typeof module != "undefined") module.exports = Game



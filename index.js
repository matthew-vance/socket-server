var http = require('http').Server();
var io = require('socket.io')(http);

var room;

io.on('connection', function(socket){
  console.log('A user connected!');
  socket.emit('connected', 'A user connected!');

  socket.on('disconnect', function(){
    console.log('A user disconnected!');
  });

  socket.on('join', ({companyId, username}) => {
    socket.join(companyId);
    room = companyId;
    io.to(room).emit('joined', username + ' joined room ' + companyId + '!');
    console.log(username + ' joined room ' + companyId + '!');
  })

  socket.on('wizard opened', () => {
    console.log('Wizard opened!');
    io.to(room).emit('wizard opened', 'Wizard opened!');
  })

  socket.on('wizard next', () => {
    console.log('Next button clicked!');
    socket.broadcast.to(room).emit('wizard next');
  })

  socket.on('wizard back', () => {
    console.log('Back button clicked!');
    socket.broadcast.to(room).emit('wizard back');
  })

  socket.on('change', (body) => {
    console.log('change received for event ' + body.event + ' with payload ' + body.payload);
    socket.broadcast.to(room).emit(body.event, body.payload);
  })
});

http.listen(8080, function () {
  console.log('listening on *:8080');
});
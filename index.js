const express = require('express');
const app = express();
const path = require('path');
const SocketIo = require('socket.io');

//SETTINGS:
//________________________________________________________________________________________________________
app.set('port', process.env.PORT || 3000);

//STATIC FILES:
//________________________________________________________________________________________________________
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));

//START SERVER:
//________________________________________________________________________________________________________
const server = app.listen(app.get('port'), () => {
    console.log('Server started on port: ', app.get('port'));
});
const io = SocketIo(server);

io.on('connection', (socket) => {
    console.log('Client connected!', socket.id);
    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data);
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing', data);
    })
})
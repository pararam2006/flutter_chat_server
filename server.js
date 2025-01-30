const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('first', () => {
        console.log('First button pressed');
        io.emit('response', 'First button was pressed');
    });

    socket.on('second', () => {
        console.log('Second button pressed');
        io.emit('response', 'Second button was pressed');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// io.on('connection', (socket) => {
//     console.log('Пользователь присоединился');

//     socket.on('first', () => {
//         console.log('First button pressed');
//         io.emit('response', 'First button was pressed');
//     });

//     socket.on('second', () => {
//         console.log('Second button pressed');
//         io.emit('response', 'Second button was pressed');
//     });

//     socket.on('disconnect', () => {
//         console.log('Пользователь отсоединился');
//     });
// });

// server.listen(3000, () => {
//     console.log('Server is running on https://flutter-chat-server-q7ne.onrender.com:3000');
// });

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('first', () => {
        console.log('first')
        io.emit('response', 'first button was pressed')
    })

    socket.on('second', () => {
        console.log('second')
        io.emit('response', 'second button was pressed')
    })

    socket.on('disconnect', () => {
        console.log('Пользователь отсоединился')
    })
})

server.listen(PORT, () => {console.log(`Сервер работает на https://flutter-chat-server-q7ne.onrender.com:${PORT}`)})
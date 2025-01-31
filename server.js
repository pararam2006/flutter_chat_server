const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('first', () => {
        console.log('first')
        io.emit('response', 'first button was pressed')
    })

    socket.on('second', (data) => {
        console.log('second')
        console.log(`data: ${data}`)
        io.emit('response', 'second button was pressed')
    })

    socket.on('disconnect', () => {
        console.log('Пользователь отсоединился')
    })
})

server.listen(PORT, () => {console.log(`Сервер работает на https://flutter-chat-server-q7ne.onrender.com:${PORT}`)})
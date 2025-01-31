const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Пользователь присоединился')

    socket.on('first', () => {
        console.log('first')
        io.emit('response', 'Нажата первая кнопка')
    })

    socket.on('second', () => {
        console.log('second')
        // console.log(`second, data: ${data}`)
        io.emit('response', 'Нажата вторая кнопка')
    })

    socket.on('disconnect', () => {
        console.log('Пользователь отсоединился')
    })
})

server.listen(PORT, () => {console.log(`Сервер работает на https://flutter-chat-server-q7ne.onrender.com:${PORT}`)})
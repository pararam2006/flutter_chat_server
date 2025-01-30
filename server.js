const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Разрешить все источники (для разработки)
        methods: ["GET", "POST"]
    }
});

app.use(cors());

let users = []; // Массив для хранения пользователей
let messages = []; // Массив для хранения сообщений

// Загрузка пользователей из файла
function loadUsers() {
    if (fs.existsSync('users.json')) {
        const data = fs.readFileSync('users.json');
        users = JSON.parse(data);
    }
}

// Сохранение пользователей в файл
function saveUsers() {
    fs.writeFileSync('users.json', JSON.stringify(users));
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('register', (user) => {
        users.push(user);
        saveUsers();
        socket.emit('registration_success', user);
        console.log(`User registered: ${JSON.stringify(user)}`);
    });

    socket.on('login', (user) => {
        const foundUser = users.find(u => u.email === user.email && u.password === user.password);
        if (foundUser) {
            socket.emit('login_success', foundUser);
            socket.emit('chat_history', messages); // Отправка истории сообщений
        } else {
            socket.emit('login_failed', 'Invalid credentials');
        }
    });

    socket.on('chat_message', (msg) => {
        messages.push(msg); // Добавление сообщения в историю
        io.emit('chat_message', msg); // отправка сообщения всем клиентам
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

loadUsers(); // Загрузка пользователей при старте сервера

server.listen(3000, () => {
    console.log('listening on *:3000');
});

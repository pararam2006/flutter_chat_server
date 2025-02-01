const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const PORT = 3000;
const app = express();
const fs = require('fs');
const path = require('path');
const server = http.createServer(app);
const io = socketIo(server);
// const jsonParser = express.json();

io.on('connection', (socket) => {
    
    socket.on('registerUser', (request, response) => {
        const user = request.body;
    
        // Путь к файлу users.json
        const filePath = path.join(__dirname, 'users.json');
    
        // Чтение файла users.json
        fs.readFileSync(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка чтения файла:', err);
                response.status(500).send('Ошибка сервера');
                return;
            }
    
            // Парсинг JSON-данных
            let usersData;
            try {
                usersData = JSON.parse(data);
            } catch (parseError) {
                console.error('Ошибка парсинга JSON:', parseError);
                response.status(500).send('Ошибка сервера');
                return;
            }
    
            // Проверка на уникальность пользователя
            const existingUser = usersData.users.find(u => u.userName === user.userName);
            if (existingUser) {
                response.status(400).send('Пользователь с таким именем уже существует');
                return;
            }
    
            // Добавление нового пользователя
            usersData.users.push(user);
    
            // Запись обновлённых данных обратно в файл
            fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Ошибка записи файла:', writeErr);
                    response.status(500).send('Ошибка сервера');
                    return;
                }
    
                console.log(`Пользователь ${user.userName} с паролем ${user.password} и почтой ${user.email} зарегистрирован`);
                response.status(200).send('Регистрация успешна');
            });
        });
    });

    console.log('Пользователь присоединился');

    socket.on('first', () => {
        console.log('first');
        io.emit('response', 'Нажата первая кнопка');
    });

    socket.on('second', () => {
        console.log('second');
        io.emit('response', 'Нажата вторая кнопка');
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отсоединился');
    });
})

server.listen(PORT, () => {console.log(`Сервер работает на https://flutter-chat-server-q7ne.onrender.com:${PORT}`)});
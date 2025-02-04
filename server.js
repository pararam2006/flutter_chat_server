const fs = require('fs');
const path = require('path');
const { Socket } = require('dgram');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const server = http.createServer(express());
const io = socketIo(server);

function addUserToFile(user) {
    const filePath = path.join(__dirname, 'users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла:', err);
            return;
        }

        let usersData;
        try {
            usersData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Ошибка при парсинге JSON:', parseErr);
            return;
        }

        const userExists = usersData.users.some(existingUser => existingUser.userName === user.userName);
        if (userExists) {
            console.log(`Пользователь ${user.userName} уже зарегистрирован`);
            return;
        }

        usersData.users.push(user);

        fs.writeFile(filePath, JSON.stringify(usersData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Ошибка при записи в файл:', writeErr);
                return;
            }
            console.log(`Пользователь ${user.userName} успешно зарегистрирован и записан в файл`);
        });
    });
}

io.on('connection', (socket) => {
    console.log('Пользователь присоединился');

    socket.on('registerUser', (user) => {
        console.log('Registering user:', user);
        addUserToFile(user);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отсоединился');
    });
});

server.listen(() => {
    console.log('Сервер работает на https://flutter-chat-server-q7ne.onrender.com');
});
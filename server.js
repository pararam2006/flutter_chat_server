const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('./flutter-sockets-firebase-adminsdk-fbsvc-67d88f4a99.json');

console.log('Initializing Firebase with service account:', serviceAccount);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const { Socket } = require('dgram');
const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const socketIo = require('socket.io');
const server = http.createServer(express());
const io = socketIo(server);
const PORT = 3000;

io.on('connection', (socket) => {
    
    socket.on('registerUser', async (user) => {
        try {
            console.log('Registering user:', user);
            const userDoc = await db.collection('users').doc(user.userName).get();
    
            if (userDoc.exists) {
                const errMsg = `Пользователь ${user.userName} уже зарегистрирован`;
                io.emit('err', errMsg);
                console.log(errMsg);
                return;
            }
    
            await db.collection('users').doc(user.userName).set({
                email: user.email,
                password: user.password             
            });
            console.log(`Пользователь ${user.userName} зарегистрирован`);
        } 
        catch(err) {
            const errMsg = `Ошибка при регистрации: ${err}`;
            io.emit('err', errMsg);
            console.log(errMsg);
        }
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
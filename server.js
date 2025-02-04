const { initializeApp, applicationDefault, cert } = import('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = import('firebase-admin/firestore');
var admin = require("firebase-admin");
const serviceAccount = require('');

console.log('Initializing Firebase with service account:', serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount )
});

const db = getFirestore();
const { Socket } = require('dgram');
const http = require('http');
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const server = http.createServer(express());
const io = socketIo(server);
const PORT = 3000;
const docRef = db.collection('test').doc('testDoc');
await docRef.set({ test: 'test' });
console.log('Document written');

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

    socket.on('first', async () => {
        console.log('first');
        try {
            const docRef = db.collection('test').doc('testDoc');
            await docRef.set({ test: 'test' });
            console.log('Запись без регистрации работает');
        } 
        catch (err){
            console.log(`Ошибка при записи данных: ${err}`)
        }
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
process.env.GOOGLE_APPLICATION_CREDENTIALS = './flutter-sockets-firebase-adminsdk-fbsvc-47cb93817a.json'
const admin = require('firebase-admin');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./flutter-sockets-firebase-adminsdk-fbsvc-47cb93817a.json');

console.log('Initializing Firebase with service account:', serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
    // credential: applicationDefault()
});

const db = getFirestore();
const { Socket } = require('dgram');
const http = require('http');
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const server = http.createServer(express());
const io = socketIo(server);

const ntpClient = require('ntp-client');

ntpClient.getNetworkTime("pool.ntp.org", 123, (err, date) => {
    if (err) {
        console.error("Ошибка при синхронизации времени:", err);
        return;
    }
    console.log("Текущее время (синхронизировано с NTP):", date);
});

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

server.listen(3000, () => {console.log(`Сервер работает на https://flutter-chat-server-q7ne.onrender.com`)});
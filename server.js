const fs = require('fs')
const path = require('path')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const mysql = require('mysql2/promise') 
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const PORT = 10000

const dbConfig = {
    host: 'sql.freedb.tech',
    port: 3306,
    user: 'freedb_bebebe',
    password: '4Fn#Wz3PV8XCG**',
    database: 'freedb_flutter-chat-db' 
}

async function addUserToDatabase(user) {
    const connection = await mysql.createConnection(dbConfig)
    try {
        const [rows] = await connection.execute('select * from users where userName = ?', [user.userName])
        if (rows.length > 0) {
            console.log(`Пользователь ${user.userName} уже зарегистрирован.`)
            return
        }

        await connection.execute('insert into users (userName, email, password) VALUES (?, ?, ?)', 
            [user.userName, user.email, user.password])
        console.log(`Пользователь ${user.userName} успешно зарегистрирован.`)
    } catch (error) {
        console.error('Ошибка при работе с базой данных:', error)
    } finally {
        await connection.end() 
    }
}

io.on('connection', (socket) => {
    console.log('Пользователь присоединился')

    socket.on('registerUser', async (user) => {
        console.log('Регистрация пользователя:', user)
        await addUserToDatabase(user) 
    })

    socket.on('disconnect', () => {
        console.log('Пользователь отсоединился')
    })
})

server.listen(PORT, () => {
    console.log(`Сервер работает на https://flutter-chat-server-q7ne.onrender.com:${PORT}`)
})
const path = require('path')
const http = require('http');
const express = require('express')
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server)

app.use('/public', express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const users = {}

io.on('connection', async (socket) => {
    await socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        // console.log("New user Joined,", name);
        socket.broadcast.emit('user-joined', name);
    })

    await socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
    await socket.on('send', (msg) => {

        socket.broadcast.emit('receive', { message: msg, name: users[socket.id] });
        // io.emit('receive', { message: msg, name: users[socket.id] });
    });
})

const port = 3000
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const botName = 'sChat Bot';
const app = express();
const server = http.createServer(app);
const io = socketio(server);
//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection', socket =>{
    console.log('new socket connected!');
    //current user(single)
    socket.emit('message',formatMessage(botName,"welcome to sChat"));

    //broadcast when a user connect(all user)
    socket.broadcast.emit('message',formatMessage(botName,'A user join sChat'));

    //runs when client disconnects
    socket.on('disconnect', ()=>{
        io.emit('message', formatMessage(botName,'A user has left the sChat'));
    });
    //listing for chatMessage from client
    socket.on('chatMessage', msg=>{
        console.log(msg);
        io.emit('message',formatMessage('USER', msg));
    })
})


const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
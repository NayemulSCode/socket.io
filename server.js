const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/user');
const botName = 'sChat Bot';
const app = express();
const server = http.createServer(app);
const io = socketio(server);
//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection', socket =>{
    console.log('new socket connected!');
    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        //current user(single)
        socket.emit('message',formatMessage(botName,"welcome to sChat"));

        //broadcast when a user connect(all user)
        socket.broadcast
        .to(user.room)
        .emit('message',formatMessage(botName,`${user.username} join sChat`));

    });
   
    //listing for chatMessage from client
    socket.on('chatMessage', msg=>{
        const user = getCurrentUser(socket.id);
        console.log(msg);
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });
     //runs when client disconnects
     socket.on('disconnect', ()=>{
         const user = userLeave(socket.id);
         if(user){
            io.to(user.room).emit(
                'message', 
                formatMessage(botName,`${user.username} has left the sChat`)
            );
            //send users and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });
         }
        
    });
})


const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
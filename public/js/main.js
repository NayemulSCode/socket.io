const socket = io();
//
const chatForm = document.getElementById('chat-form')
socket.on('message', message=>{
    console.log(message);
});

//message submit
chatForm.addEventListener('submit', e=>{
    e.preventDefault();
    //get message text from input box
    const msg = e.target.elements.msg.value;
    console.log(msg);

    //emit message to server
    socket.emit('chatMessage', msg);
})
const socket = io();
//
const chatForm = document.getElementById('chat-form');

//message from server
socket.on('message', message=>{
    console.log(message);
    outputMessage(message);
});

//message submit
chatForm.addEventListener('submit', e=>{
    e.preventDefault();
    //get message text from input box
    const msg = e.target.elements.msg.value;
    console.log(msg);

    //emit message to server
    socket.emit('chatMessage', msg);
});
//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
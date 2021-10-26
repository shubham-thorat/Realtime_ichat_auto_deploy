var socket = io();
const messagecontainer = document.querySelector(".messageArea")
var form = document.getElementById('form');
var input = document.getElementById('input');
var audio = new Audio('ringtone.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messagecontainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}


form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        append(`You : ${input.value}`, 'right')
        socket.emit('send', input.value);
        input.value = '';
    }
});

var Name = undefined;
while (Name == undefined) {
    Name = prompt("Enter your name to join");
    if (Name !== undefined) {
        append(`You joined the chat`, 'left')
    }
}



socket.emit('new-user-joined', Name)

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

socket.on('receive', ({ message, name }) => {
    append(`${name} : ${message}`, 'left')
})


socket.on('left', (data) => {
    append(`${data} left the chat`, 'right')
})
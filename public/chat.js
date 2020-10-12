const socket = io();

//DOM elements:
let message = document.getElementById('message');
let username = document.getElementById('userName');
let btn = document.getElementById('send');
let outputs = document.getElementById('outputs');
let actions = document.getElementById('actions');

btn.addEventListener('click', () => {
    socket.emit('chat:message', {
        username: username.value, 
        message: message.value
    });
});

message.addEventListener('keypress', () => {
    socket.emit('chat:typing', username.value);
});

//Este evento aunque tiene el mismo nombre del evento usado para transmitir, es un proceso distinto, ya que uno está emitiendo y el otro está escuchando
socket.on('chat:message', (data) => {  
    console.log(data);
    actions.innerHTML = '';
    output.innerHTML += `<p><strong>${data.username}</strong>: ${data.message}</p>`
    //Las comillas invertidas se utilizan para colocar javascript dentro del texto con ${}
});

socket.on('chat:typing', (data) => {  
    actions.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
});

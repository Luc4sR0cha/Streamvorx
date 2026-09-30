const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = (evento) => {
    const p = document.createElement('p');
    p.textContent = evento.data;
    document.getElementById('chat').appendChild(p);
};

const campo = document.getElementById('chat-input');

function enviar() {
    if (campo.value.trim() === '') return;
    socket.send(campo.value);
    campo.value = '';
}

campo.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') enviar();
});
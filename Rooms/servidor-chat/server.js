const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  ws.on('message', (mensagem) => {
    wss.clients.forEach((cliente) => {
      cliente.send(mensagem.toString());
    });
  });
});

console.log('Servidor rodando na porta 3000');
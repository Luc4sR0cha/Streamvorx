const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 3000 });

// nomeDaSala -> Set de conexões
const salas = new Map();

function entrar(ws, sala) {
  sair(ws);
  if (!salas.has(sala)) salas.set(sala, new Set());
  salas.get(sala).add(ws);
  ws.sala = sala;
}

function sair(ws) {
  if (!ws.sala) return;
  const membros = salas.get(ws.sala);
  membros.delete(ws);
  if (membros.size === 0) salas.delete(ws.sala);
  ws.sala = null;
}

function enviarParaSala(sala, dados) {
  for (const cliente of salas.get(sala) ?? []) {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(JSON.stringify(dados));
    }
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (mensagem) => {
    let msg;
    try {
      msg = JSON.parse(mensagem.toString());
    } catch {
      return;
    }

    if (msg.tipo === 'entrar') {
      entrar(ws, msg.sala);
      ws.send(JSON.stringify({ tipo: 'entrou', sala: msg.sala })); // confirmação
      enviarParaSala(msg.sala, { tipo: 'aviso', texto: `${msg.usuario} entrou na sala` });
    }

    if (msg.tipo === 'mensagem' && ws.sala) {
      enviarParaSala(ws.sala, { tipo: 'mensagem', usuario: msg.usuario, texto: msg.texto });
    }
  });

  ws.on('close', () => sair(ws));
});

console.log('SERVIDOR NOVO v2 na porta 3000');
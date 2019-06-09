import WebSocket from 'ws';

const PORT = 8080;

//The server initiates listening once instantiated
const server = new WebSocket.Server({port: PORT});
console.log(`Started new WebSocket server on ${PORT}`)
let clients: WebSocket[] = [];
//when receiving a connection from a client
server.on('connection', (client) => {
  console.log("Log: new connection!")
  client.send('Welcome to the server!');
  clients.push(client);
  //event handler for ALL messages (from that client)
  client.on('message', (message: string) => {
      console.log(`log: received ${message}`)
      sendText(client, message, clients.indexOf(client));
  });
});

function sendText(client: WebSocket, message: string, playerID: number) {
  let splitMessage = message.split(' ', 2);
  let msg = {
    cmd: splitMessage[0],
    text: splitMessage[1],
    id: playerID
  }
  client.send(JSON.stringify(msg));
  client.send(`You said: "${message}"`); //echo back
}

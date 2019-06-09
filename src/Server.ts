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
      console.log('log: ' + sendText(client, message, clients.indexOf(client)));
      
      client.send(`You said: "${message}"`); //echo back
  });
});

function sendText(client: WebSocket, message: string, playerID: number) {
  let msg = {
    cmd: "commands",
    id: playerID,
    text: message
  }
  client.send(JSON.stringify(msg));
}

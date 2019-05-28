import WebSocket from 'ws';

const PORT = 8080;

//The server initiates listening once instantiated
const server = new WebSocket.Server({port: PORT});
console.log(`Started new WebSocket server on ${PORT}`)

//when receiving a connection from a client
server.on('connection', (client) => {
  console.log("Log: new connection!")
  client.send('Welcome to the server!');

  //event handler for ALL messages (from that client)
  client.on('message', (message: string) => {
      console.log(`log: received ${message}`)
      client.send(`You said: "${message}"`); //echo back
  });
});

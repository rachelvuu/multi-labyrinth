//for demoing user input
import * as readline from 'readline';
const io = readline.createInterface({ input: process.stdin, output: process.stdout });

import WebSocket from 'ws';

//connect to the server
const connection = new WebSocket(`ws://localhost:8080`);

//when receiving a message from the server
connection.on('message', (data) => {
  console.log(`Received message: "${data}"`)
  io.question('> ', (answer) => {
    connection.send(answer);
  })
});

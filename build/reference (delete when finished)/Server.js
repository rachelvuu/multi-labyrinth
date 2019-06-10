"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const app_1 = require("./app");
const PORT = 8080;
//The server initiates listening once instantiated
const server = new ws_1.default.Server({ port: PORT });
console.log(`Started new WebSocket server on ${PORT}`);
let clients = [];
//when receiving a connection from a client
server.on('connection', (client) => {
    console.log("Log: new connection!");
    client.send('Welcome to the server!');
    clients.push(client);
    //event handler for ALL messages (from that client)
    client.on('message', (message) => {
        console.log(`log: received ${message}`);
        sendText(client, message, clients.indexOf(client));
    });
});
function sendText(client, message, playerID) {
    let splitMessage = message.split(' ', 2);
    let cmd = splitMessage[0];
    let text = splitMessage[1];
    if (app_1.handleInput(cmd, text)) {
        let msg = {
            cmd: cmd,
            text: splitMessage[1],
            id: playerID
        };
        client.send(JSON.stringify(msg));
        client.send(`You said: "${message}"`); //echo back
    }
    else {
        client.send('Invalid command. Try again.');
    }
}
function broadcastEveryoneExceptActor() {
}
//# sourceMappingURL=Server.js.map
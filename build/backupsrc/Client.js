"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//for demoing user input
const readline = __importStar(require("readline"));
const io = readline.createInterface({ input: process.stdin, output: process.stdout });
const ws_1 = __importDefault(require("ws"));
//connect to the server
const connection = new ws_1.default(`ws://localhost:8080`);
//when receiving a message from the server
connection.on('message', (data) => {
    console.log(`Received message: "${data}"`);
    io.question('> ', (answer) => {
        connection.send(answer);
    });
});
//# sourceMappingURL=Client.js.map
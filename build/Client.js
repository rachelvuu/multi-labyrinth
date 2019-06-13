"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
const ws_1 = __importDefault(require("ws"));
const lodash = __importStar(require("lodash"));
let _ = lodash;
class PlayerController {
    constructor() {
        this.playerActive = true;
        this.playerActive = true;
        this.parser = new Parser_1.CommandParser(this.handleInput, false);
        this.parser.start();
    }
    handleInput(cmd, arg) {
        console.log("Handling", cmd, "with argument '" + arg + "'");
        arg = arg.toLowerCase();
        if (this.playerActive == false) {
            return false;
        }
        if (cmd === Parser_1.Command.GO) {
            connection.send("go," + arg);
        }
        else if (cmd === Parser_1.Command.TAKE) {
            connection.send("take," + arg);
        }
        else if (cmd === Parser_1.Command.USE) {
            connection.send("use," + arg);
        }
        else if (cmd === Parser_1.Command.LOOK) {
            connection.send("look");
        }
        else if (cmd === Parser_1.Command.INVENTORY) {
            connection.send("inventory");
        }
        else if (cmd === Parser_1.Command.QUIT) {
            return false;
        }
        return true;
    }
    interpretResponse(response) {
        if (response == 'lose') {
            this.playerActive = false;
            console.log('You Lost!');
        }
        else if (response == 'win') {
            this.playerActive = false;
            console.log('Congrats, you won!');
        }
        else {
            console.log(response);
        }
    }
}
const connection = new ws_1.default(`ws://localhost:8080`);
let playerController = new PlayerController();
connection.on('message', (data) => {
    playerController.interpretResponse(`${data}`);
});
//# sourceMappingURL=Client.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParserOld_1 = require("./ParserOld");
const Game_1 = require("./Game");
let game = new Game_1.Game();
let parser = new ParserOld_1.CommandParser(handleInput);
parser.start();
function handleInput(cmd, arg) {
    if (cmd === ParserOld_1.Command.INVENTORY) {
        game.handleInputINVENTORY();
        return game.checkContinue();
    }
    else if (cmd === ParserOld_1.Command.LOOK) {
        game.displayAreadDetails();
        return game.checkContinue();
    }
    else if (cmd === ParserOld_1.Command.GO) {
        return userGO(arg);
    }
    else if (cmd === ParserOld_1.Command.TAKE) {
        userTake(arg);
    }
    else if (cmd === ParserOld_1.Command.DROP) {
        throw new Error("not Implemented");
    }
    else {
        return userUse(arg);
    }
    return true;
}
function userGO(arg) {
    return game.userGo(arg);
}
function userTake(arg) {
    game.playerTakes(arg);
    return game.checkContinue();
}
function userUse(arg) {
    return game.userUse(arg);
}
//function userDrop(arg : String) : boolean{
// game.userDrop(arg);
//}
//# sourceMappingURL=app.js.map
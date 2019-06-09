"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = require("./Item");
const Area_1 = require("./Area");
const ParserOld_1 = require("./ParserOld");
const Game_1 = require("./Game");
let game = new Game_1.Game();
let parser = new ParserOld_1.CommandParser(handleInput);
parser.start();
function handleInput(cmd, arg) {
    if (cmd === ParserOld_1.Command.INVENTORY) {
        game.handleInputINVENTORY();
        return gameOver();
    }
    else if (cmd === ParserOld_1.Command.LOOK) {
        game.displayAreadDetails();
        return gameOver();
    }
    else if (cmd === ParserOld_1.Command.GO) {
        return userGO(arg);
    }
    else if (cmd === ParserOld_1.Command.TAKE) {
        userTake(arg);
    }
    else {
        return userUse(arg);
    }
    return true;
}
function userGO(arg) {
    if (game.getPlayerValidDirection(arg.toUpperCase())) {
        let road = game.getValidRoad(arg.toUpperCase());
        game.setRoads(road);
        let hazard = road.getHazard();
        if (hazard.getTitle() != "") {
            console.log(hazard.getTitle());
        }
        else {
            return playerChange();
        }
    }
    else {
        console.log("Their is no way from this Direction");
    }
    return gameOver();
}
function userTake(arg) {
    if (arg == game.getPlayerAreaTitle()) {
        console.log("Now you have the " + arg);
        game.addItem(new Item_1.Item(arg));
        game.playerRemoveItemArea();
        game.removeItemFromHouse();
    }
    else {
        console.log("This place doesn't have what you are looking for.");
    }
    game.monsterMove();
    return gameOver();
}
function userUse(arg) {
    let item = new Item_1.Item(arg);
    if (game.gameOver()) {
        if (arg == game.getMonsterItemTitle()) {
            console.log("YOU WON THE WAR YOU DEFEATED THE MONSTER");
            game.changeMonsterArea(new Area_1.Area("Not on the map"));
            game.removeItem(item);
            return true;
        }
    }
    if (game.checkHasItemFinal(item)) {
        game.removeItem(item);
        return playerChange();
    }
    else {
        console.log(" You dont have the item");
    }
    return true;
}
function playerChange() {
    game.changeArea();
    if (game.checkForWin(game.winningItem)) {
        console.log("You Won The Game");
        return false;
    }
    game.displayAreadDetails();
    console.log();
    console.log();
    return gameOver();
}
function gameOver() {
    if (game.gameOver()) {
        console.log(game.getMonsterTitle() + " has apeared you need to finish him");
        return (game.gameFinalBattle());
    }
    else {
        game.monsterMove();
    }
    return true;
}
//# sourceMappingURL=app.js.map
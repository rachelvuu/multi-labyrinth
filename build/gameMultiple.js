"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Army_1 = require("./Army");
const jSONToCard_1 = require("./jSONToCard");
class MultiPlayerGame {
    constructor() {
        this.world = new jSONToCard_1.Westeros();
        this.players = new Set();
    }
    addPlayer(id) {
        this.players = this.players.add(new Army_1.Army(id));
    }
    getPlayer(id) {
        this.players.forEach(element => {
            if (element.getId() === id) {
                return element;
            }
        });
        console.log("ID doesn't exists");
        return undefined;
    }
    modifyWorld(world) {
        this.world = world;
    }
}
exports.MultiPlayerGame = MultiPlayerGame;
//# sourceMappingURL=gameMultiple.js.map
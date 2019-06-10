"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Army_1 = require("./Army");
const jSONToCard_1 = require("./jSONToCard");
class MultiPlayerGame {
    constructor() {
        this.world = new jSONToCard_1.WesterosWorld();
        this.players = new Set();
        this.monster = this.world.makeMonster();
        this.areas = this.world.getHouses();
        this.areaList = new Set(this.areas.keys());
    }
    addPlayer(id) {
        this.players = this.players.add(new Army_1.Army(this.getRandomStartingPlace(), id));
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
    getRandomStartingPlace() {
        // Make a random starter Removed for testing
        let randomIndex = Math.floor(Math.random() * this.areaList.size);
        let i = 0;
        for (let currentArea of this.areaList) {
            if (i == randomIndex) {
                return this.areas.get(currentArea);
            }
            i++;
        }
        return undefined;
        // For predicatble behavior
        /*let area = this.westerosWords.getStart() ? (this.westerosWords.getStart() ) : new Area();
        return(area);*/
    }
}
exports.MultiPlayerGame = MultiPlayerGame;
//# sourceMappingURL=gameMultiple.js.map
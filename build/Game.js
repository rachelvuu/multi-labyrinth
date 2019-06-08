"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Roads_1 = require("./Roads");
const Army_1 = require("./Army");
const jSONToCard_1 = require("./jSONToCard");
class Game {
    constructor() {
        this.westerosWords = new jSONToCard_1.Westeros();
        this.areas = this.westerosWords.getHouses();
        this.areaList = new Set(this.areas.keys());
        this.player = new Army_1.Army(this.getRandomStartingPlace());
        this.monster = this.westerosWords.makeMonster();
        this.road = new Roads_1.Roads("", "");
        this.winningItem = this.westerosWords.getWin();
        this.startGame();
    }
    getExit() {
        return this.westerosWords.getExit();
    }
    removeItemFromHouse() {
        this.westerosWords.removeItemArea(this.player.getHouse());
    }
    startGame() {
        if (this.isPlayerValid()) {
            console.log(this.westerosWords.introduction);
            console.log(this.displayAreadDetails());
        }
        else {
            console.log("Your World cannot me made. Try seeing the Schema");
        }
    }
    getLocationCurrentPlayer() {
        this.player.getLocation();
    }
    displayAreadDetails() {
        this.player.displayDetails();
    }
    handleInputINVENTORY() {
        this.player.showArmy();
    }
    gameOver() {
        return (this.player.getLocation() == this.monster.getLocation());
    }
    gameFinalBattle() {
        if (this.player.hasItem(this.monster.getMonsterItem())) {
            console.log("You Can defeat the monster. Use " + this.monster.getMonsterItemTitle());
            return true;
        }
        else {
            console.log("You dont have the magical item to beat the monster. XD you are ded");
            return false;
        }
    }
    getArea(place) {
        return this.areas.get(place);
    }
    getRandomStartingPlace() {
        //Make a random starter Removed for testing
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
        //let area = this.westerosWords.getStart() ? (this.westerosWords.getStart() ) : new Area();
        //return(area);
    }
    setRoads(road = new Roads_1.Roads("", "")) {
        this.road = road;
    }
    removeItem(item) {
        this.player.removeItem(item);
    }
    changeArea() {
        this.player.changeArea(this.road.getDestination());
    }
    checkForWin(item) {
        return this.checkHasItemFinal(item) && this.checkFinalLocation();
    }
    checkFinalLocation() {
        return this.player.getHouse() == this.getExit().getHouse();
    }
    checkHasItemFinal(item) {
        return this.player.hasItem(item);
    }
    getPlayer() {
        return this.player;
    }
    isPlayerValid() {
        return this.player.getHouse() != "";
    }
    getMonsterTitle() {
        return this.monster.getTitle();
    }
    getPlayerValidDirection(arg) {
        return this.player.getValidDirection(arg);
    }
    getLocationRoad(arg) {
        return this.player.getRoad(arg);
    }
    monsterMove() {
        this.monster.changeMonsterMove();
    }
    getValidRoad(arg) {
        return this.player.getRoad(arg);
    }
    getMonsterItemTitle() {
        return this.monster.getMonsterItemTitle();
    }
    changeMonsterArea(area) {
        this.monster.changeArea(area);
    }
    getPlayerAreaTitle() {
        return this.player.getItemTitle();
    }
    playerRemoveItemArea() {
        this.player.removeItemArea();
    }
    addItem(item) {
        this.player.addToArmy(item);
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map
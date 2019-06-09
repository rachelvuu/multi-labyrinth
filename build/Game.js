"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Roads_1 = require("./Roads");
const Item_1 = require("./Item");
const Area_1 = require("./Area");
const Army_1 = require("./Army");
const jSONToCard_1 = require("./jSONToCard");
class Game {
    constructor() {
        this.westerosWords = new jSONToCard_1.WesterosWorld();
        this.areas = this.westerosWords.getHouses();
        this.areaList = new Set(this.areas.keys());
        console.log(this.getRandomStartingPlace());
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
    modify(world) {
        this.westerosWords = world;
    }
    startGame() {
        console.log(this.player);
        if (this.player.getHouse() != "") {
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
    getHouses() {
        return this.westerosWords.houses;
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
    playerTakes(arg) {
        if (arg == this.getPlayerAreaTitle()) {
            console.log("Now you have the " + arg);
            this.addItem(new Item_1.Item(arg));
            this.playerRemoveItemArea();
            this.removeItemFromHouse();
        }
        else {
            console.log("This place doesn't have what you are looking for.");
        }
        this.monsterMove();
        return this.checkContinue();
    }
    playerChange() {
        this.changeArea();
        if (this.checkForWin(this.winningItem)) {
            console.log("You Won The Game");
            return false;
        }
        this.displayAreadDetails();
        console.log();
        console.log();
        return this.checkContinue();
    }
    //Returns true if the game continues
    checkContinue() {
        if (this.gameOver()) {
            console.log(this.getMonsterTitle() + " has apeared you need to finish him");
            return (this.gameFinalBattle());
        }
        else {
            this.monsterMove();
        }
        return true;
    }
    userGo(arg) {
        if (this.getPlayerValidDirection(arg.toUpperCase())) {
            let road = this.getValidRoad(arg.toUpperCase());
            this.setRoads(road);
            let hazard = road.getHazard();
            if (hazard.getTitle() != "") {
                console.log(hazard.getTitle());
            }
            else {
                return this.playerChange();
            }
        }
        else {
            console.log("Their is no way from this Direction");
        }
        return this.checkContinue();
    }
    userUse(arg) {
        let item = new Item_1.Item(arg);
        if (this.gameOver()) {
            if (arg == this.getMonsterItemTitle()) {
                console.log("YOU WON THE WAR YOU DEFEATED THE MONSTER");
                this.changeMonsterArea(new Area_1.Area("Not on the map"));
                this.removeItem(item);
                return true;
            }
        }
        if (this.checkHasItemFinal(item)) {
            this.removeItem(item);
            return this.playerChange();
        }
        else {
            console.log(" You dont have the item");
        }
        return true;
    }
    userDrop(arg) {
        if (this.player.hasItem(new Item_1.Item(arg))) {
            //Adds the item to the area
            //this.
        }
        else {
            console.log("You dont have the item you want to drop");
        }
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map
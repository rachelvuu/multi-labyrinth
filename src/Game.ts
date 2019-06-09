
import { Roads } from "./Roads";
import { Item } from "./Item";
import { Area } from "./Area";
import { Army } from "./Army";
import { WesterosWorld } from "./jSONToCard";
import { Monster } from "./Monster";


export class Game {

    westerosWords: WesterosWorld;
    areas: Map<String, Area>;
    areaList: Set<String>;
    player: Army;
    monster: Monster;
    road: Roads;
    winningItem: Item;

    constructor() {
        this.westerosWords = new WesterosWorld();
        this.areas = this.westerosWords.getHouses();
        this.areaList = new Set<String>(this.areas.keys());
        console.log(this.getRandomStartingPlace());
        this.player = new Army(this.getRandomStartingPlace());
        this.monster = this.westerosWords.makeMonster();
        this.road = new Roads("", "");
        this.winningItem = this.westerosWords.getWin();
        this.startGame();
    }

    getExit() {
        return this.westerosWords.getExit();
    }

    removeItemFromHouse() {
        this.westerosWords.removeItemArea(this.player.getHouse());
    }

    modify(world: WesterosWorld) {
        this.westerosWords = world;
    }

    startGame() {
        console.log(this.player);
        if (this.player.getHouse() != "") {
            console.log(this.westerosWords.introduction);
            console.log(this.displayAreadDetails());
        }
        else {
            console.log("Your World cannot me made. Try seeing the Schema")
        }
    }

    getLocationCurrentPlayer() {
        this.player.getLocation();
    }

    displayAreadDetails(): void {
        this.player.displayDetails();
    }

    getHouses() {
        return this.westerosWords.houses;
    }

    handleInputINVENTORY(): void {
        this.player.showArmy();
    }

    gameOver() {
        return (this.player.getLocation() == this.monster.getLocation())
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

    

    getRandomStartingPlace(): any {
        // Make a random starter Removed for testing
        let randomIndex = Math.floor( Math.random() * this.areaList.size );
        let i = 0;
        for (let currentArea of this.areaList) {
            if (i == randomIndex) {
                return this.areas.get(currentArea)
            }
            i++;
        }
        return undefined;
        // For predicatble behavior
        /*let area = this.westerosWords.getStart() ? (this.westerosWords.getStart() ) : new Area();
        return(area);*/
    }

    setRoads(road: Roads = new Roads("", "")) {
        this.road = road;
    }

    removeItem(item: Item) {
        this.player.removeItem(item);
    }

    changeArea(): void {
        this.player.changeArea(this.road.getDestination());
    }

    checkForWin(item: Item): boolean {
        return this.checkHasItemFinal(item) && this.checkFinalLocation();
    }
    checkFinalLocation(): boolean {
        return this.player.getHouse() == this.getExit()!.getHouse();
    }

    checkHasItemFinal(item: Item): boolean {
        return this.player.hasItem(item);
    }

    getPlayer(): Army {
        return this.player;
    }
    isPlayerValid(): boolean {
        return this.player.getHouse() != "";
    }

    getMonsterTitle() {
        return this.monster.getTitle();
    }

    getPlayerValidDirection(arg: String): boolean {
        return this.player.getValidDirection(arg);
    }

    getLocationRoad(arg: String) {
        return this.player.getRoad(arg);
    }

    monsterMove() {
        this.monster.changeMonsterMove();
    }

    getValidRoad(arg: String): Roads | undefined {
        return this.player.getRoad(arg);
    }

    getMonsterItemTitle(): String {
        return this.monster.getMonsterItemTitle();
    }

    changeMonsterArea(area: Area): void {
        this.monster.changeArea(area);
    }

    getPlayerAreaTitle(): String {
        return this.player.getItemTitle();
    }

    playerRemoveItemArea() {
        this.player.removeItemArea();
    }

    addItem(item: Item) {
        this.player.addToArmy(item);
    }


    playerTakes(arg: String): boolean {
        if (arg == this.getPlayerAreaTitle()) {
            console.log("Now you have the " + arg);
            this.addItem(new Item(arg));
            this.playerRemoveItemArea();
            this.removeItemFromHouse();
        }
        else {
            console.log("This place doesn't have what you are looking for.");
        }
        this.monsterMove();
        return this.checkContinue();
    }

    playerChange(): boolean {
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

    userGo(arg: String): boolean {
        if (this.getPlayerValidDirection(arg.toUpperCase())) {
            let road = this.getValidRoad(arg.toUpperCase());
            this.setRoads(road);
            let hazard = road!.getHazard();
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

    userUse(arg: String) {
        let item = new Item(arg);
        if (this.gameOver()) {
            if (arg == this.getMonsterItemTitle()) {
                console.log("YOU WON THE WAR YOU DEFEATED THE MONSTER");
                this.changeMonsterArea(new Area("Not on the map"));
                this.removeItem(item);
                return true;
            }
        }
        if (this.checkHasItemFinal(item)) {
            this.removeItem(item);
            return this.playerChange()
        }
        else {
            console.log(" You dont have the item");
        }
        return true;
    }

    userDrop(arg :  String){
        if(this.player.hasItem(new Item(arg))){
            //Adds the item to the area
            //this.
        }
        else{
            console.log("You dont have the item you want to drop");
        }
    }
}

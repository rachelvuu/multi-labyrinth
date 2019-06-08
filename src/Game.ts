
import { Roads } from "./Roads";
import {Item} from "./Item";
import {Area} from "./Area";
import { Army } from "./Army";
import {Westeros} from "./jSONToCard";
import {Monster} from "./Monster";


export class Game {

    westerosWords : Westeros;
    areas : Map<String,Area>;
    areaList: Set<String>;
    player : Army;
    monster : Monster;
    road : Roads;
    winningItem: Item;

    constructor(){
        this.westerosWords = new Westeros();
        this.areas = this.westerosWords.getHouses();
        this.areaList = new Set<String>(this.areas.keys());
        this.player = new Army(this.getRandomStartingPlace());
        this.monster = this.westerosWords.makeMonster();
        this.road = new Roads("","");
        this.winningItem = this.westerosWords.getWin();
        this.startGame();
    }

    getExit(){
        return this.westerosWords.getExit();
    }

    removeItemFromHouse(){
        this.westerosWords.removeItemArea(this.player.getHouse());
    }
    
    startGame(){
        if(this.isPlayerValid()){
            console.log(this.westerosWords.introduction);
            console.log(this.displayAreadDetails());
        }
        else{ 
            console.log("Your World cannot me made. Try seeing the Schema")
        }
    }

    getLocationCurrentPlayer(){
        this.player.getLocation();
    }

    displayAreadDetails() : void{
        this.player.displayDetails();
    }

    


    handleInputINVENTORY(): void{
        this.player.showArmy();
    }

    gameOver(){
        return (this.player.getLocation() == this.monster.getLocation())
    }

    gameFinalBattle(){
        if(this.player.hasItem(this.monster.getMonsterItem())){
            console.log("You Can defeat the monster. Use " + this.monster.getMonsterItemTitle());
            return true;
        }
        else{
            console.log("You dont have the magical item to beat the monster. XD you are ded");
            return false;
        }
    }

    getArea(place: String) : any {
      
        return this.areas.get(place);
    }

    getRandomStartingPlace()  :any {
        //Make a random starter Removed for testing
        let randomIndex = Math.floor(Math.random() * this.areaList.size);
        let i =0;
        for (let currentArea of this.areaList) {
            if(i == randomIndex){
                return this.areas.get(currentArea)
            }
            i++;
        }
        return undefined;
        // For predicatble behavior
        //let area = this.westerosWords.getStart() ? (this.westerosWords.getStart() ) : new Area();
        //return(area);
        
    }

    setRoads(road : Roads= new Roads("","")){
        this.road = road;
    }

    removeItem(item :Item){
        this.player.removeItem(item);
    }

    changeArea() : void {
        this.player.changeArea(this.road.getDestination());
    }

    checkForWin(item :Item) : boolean {
        return this.checkHasItemFinal(item) && this.checkFinalLocation();
    }
    checkFinalLocation(): boolean {
        return this.player.getHouse() == this.getExit()!.getHouse();
    }

    checkHasItemFinal(item : Item) : boolean {
        return this.player.hasItem(item);
    }

    getPlayer() : Army{
        return this.player;
    }
    isPlayerValid() : boolean{
        return this.player.getHouse() != "";
    }

    getMonsterTitle(){
        return this.monster.getTitle();
    }

    getPlayerValidDirection(arg : String) : boolean{
        return this.player.getValidDirection(arg);
    }

    getLocationRoad(arg :String){
        return this.player.getRoad(arg);
    }

    monsterMove(){
        this.monster.changeMonsterMove();
    }

    getValidRoad(arg: String): Roads|undefined{
        return this.player.getRoad(arg);
    }

    getMonsterItemTitle(): String{
        return this.monster.getMonsterItemTitle();
    }

    changeMonsterArea(area :Area): void{
        this.monster.changeArea(area);
    }

    getPlayerAreaTitle():String{
        return this.player.getItemTitle();
    }

    playerRemoveItemArea(){
        this.player.removeItemArea();
    }

    addItem(item: Item){
        this.player.addToArmy(item);
    }


}

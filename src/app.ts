import {Item} from "./Item";
import {Area} from "./Area";
import {Command, CommandParser} from './ParserOld';
import {Game} from "./Game";

let game = new Game();
let parser = new CommandParser(handleInput);
parser.start();


function handleInput(cmd:Command, arg:string) : boolean{
    if(cmd === Command.INVENTORY){
        game.handleInputINVENTORY();
        
        return gameOver();
    }
    else if(cmd === Command.LOOK){
        game.displayAreadDetails();
       
        return gameOver();
    }
    else if(cmd === Command.GO){   
        return userGO(arg);
    }

    else if(cmd === Command.TAKE){
        userTake(arg);
    }
    else{
        return userUse(arg);
    }
    console.log(game.westerosWords.houses);
    return true;
}

function userGO(arg :String){
    if(game.getPlayerValidDirection(arg.toUpperCase())){
        let road = game.getValidRoad(arg.toUpperCase());
  
        game.setRoads(road);
        let hazard  = road!.getHazard();
        if(hazard.getTitle() != "") {
            console.log(hazard.getTitle());
        }
        else{
            return playerChange();
        }
    }
    else{
        console.log("Their is no way from this Direction");
    }
    return gameOver();
}

function userTake(arg :String){
    if(arg == game.getPlayerAreaTitle()){
        console.log("Now you have the " + arg);
        game.addItem(new Item(arg));
        game.playerRemoveItemArea();
        game.removeItemFromHouse();
    }
    else{
        console.log("This place doesn't have what you are looking for.");
    }
    game.monsterMove();
    return gameOver();
}

function userUse(arg : String){
    let item = new Item(arg);
    if(game.gameOver()){
        if(arg == game.getMonsterItemTitle() ){
            console.log("YOU WON THE WAR YOU DEFEATED THE MONSTER");
            game.changeMonsterArea(new Area("Not on the map"));
            game.removeItem(item);
            return true;
        }
    }
    if(game.checkHasItemFinal(item)) {
        game.removeItem(item);
        return playerChange()

    }
    else{
        console.log(" You dont have the item");
    }
    return true;
}

function playerChange(){
    game.changeArea();
    if(game.checkForWin(game.winningItem)){
        console.log("You Won The Game");
        return false;
    }
    game.displayAreadDetails();
    console.log();
    console.log();
    return gameOver();
}

function gameOver(){
    if(game.gameOver()){
        console.log(game.getMonsterTitle() + " has apeared you need to finish him");
        return (game.gameFinalBattle());
    }
    else{
        game.monsterMove();
    }
    return true;
}
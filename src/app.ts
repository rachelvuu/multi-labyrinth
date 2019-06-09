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
        return game.checkContinue();
    }
    else if(cmd === Command.LOOK){
        game.displayAreadDetails();
        return game.checkContinue();
    }
    else if(cmd === Command.GO){   
        return userGO(arg);
    }
    else if(cmd === Command.TAKE){
        userTake(arg);
    }
    else if(cmd === Command.DROP){
        throw new Error("not Implemented");
    }
    else{
        return userUse(arg);
    }
    return true;
}

function userGO(arg :String) :  boolean{
   return game.userGo(arg);
}

function userTake(arg :String) :  boolean{
    game.playerTakes(arg);
    return game.checkContinue();
}

function userUse(arg : String) :  boolean{
    return game.userUse(arg);
}

//function userDrop(arg : String) : boolean{
    // game.userDrop(arg);
//}

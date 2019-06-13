import {Command, CommandParser} from './Parser';
import WebSocket from 'ws';
import * as lodash from 'lodash';
let _: any = lodash;

class PlayerController {
  private parser:CommandParser;
  private playerActive:boolean = true;
  constructor() {
    this.playerActive = true;
    this.parser = new CommandParser(this.handleInput, false);
    this.parser.start();
  }

  handleInput(cmd:Command, arg:string):boolean {
    
    console.log("Handling", cmd, "with argument '"+arg+"'");
    arg = arg.toLowerCase();
    if(this.playerActive == false) {
      return false;
    }
    if(cmd === Command.GO){
      connection.send("go," + arg);
    } else if(cmd === Command.TAKE) {
      connection.send("take," + arg);
    } else if(cmd === Command.USE) {
      connection.send("use," + arg);
    } else if(cmd === Command.LOOK) {
      connection.send("look");
    } else if(cmd === Command.INVENTORY) {
      connection.send("inventory");
    } else if(cmd === Command.QUIT) {
      return false
    }
    return true;
  }

  interpretResponse(response:string) {
    if(response == 'lose') {
      this.playerActive = false;
      console.log('You Lost!');
    } else if(response == 'win'){
      this.playerActive = false;
      console.log('Congrats, you won!');
    } else {
      console.log(response);
    }
  }
}

const connection : WebSocket = new WebSocket(`ws://localhost:8080`);

let playerController : PlayerController = new PlayerController();

connection.on('message', (data) => {
  playerController.interpretResponse(`${data}`);
});
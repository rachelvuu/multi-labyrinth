"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
//import {Map, Enemy} from './Server';
const Parser_1 = require("./Parser");
//let io = readline.createInterface({ input: process.stdin, output: process.stdout });
const ws_1 = __importDefault(require("ws"));
const lodash = __importStar(require("lodash"));
let _ = lodash;
//client has player's handleInput
//player logic & data
//more prone to client-side data manipulation/hacks
//less resource processing for server (faster)
//all references to map will be retrieved from server
//map.border (static value) will be saved client-side once on first connection
//server calls player.setId(incremental value based on clients connected) upon first connection
//client is the view
//request for map data each update <- Entity[] (has a copy of updated map's Entity[]) using JSON.stringify() & JSON.parse()
//send request for map editing <- string
class Player extends app_1.Entity {
    constructor(coords) {
        super(coords, 'player');
        this.dead = false;
        this.lastSeenHazard = '';
        this.inventory = [];
        this.id = -1;
    }
    setId(id) {
        this.id = id;
    }
    move(direction) {
        let newCoords = { x: this.coords.x, y: this.coords.y };
        if (direction == 'north') {
            newCoords.y++;
        }
        else if (direction == 'south') {
            newCoords.y--;
        }
        else if (direction == 'west') {
            newCoords.x--;
        }
        else if (direction == 'east') {
            newCoords.x++;
        }
        /*if(this.checkAdvanceArea(newCoords)) {
          this.lastSeenHazard = '';
          this.coords = newCoords;
          this.look();
        }*/
    }
    /*checkAdvanceArea(coords:Coords):boolean {
      if(coords.x > map.border || coords.y > map.border|| coords.x < 0 || coords.y < 0) {
        console.log('You cannot pass the wall.');
        return false;
      } else {
        for(let entity of map.getEntities()) {
          if(entity.getCoords().x == coords.x && entity.getCoords().y == coords.y) {
            if(entity instanceof HazardEntity) {
              console.log(entity.name + ' is blocking the way.');
              this.lastSeenHazard = entity.name;
  
              if(entity instanceof Enemy) {
                connection.send('fight');
                //enemy.fight();
              }
              return false;
            }
          }
        }
      }
      return true;
    }*/
    /*take(item:string) {
      for(let entity of map.getEntities()) {
        if(entity instanceof ItemEntity && entity.name == item) {
          if(player.getCoords().x == entity.getCoords().x && player.getCoords().y == entity.getCoords().y) {
            console.log('Taken ' + entity.name);
            this.inventory.push(<Item>{itemName:entity.itemName, usedOn:entity.usedOn});
            connection.send('remove,' + entity.name);
            //map.removeEntity(entity); //TD: playerController.sendCommand('remove ' + entity.name); --> server's map.removeEntity
            return;
          }
        }
      }
      console.log(item + ' is nowhere to be seen.');
    }
  
    use(item:string) {
      for(let inventoryItem of this.inventory) {
        if(inventoryItem.itemName == item) {
          for(let entity of map.getEntities()) {
            if(entity.name == inventoryItem.usedOn && inventoryItem.usedOn == this.lastSeenHazard) {
              console.log('Used ' + inventoryItem.itemName + ' on ' + inventoryItem.usedOn);
              this.removeItem(inventoryItem);
              connection.send('remove,' + entity.name);
              //map.removeEntity(entity); //TD: playerController.sendCommand('remove ' + entity.name); --> server's map.removeEntity
              return;
            }
          }
        }
      }
      console.log(item + ' is impossible to be used at the moment.');
    }*/
    removeItem(item) {
        _.pull(this.inventory, item);
    }
    openInventory() {
        if (this.inventory.length == 0) {
            console.log('Inventory is empty.');
        }
        else {
            console.log('Inventory: ');
            for (let item of this.inventory) {
                console.log(item.itemName + ' ');
            }
        }
    }
    hasItem(item) {
        for (let inventoryItem of this.inventory) {
            if (inventoryItem.itemName == item) {
                return true;
            }
        }
        return false;
    }
}
exports.Player = Player;
class PlayerController {
    handleInput(cmd, arg) {
        console.log("Handling", cmd, "with argument '" + arg + "'");
        arg = arg.toLowerCase();
        if (cmd === Parser_1.Command.GO) {
            connection.send('GO');
            player.move(arg);
        }
        else if (cmd === Parser_1.Command.TAKE) {
            //player.take(arg);
        }
        else if (cmd === Parser_1.Command.USE) {
            //player.use(arg);
        }
        else if (cmd === Parser_1.Command.LOOK) {
            //player.look();
        }
        else if (cmd === Parser_1.Command.INVENTORY) {
            player.openInventory();
        }
        //update Map object
        return true; //return !this.gameEnded();
    }
    constructor() {
        this.parser = new Parser_1.CommandParser(this.handleInput, false);
    }
    updateMap(data) {
        //map = <Map>JSON.parse(data);
        console.log('Map Updated!');
    }
}
const connection = new ws_1.default(`ws://localhost:8080`);
//TD: Sort things into classes for style
let playerController = new PlayerController();
//let map : Map;
let player;
playerController.parser.start();
function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;
    try {
        item = JSON.parse(item);
    }
    catch (e) {
        return false;
    }
    if (typeof item === "object" && item !== null) {
        return true;
    }
    return false;
}
//when receiving a message from the server
connection.on('message', (data) => {
    console.log(`${data}`);
    if (isJson(`${data}`)) {
        playerController.updateMap(`${data}`);
    }
});
//# sourceMappingURL=Client.js.map
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
const readline = __importStar(require("readline"));
const io = readline.createInterface({ input: process.stdin, output: process.stdout });
const ws_1 = __importDefault(require("ws"));
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
/*export class Player extends Entity implements Moveable {
  dead:boolean = false;
  private lastSeenHazard: string = '';
  private inventory : Item[] = [];
  private id:number;

  constructor(coords:Coords) {
    super(coords, 'player');
    this.id = -1;
  }

  setId(id:number) {
    this.id = id;
  }

  move(direction:string) {
    let newCoords : Coords = {x:this.coords.x, y:this.coords.y};
    if(direction == 'north') {
      newCoords.y++;
    } else if(direction == 'south') {
      newCoords.y--;
    } else if(direction == 'west') {
      newCoords.x--;
    } else if(direction == 'east') {
      newCoords.x++;
    }

    if(this.checkAdvanceArea(newCoords)) {
      this.lastSeenHazard = '';
      this.coords = newCoords;
      this.look();
    }
  }

  checkAdvanceArea(coords:Coords):boolean {
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
  }

  take(item:string) {
    for(let entity of map.getEntities()) {
      if(entity instanceof ItemEntity && entity.name == item) {
        if(player.getCoords().x == entity.getCoords().x && player.getCoords().y == entity.getCoords().y) {
          console.log('Taken ' + entity.name);
          this.inventory.push(<Item>{itemName:entity.itemName, usedOn:entity.usedOn});
          map.removeEntity(entity); //TD: playerController.sendCommand('remove ' + entity.name); --> server's map.removeEntity
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
            map.removeEntity(entity); //TD: playerController.sendCommand('remove ' + entity.name); --> server's map.removeEntity
            return;
          }
        }
      }
    }
    console.log(item + ' is impossible to be used at the moment.');
  }

  removeItem(item:Item) {
    _.pull(this.inventory, item);
  }

  openInventory() {
    if(this.inventory.length == 0) {
      console.log('Inventory is empty.');
    } else {
      console.log('Inventory: ');
      for(let item of this.inventory) {
        console.log(item.itemName + ' ');
      }
    }
  }

  hasItem(item:string):boolean {
    for(let inventoryItem of this.inventory) {
      if(inventoryItem.itemName == item) {
        return true;
      }
    }
    return false;
  }

  look() {
    for(let entity of map.getEntities()) {
      if(player.getCoords().x == entity.getCoords().x && player.getCoords().y == entity.getCoords().y) {
        console.log(entity.name + ' is in this area.');
        return;
      }
    }
    console.log('This area has nothing interesting.');
  }
}*/
class PlayerController {
    handleInput(cmd, arg) {
        console.log("Handling", cmd, "with argument '" + arg + "'");
        arg = arg.toLowerCase();
        if (cmd === Parser_1.Command.GO) {
            connection.send('GO');
            //player.move(arg);
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
            //player.openInventory();
        }
        //update Map object
        return true; //!this.gameEnded();
    }
    constructor() {
        this.parser = new Parser_1.CommandParser(this.handleInput, false);
    }
    update(map) {
    }
}
const connection = new ws_1.default(`ws://localhost:8080`);
//TD: Sort things into classes for style
let playerController = new PlayerController();
let map;
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
        map = JSON.parse(`${data}`);
        console.log('Map Updated!');
    }
});
//let player : Player = new Player(mapData.player);
//# sourceMappingURL=Client.js.map
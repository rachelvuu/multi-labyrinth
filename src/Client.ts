import {Coords,Entity,HazardEntity,ItemEntity,Item,Moveable} from './app';
import {Command, CommandParser} from './Parser';
import * as readline from 'readline';
const io = readline.createInterface({ input: process.stdin, output: process.stdout });

import WebSocket from 'ws';

//client has player's handleInput
//player logic & data

//more prone to client-side data manipulation/hacks
//less resource processing for server (faster)

//all references to map will be retrieved from server
//map.border (static value) will be saved client-side once on first connection
//server calls player.setId(incremental value based on clients connected) upon first connection

//connect to the server
const connection = new WebSocket(`ws://localhost:8080`);

//when receiving a message from the server
//parser.prompt() when receive feedback from server after message sent
connection.on('message', (data) => {
  console.log(`Received message: "${data}"`)
  io.question('> ', (answer) => {
    connection.send(answer);
  })
});

class Player extends Entity implements Moveable {
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
              enemy.fight();
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
          map.removeEntity(entity);
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
            map.removeEntity(entity);
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
}

class PlayerController {
  handleInput(cmd:Command, arg:string) {
    console.log("Handling", cmd, "with argument '"+arg+"'");
    arg = arg.toLowerCase();
    if(cmd === Command.GO){
      player.move(arg);
    } else if(cmd === Command.TAKE) {
      player.take(arg);
    } else if(cmd === Command.USE) {
      player.use(arg);
    } else if(cmd === Command.LOOK) {
      player.look();
    } else if(cmd === Command.INVENTORY) {
      player.openInventory();
    }
  }

  constructor() {
    //this.start() here instead
  }

  start() {
    let parser = new CommandParser(this.handleInput, false);
    console.log('Input a command:');
    parser.start();
  }
}

let player : Player = new Player(mapData.player);
//import {Command, CommandParser} from './Parser';
//import * as lodash from 'lodash';
//import data from './map.json';
//let _: any = lodash;

export interface Coords {
  x:number
  y:number
}

export interface MapData {
  border:number

  player:Coords
  enemy:Coords
  key:Coords
  door:Coords
  potion:Coords
  acid:Coords
  sword:Coords
  exit:Coords
  treasure:Coords
}

export interface Item {
  readonly itemName:string
  readonly usedOn:string
}

export abstract class Entity {
  readonly name:string;
  protected coords:Coords;
  constructor(coords:Coords, name:string) {
    this.coords = coords;
    this.name = name;
  }
  getCoords():Coords {
    return this.coords;
  }
}

export class ItemEntity extends Entity implements Item {
  itemName:string;
  usedOn:string;
  constructor(coords:Coords, name:string, usedOn:string) {
    super(coords, name);
    this.itemName = name;
    this.usedOn = usedOn;
  }
}

export class HazardEntity extends Entity {
  constructor(coords:Coords, name:string) {
    super(coords, name);
  }
}

export interface Moveable {
  dead:boolean;
  move(direction:string):void;
}


/*class Game {
  handleInput(cmd:Command, arg:string):boolean {
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
    if(!enemy.dead) {
      enemy.chase(player);
    }
  
    this.showLocations();
  
    return !this.gameEnded(); //return true to indicate that it should prompt for another input
  }
  
  showLocations() {
    console.log('============================');
    console.log('Player Location: (x)' + player.getCoords().x + ' (y)' + player.getCoords().y);
    if(!enemy.dead) {
      console.log('Enemy Location: (x)' + enemy.getCoords().x + ' (y)' + enemy.getCoords().y);
    }
    console.log('============================');
  }
  
  gameEnded():boolean {
    if(player.dead) {
      console.log('(Lost) You Died!');
      return true;
    }
    if(player.getCoords().x == map.exit.x && player.getCoords().y == map.exit.y && player.hasItem('treasure')) {
      console.log('(Win) Congrats, you escaped!');
      return true;
    }
    return false;
  }

  start() {
    let parser = new CommandParser(this.handleInput, false); //pass in the "handler" callback
    console.log('Input a command:');
    parser.start();
  }
}*/

/*class Map {
  private entities:Entity[] = [];
  readonly border:number;
  readonly exit:Coords;
  constructor(mapData:MapData) {
    this.border = mapData.border;
    this.exit = mapData.exit;
    this.entities.push(new ItemEntity(mapData.key, 'key', 'door'));
    this.entities.push(new ItemEntity(mapData.potion, 'potion', 'acid'));
    this.entities.push(new ItemEntity(mapData.sword, 'sword', 'enemy'));
    this.entities.push(new ItemEntity(mapData.treasure, 'treasure', 'exit'));
    this.entities.push(new HazardEntity(mapData.acid, 'acid'));
    this.entities.push(new HazardEntity(mapData.door, 'door'));
  }

  getEntities():Entity[] {
    return this.entities;
  }
  removeEntity(entity:Entity) {
    _.pull(this.entities, entity);
  }
}

class Enemy extends HazardEntity implements Moveable {
  dead:boolean = false;
  constructor(coords:Coords) {
    super(coords, 'enemy');
  }
  chase(target:Entity) {
    if(this.getCoords().x > target.getCoords().x) {
      this.move('west');
    } else if(this.getCoords().x < target.getCoords().x) {
      this.move('east');
    } else if(this.getCoords().y < target.getCoords().y) {
      this.move('north');
    } else if(this.getCoords().y > target.getCoords().y) {
      this.move('south');
    }
    this.foundTarget(target);
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
    this.coords = newCoords;
  }
  fight() {
    if(player.hasItem('sword')) {
      console.log('You have killed the enemy.');
      this.dead = true;
    } else {
      player.dead = true;
    }
  }
  foundTarget(target:Entity) {
    if(target.getCoords().x == this.getCoords().x && target.getCoords().y == this.getCoords().y) {
      this.fight();
    }
  }
}

class Player extends Entity implements Moveable {
  dead:boolean = false;
  private lastSeenHazard: string = '';
  private inventory : Item[] = [];

  constructor(coords:Coords) {
    super(coords, 'player');
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

let mapData : MapData = data;
let map : Map = new Map(mapData);
let player : Player = new Player(mapData.player);
let enemy : Enemy = new Enemy(mapData.enemy);
let gameInstance : Game = new Game();

gameInstance.start();*/
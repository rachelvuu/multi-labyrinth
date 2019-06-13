import WebSocket from 'ws';
import {Coords,Entity,HazardEntity,ItemEntity,MapData,Moveable, Item} from './app';
import data from './map.json';
import * as lodash from 'lodash';
let _: any = lodash;

class Map {
  private entities:Entity[] = [];
  readonly border:number;
  readonly exit:Coords;
  readonly playerSpawn:Coords;
  constructor(mapData:MapData) {
    this.border = mapData.border;
    this.exit = mapData.exit;
    this.playerSpawn = mapData.player;
    this.entities.push(new ItemEntity(mapData.key, 'key', 'door'));
    this.entities.push(new ItemEntity(mapData.potion, 'potion', 'acid'));
    this.entities.push(new ItemEntity(mapData.sword, 'sword', 'enemy'));
    this.entities.push(new ItemEntity(mapData.treasure, 'treasure', 'exit'));
    this.entities.push(new HazardEntity(mapData.acid, 'acid'));
    this.entities.push(new HazardEntity(mapData.door, 'door'));
    this.entities.push(new Enemy(mapData.enemy));
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
  randomMove() {
    let rng = Math.floor(Math.random() * 4) + 1  ;
    if(rng == 1) {
      this.move('west');
    } else if(rng == 2) {
      this.move('east');
    } else if(rng == 3) {
      this.move('north');
    } else if(rng == 4) {
      this.move('south');
    }
    this.checkAreaPlayer();
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
    for(let client of clients) {
      client.socket.send('Enemy Location: (x)' + this.getCoords().x + ' (y)' + this.getCoords().y);
    }
    this.coords = newCoords;
  }
  fight(target:Player) {
    if(target.hasItem('sword')) {
      target.client.send('You have killed the enemy.');
      this.dead = true;
    } else {
      target.client.send('lose');
      target.dead = true;
    }
  }
  checkAreaPlayer() {
    for(let client of clients) {
      if(client.player.getCoords().x == this.getCoords().x && client.player.getCoords().y == this.getCoords().y) {
        this.fight(client.player);
      }
    }
  }
}

class Player extends Entity implements Moveable {
  dead:boolean = false;
  client:WebSocket;
  private lastSeenHazard: string = '';
  private inventory : Item[] = [];

  constructor(coords:Coords, socket:WebSocket) {
    super(coords, 'player');
    this.client = socket;
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
      this.client.send('You cannot pass the wall.');
      return false;
    } else if(this.hasItem('treasure') && (this.getCoords().x == map.exit.x && this.getCoords().y == map.exit.y)) {
      this.client.send('win');
      for(let client of clients) {
        if(this.client != client.socket) {
          client.socket.send('lose');
        }
      }
    } else {
      for(let entity of map.getEntities()) {
        if(entity.getCoords().x == coords.x && entity.getCoords().y == coords.y) {
          if(entity instanceof HazardEntity) {
            this.client.send(entity.name + ' is blocking the way.');
            this.lastSeenHazard = entity.name;
            if(entity instanceof Enemy) {
              entity.fight(this);
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
        if(this.getCoords().x == entity.getCoords().x && this.getCoords().y == entity.getCoords().y) {
          this.client.send('Taken ' + entity.name);
            for(let client of clients) {
              if(this.client != client.socket) {
                client.socket.send('Someone took the ' + entity.name + '!');
              }
            }
          this.inventory.push(<Item>{itemName:entity.itemName, usedOn:entity.usedOn});
          map.removeEntity(entity);
          return;
        }
      }
    }
    this.client.send(item + ' is nowhere to be seen.');
  }

  use(item:string) {
    for(let inventoryItem of this.inventory) {
      if(inventoryItem.itemName == item) {
        for(let entity of map.getEntities()) {
          if(entity.name == inventoryItem.usedOn && inventoryItem.usedOn == this.lastSeenHazard) {
            this.client.send('Used ' + inventoryItem.itemName + ' on ' + inventoryItem.usedOn);
            this.removeItem(inventoryItem);
            map.removeEntity(entity);
            return;
          }
        }
      }
    }
    this.client.send(item + ' is impossible to be used at the moment.');
  }

  removeItem(item:Item) {
    _.pull(this.inventory, item);
  }

  openInventory() {
    if(this.inventory.length == 0) {
      this.client.send('Inventory is empty.');
    } else {
      this.client.send('Inventory: ');
      for(let item of this.inventory) {
        this.client.send(item.itemName + ' ');
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
    this.client.send('Your Location: (x)' + this.getCoords().x + ' (y)' + this.getCoords().y);
    for(let entity of map.getEntities()) {
      if(this.getCoords().x == entity.getCoords().x && this.getCoords().y == entity.getCoords().y) {
        this.client.send(entity.name + ' is in this area.');
        return;
      }
    }
    this.client.send('This area has nothing interesting.');
  }
}

class PlayerClient {
  socket:WebSocket;
  player:Player;
  constructor(socket:WebSocket) {
    this.socket = socket;
    this.player = new Player(map.playerSpawn, socket);
  }
  interpretRequest(message:string) {
    if(message.includes(',')) {
      let cmd = message.split(',')[0];
      let arg = message.split(',')[1];
      if(cmd == 'go') {
        this.player.move(arg);
      } else if(cmd == 'take') {
        this.player.take(arg);
      } else if(cmd == 'use') {
        this.player.use(arg);
      }
    } else if(message.includes('look')) {
      this.player.look();
    } else if(message.includes('inventory')){
      this.player.openInventory();
    }
  }
}

let mapData : MapData = data;
let map : Map = new Map(mapData);

let PORT = 8080;
let server = new WebSocket.Server({port: PORT});
console.log(`Started new WebSocket server on ${PORT}`);

let clients : PlayerClient[] = [];

server.on('connection', (client:WebSocket) => {
  console.log("Log: new connection!")
  let playerClient = new PlayerClient(client);
  clients.push(playerClient);
  client.send('Input a command:');

  client.on('message', (message:string) => {
      console.log(`RECEIVED COMMAND: ${message}`);
      playerClient.interpretRequest(message);
  });
});
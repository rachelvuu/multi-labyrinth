import WebSocket from 'ws';
import {Coords,Entity,HazardEntity,ItemEntity,MapData,Moveable} from './app';
//import {Player} from './Client';
import data from './map.json';
import * as lodash from 'lodash';
let _: any = lodash;

//server has one map data instance
//includes --> hazard/item/enemy data
//--> enemy logic
//--> game win/lose logic
//don't need set/array of player since all player data is handled client-side

//server class
//receive player data thru string type cast into objects
//set playerId when new player connects

const PORT = 8080;

//The server initiates listening once instantiated
const server = new WebSocket.Server({port: PORT});
console.log(`Started new WebSocket server on ${PORT}`)

//when receiving a connection from a client
server.on('connection', (client) => {
  console.log("Log: new connection!")
  client.send('Welcome to the server!');

  //event handler for ALL messages (from that client)
  client.on('message', (message: string) => {
      console.log(`log: received ${message}`)
      client.send(`You said: "${message}"`);
  });
});

class Map {
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

//new logic to determine when enemy can move
//enemyMove after one player moved?
class Game {
  //need to create new turn tracker for enemy movement
  handleTurn() {
    if(!enemy.dead) {
    enemy.chase(player);
    }

    this.showLocations();
  }
  
  //TD:
  //notify player location to player client when player moves <-- can be processed client-side instead
  //notify enemy location to all clients when enemy moves
  showLocations() {
    console.log('============================');
    console.log('Player Location: (x)' + player.getCoords().x + ' (y)' + player.getCoords().y);
    if(!enemy.dead) {
      console.log('Enemy Location: (x)' + enemy.getCoords().x + ' (y)' + enemy.getCoords().y);
    }
    console.log('============================');
  }
  
  //if player.dead -> stop calling parser.prompt()
  //if player won -> notify all clients & kill all players
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
    //load map data
  }
}

//move mapData, map, enemy into Game class
let mapData : MapData = data;
let map : Map = new Map(mapData);
let enemy : Enemy = new Enemy(mapData.enemy);
let gameInstance : Game = new Game();

gameInstance.start();
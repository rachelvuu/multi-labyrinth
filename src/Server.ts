import WebSocket from 'ws';
import {Coords,Entity,HazardEntity,ItemEntity,MapData,Moveable} from './app';
import {Player} from './Client';
import data from './map.json';
import * as lodash from 'lodash';
let _: any = lodash;

//server has one map data instance
//includes --> hazard/item/enemy data
//--> enemy logic
//--> game win/lose logic
//don't need set/array of player since all player data is handled client-side

//server class
//set playerId when new player connects

//listener for commands that edit server's model
//map is the model
//update -> notify all clients when map state changes
//could add Enemy into map.entities

//game class is the controller

export class Map {
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
  }

  getEntities():Entity[] {
    return this.entities;
  }
  removeEntity(entityName:string) {
    //TD: use string to get entity instead to avoid having to send entity object to server from client
    //_.pull(this.entities, entity);
  }

  updateClients() {
    /*for(let client of clients) {
      client.send(JSON.stringify(this));
    }*/
  }
}

export class Enemy extends HazardEntity implements Moveable {
  dead:boolean = false;
  constructor(coords:Coords) {
    super(coords, 'enemy');
  }
  chase(target:Player) {
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
  fight(target:Player) {
    if(target.hasItem('sword')) {
      console.log('You have killed the enemy.');
      this.dead = true;
    } else {
      target.dead = true;
    }
  }
  foundTarget(target:Player) {
    if(target.getCoords().x == this.getCoords().x && target.getCoords().y == this.getCoords().y) {
      this.fight(target);
    }
  }
}

//new logic to determine when enemy can move
//enemyMove after one player moved?
class Game {
  //TD: need to create new turn tracker for enemy movement
  handleTurn() {
    //if(!enemy.dead) {
    //enemy.chase(player);
    //}

    //this.showLocations();
  }
  
  //TD:
  //notify player location to player client when player moves <-- move to processed client-side instead
  //notify enemy location to all clients when enemy moves
  /*showLocations() {
    console.log('============================');
    console.log('Player Location: (x)' + player.getCoords().x + ' (y)' + player.getCoords().y);
    if(!enemy.dead) {
      console.log('Enemy Location: (x)' + enemy.getCoords().x + ' (y)' + enemy.getCoords().y);
    }
    console.log('============================');
  }*/
  
  //TD:
  //if player.dead -> stop calling parser.prompt()
  //if player won -> notify all clients & kill all players
  /*gameEnded():boolean {
    if(player.dead) {
      console.log('(Lost) You Died!');
      return true;
    }
    if(player.getCoords().x == map.exit.x && player.getCoords().y == map.exit.y && player.hasItem('treasure')) {
      console.log('(Win) Congrats, you escaped!');
      return true;
    }
    return false;
  }*/

  constructor() {
    //TD: load map data
  }

  control(message:string) {
    if(message == 'fight') {
      //enemy.fight();
    } else if(message.includes('remove')) {
      let entityName = message.split(',');
      map.removeEntity(entityName[1]);
    }
  }
}

//TD:
//move mapData, map, enemy, clients into Game class and others into classes for style
let mapData : MapData = data;
let map : Map = new Map(mapData);
let enemy : Enemy = new Enemy(mapData.enemy);
let gameInstance : Game = new Game();

let PORT = 8080;

//The server initiates listening once instantiated
let server = new WebSocket.Server({port: PORT});
console.log(`Started new WebSocket server on ${PORT}`)
let clients : WebSocket[] = [];

//when receiving a connection from a client
server.on('connection', (client:WebSocket) => {
  //if gameEnded, kill connecting player
  console.log("Log: new connection!")
  clients.push(client);
  map.updateClients();
  client.send('Input a command:');

  //event handler for ALL messages (from that client)
  client.on('message', (message:string) => {
      console.log(`RECEIVED COMMAND: ${message}`)
      gameInstance.control(message);
      //client.send(`You said: "${message}"`);
  });
});
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
const ws_1 = __importDefault(require("ws"));
const app_1 = require("./app");
const map_json_1 = __importDefault(require("./map.json"));
const lodash = __importStar(require("lodash"));
let _ = lodash;
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
class Map {
    constructor(mapData) {
        this.entities = [];
        this.border = mapData.border;
        this.exit = mapData.exit;
        this.playerSpawn = mapData.player;
        this.entities.push(new app_1.ItemEntity(mapData.key, 'key', 'door'));
        this.entities.push(new app_1.ItemEntity(mapData.potion, 'potion', 'acid'));
        this.entities.push(new app_1.ItemEntity(mapData.sword, 'sword', 'enemy'));
        this.entities.push(new app_1.ItemEntity(mapData.treasure, 'treasure', 'exit'));
        this.entities.push(new app_1.HazardEntity(mapData.acid, 'acid'));
        this.entities.push(new app_1.HazardEntity(mapData.door, 'door'));
    }
    getEntities() {
        return this.entities;
    }
    removeEntity(entityName) {
        //TD: use string to get entity instead to avoid having to send entity object to server from client
        //_.pull(this.entities, entity);
    }
    updateClients() {
        for (let client of clients) {
            client.send(JSON.stringify(this));
        }
    }
}
exports.Map = Map;
class Enemy extends app_1.HazardEntity {
    constructor(coords) {
        super(coords, 'enemy');
        this.dead = false;
    }
    chase(target) {
        if (this.getCoords().x > target.getCoords().x) {
            this.move('west');
        }
        else if (this.getCoords().x < target.getCoords().x) {
            this.move('east');
        }
        else if (this.getCoords().y < target.getCoords().y) {
            this.move('north');
        }
        else if (this.getCoords().y > target.getCoords().y) {
            this.move('south');
        }
        this.foundTarget(target);
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
        this.coords = newCoords;
    }
    fight(target) {
        if (target.hasItem('sword')) {
            console.log('You have killed the enemy.');
            this.dead = true;
        }
        else {
            target.dead = true;
        }
    }
    foundTarget(target) {
        if (target.getCoords().x == this.getCoords().x && target.getCoords().y == this.getCoords().y) {
            this.fight(target);
        }
    }
}
exports.Enemy = Enemy;
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
    control(message) {
        if (message == 'fight') {
            //enemy.fight();
        }
        else if (message.includes('remove')) {
            let entityName = message.split(',');
            map.removeEntity(entityName[1]);
        }
    }
}
//TD:
//move mapData, map, enemy, clients into Game class and others into classes for style
let mapData = map_json_1.default;
let map = new Map(mapData);
let enemy = new Enemy(mapData.enemy);
let gameInstance = new Game();
let PORT = 8080;
//The server initiates listening once instantiated
let server = new ws_1.default.Server({ port: PORT });
console.log(`Started new WebSocket server on ${PORT}`);
let clients = [];
//when receiving a connection from a client
server.on('connection', (client) => {
    //if gameEnded, kill connecting player
    console.log("Log: new connection!");
    clients.push(client);
    map.updateClients();
    client.send('Input a command:');
    //event handler for ALL messages (from that client)
    client.on('message', (message) => {
        console.log(`RECEIVED COMMAND: ${message}`);
        gameInstance.control(message);
        //client.send(`You said: "${message}"`);
    });
});
//# sourceMappingURL=Server.js.map
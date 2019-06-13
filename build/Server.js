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
        this.entities.push(new Enemy(mapData.enemy));
    }
    getEntities() {
        return this.entities;
    }
    removeEntity(entity) {
        _.pull(this.entities, entity);
    }
}
class Enemy extends app_1.HazardEntity {
    constructor(coords) {
        super(coords, 'enemy');
        this.dead = false;
    }
    randomMove() {
        let rng = Math.floor(Math.random() * 4) + 1;
        if (rng == 1) {
            this.move('west');
        }
        else if (rng == 2) {
            this.move('east');
        }
        else if (rng == 3) {
            this.move('north');
        }
        else if (rng == 4) {
            this.move('south');
        }
        this.checkAreaPlayer();
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
        for (let client of clients) {
            client.socket.send('Enemy Location: (x)' + this.getCoords().x + ' (y)' + this.getCoords().y);
        }
        this.coords = newCoords;
    }
    fight(target) {
        if (target.hasItem('sword')) {
            target.client.send('You have killed the enemy.');
            this.dead = true;
        }
        else {
            target.client.send('lose');
            target.dead = true;
        }
    }
    checkAreaPlayer() {
        for (let client of clients) {
            if (client.player.getCoords().x == this.getCoords().x && client.player.getCoords().y == this.getCoords().y) {
                this.fight(client.player);
            }
        }
    }
}
class Player extends app_1.Entity {
    constructor(coords, socket) {
        super(coords, 'player');
        this.dead = false;
        this.lastSeenHazard = '';
        this.inventory = [];
        this.client = socket;
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
        if (this.checkAdvanceArea(newCoords)) {
            this.lastSeenHazard = '';
            this.coords = newCoords;
            this.look();
        }
    }
    checkAdvanceArea(coords) {
        if (coords.x > map.border || coords.y > map.border || coords.x < 0 || coords.y < 0) {
            this.client.send('You cannot pass the wall.');
            return false;
        }
        else {
            for (let entity of map.getEntities()) {
                if (entity.getCoords().x == coords.x && entity.getCoords().y == coords.y) {
                    if (entity instanceof app_1.HazardEntity) {
                        this.client.send(entity.name + ' is blocking the way.');
                        this.lastSeenHazard = entity.name;
                        if (entity instanceof Enemy) {
                            entity.fight(this);
                        }
                        return false;
                    }
                }
            }
        }
        return true;
    }
    take(item) {
        for (let entity of map.getEntities()) {
            if (entity instanceof app_1.ItemEntity && entity.name == item) {
                if (this.getCoords().x == entity.getCoords().x && this.getCoords().y == entity.getCoords().y) {
                    this.client.send('Taken ' + entity.name);
                    this.inventory.push({ itemName: entity.itemName, usedOn: entity.usedOn });
                    map.removeEntity(entity);
                    return;
                }
            }
        }
        this.client.send(item + ' is nowhere to be seen.');
    }
    use(item) {
        for (let inventoryItem of this.inventory) {
            if (inventoryItem.itemName == item) {
                for (let entity of map.getEntities()) {
                    if (entity.name == inventoryItem.usedOn && inventoryItem.usedOn == this.lastSeenHazard) {
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
    removeItem(item) {
        _.pull(this.inventory, item);
    }
    openInventory() {
        if (this.inventory.length == 0) {
            this.client.send('Inventory is empty.');
        }
        else {
            this.client.send('Inventory: ');
            for (let item of this.inventory) {
                this.client.send(item.itemName + ' ');
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
    look() {
        this.client.send('Your Location: (x)' + this.getCoords().x + ' (y)' + this.getCoords().y);
        for (let entity of map.getEntities()) {
            if (this.getCoords().x == entity.getCoords().x && this.getCoords().y == entity.getCoords().y) {
                this.client.send(entity.name + ' is in this area.');
                return;
            }
        }
        this.client.send('This area has nothing interesting.');
    }
}
class PlayerClient {
    constructor(socket) {
        this.socket = socket;
        this.player = new Player(map.playerSpawn, socket);
    }
    interpretRequest(message) {
        if (message.includes(',')) {
            let cmd = message.split(',')[0];
            let arg = message.split(',')[1];
            if (cmd == 'go') {
                this.player.move(arg);
            }
            else if (cmd == 'take') {
                this.player.take(arg);
            }
            else if (cmd == 'use') {
                this.player.use(arg);
            }
        }
        else if (message.includes('look')) {
            this.player.look();
        }
        else if (message.includes('inventory')) {
            this.player.openInventory();
        }
    }
}
let mapData = map_json_1.default;
let map = new Map(mapData);
let PORT = 8080;
let server = new ws_1.default.Server({ port: PORT });
console.log(`Started new WebSocket server on ${PORT}`);
let clients = [];
server.on('connection', (client) => {
    console.log("Log: new connection!");
    let playerClient = new PlayerClient(client);
    clients.push(playerClient);
    client.send('Input a command:');
    client.on('message', (message) => {
        console.log(`RECEIVED COMMAND: ${message}`);
        playerClient.interpretRequest(message);
    });
});
//# sourceMappingURL=Server.js.map
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
const lodash = __importStar(require("lodash"));
const map_json_1 = __importDefault(require("./map.json"));
let _ = lodash;
class Game {
    handleInput(cmd, arg) {
        console.log("Handling", cmd, "with argument '" + arg + "'");
        arg = arg.toLowerCase();
        if (cmd === Parser_1.Command.GO) {
            player.move(arg);
        }
        else if (cmd === Parser_1.Command.TAKE) {
            player.take(arg);
        }
        else if (cmd === Parser_1.Command.USE) {
            player.use(arg);
        }
        else if (cmd === Parser_1.Command.LOOK) {
            player.look();
        }
        else if (cmd === Parser_1.Command.INVENTORY) {
            player.openInventory();
        }
        if (!enemy.dead) {
            enemy.chase(player);
        }
        this.showLocations();
        return !this.gameEnded(); //return true to indicate that it should prompt for another input
    }
    showLocations() {
        console.log('============================');
        console.log('Player Location: (x)' + player.getCoords().x + ' (y)' + player.getCoords().y);
        if (!enemy.dead) {
            console.log('Enemy Location: (x)' + enemy.getCoords().x + ' (y)' + enemy.getCoords().y);
        }
        console.log('============================');
    }
    gameEnded() {
        if (player.dead) {
            console.log('(Lost) You Died!');
            return true;
        }
        if (player.getCoords().x == map.exit.x && player.getCoords().y == map.exit.y && player.hasItem('treasure')) {
            console.log('(Win) Congrats, you escaped!');
            return true;
        }
        return false;
    }
    start() {
        let parser = new Parser_1.CommandParser(this.handleInput); //pass in the "handler" callback
        console.log('Input a command:');
        parser.start();
    }
}
class Entity {
    constructor(coords, name) {
        this.coords = coords;
        this.name = name;
    }
    getCoords() {
        return this.coords;
    }
}
class ItemEntity extends Entity {
    constructor(coords, name, usedOn) {
        super(coords, name);
        this.itemName = name;
        this.usedOn = usedOn;
    }
}
class HazardEntity extends Entity {
    constructor(coords, name) {
        super(coords, name);
    }
}
class Map {
    constructor(mapData) {
        this.entities = [];
        this.border = mapData.border;
        this.exit = mapData.exit;
        this.entities.push(new ItemEntity(mapData.key, 'key', 'door'));
        this.entities.push(new ItemEntity(mapData.potion, 'potion', 'acid'));
        this.entities.push(new ItemEntity(mapData.sword, 'sword', 'enemy'));
        this.entities.push(new ItemEntity(mapData.treasure, 'treasure', 'exit'));
        this.entities.push(new HazardEntity(mapData.acid, 'acid'));
        this.entities.push(new HazardEntity(mapData.door, 'door'));
    }
    getEntities() {
        return this.entities;
    }
    removeEntity(entity) {
        _.pull(this.entities, entity);
    }
}
class Enemy extends HazardEntity {
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
    fight() {
        if (player.hasItem('sword')) {
            console.log('You have killed the enemy.');
            this.dead = true;
        }
        else {
            player.dead = true;
        }
    }
    foundTarget(target) {
        if (target.getCoords().x == this.getCoords().x && target.getCoords().y == this.getCoords().y) {
            this.fight();
        }
    }
}
class Player extends Entity {
    constructor(coords) {
        super(coords, 'player');
        this.dead = false;
        this.lastSeenHazard = '';
        this.inventory = [];
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
            console.log('You cannot pass the wall.');
            return false;
        }
        else {
            for (let entity of map.getEntities()) {
                if (entity.getCoords().x == coords.x && entity.getCoords().y == coords.y) {
                    if (entity instanceof HazardEntity) {
                        console.log(entity.name + ' is blocking the way.');
                        this.lastSeenHazard = entity.name;
                        if (entity instanceof Enemy) {
                            enemy.fight();
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
            if (entity instanceof ItemEntity && entity.name == item) {
                if (player.getCoords().x == entity.getCoords().x && player.getCoords().y == entity.getCoords().y) {
                    console.log('Taken ' + entity.name);
                    this.inventory.push({ itemName: entity.itemName, usedOn: entity.usedOn });
                    map.removeEntity(entity);
                    return;
                }
            }
        }
        console.log(item + ' is nowhere to be seen.');
    }
    use(item) {
        for (let inventoryItem of this.inventory) {
            if (inventoryItem.itemName == item) {
                for (let entity of map.getEntities()) {
                    if (entity.name == inventoryItem.usedOn && inventoryItem.usedOn == this.lastSeenHazard) {
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
    look() {
        for (let entity of map.getEntities()) {
            if (player.getCoords().x == entity.getCoords().x && player.getCoords().y == entity.getCoords().y) {
                console.log(entity.name + ' is in this area.');
                return;
            }
        }
        console.log('This area has nothing interesting.');
    }
}
let mapData = map_json_1.default;
let map = new Map(mapData);
let player = new Player(mapData.player);
let enemy = new Enemy(mapData.enemy);
let gameInstance = new Game();
gameInstance.start();
//# sourceMappingURL=app.js.map
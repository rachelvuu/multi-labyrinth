"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Area_1 = require("./Area");
const Item_1 = require("./Item");
const Roads_1 = require("./Roads");
const Hazard_1 = require("./Hazard");
const Monster_1 = require("./Monster");
class Westeros {
    constructor() {
        this.data = require('../src/Westeros.json');
        this.houses = this.makeHouse();
        this.makeRoads();
        this.introduction = this.data.Introduction;
    }
    getExit() {
        return this.houses.get(this.data.Exit);
    }
    getStart() {
        return this.houses.get(this.data.Start);
    }
    removeItemArea(house) {
        let curentHouse = this.houses.get(house);
        curentHouse.removeItem();
        if (curentHouse !== undefined) {
            this.houses.set(house, curentHouse);
        }
    }
    makeMonster() {
        let monster = this.data.Monster;
        let housesArea = this.houses.get(monster.locationNow);
        return new Monster_1.Monster(monster.name, new Item_1.Item(monster.itemToDestroy), housesArea);
    }
    makeHouse() {
        let setHouse = new Map();
        for (let i = 0; i < this.data.Westeros.length; i++) {
            let area;
            let currentAreaJSON = this.data.Westeros[i];
            let id = currentAreaJSON.House;
            let areaTitle = currentAreaJSON.title;
            let areaDesc = currentAreaJSON.description;
            let item = new Item_1.Item(currentAreaJSON.item);
            let roadsJSON = currentAreaJSON.Roads;
            let roads = new Map();
            setHouse.set(id, new Area_1.Area(id, areaTitle, areaDesc, item, roads));
        }
        return setHouse;
    }
    makeRoads() {
        for (let i = 0; i < this.data.Westeros.length; i++) {
            let currentAreaJSON = this.data.Westeros[i];
            let roadsJSON = currentAreaJSON.Roads;
            let roads = new Map();
            for (let j = 0; j < roadsJSON.length; j++) {
                let roadNowDestination = this.houses.get(roadsJSON[j].Destination);
                let direction = roadsJSON[j].Direction;
                let title = roadsJSON[j].Title;
                let hazard = roadsJSON[j].Hazard;
                roads.set(direction, new Roads_1.Roads(title, direction, roadNowDestination, new Hazard_1.Hazard(hazard.Description, new Item_1.Item(hazard.itemReq))));
            }
            let id = currentAreaJSON.House;
            this.houses.get(id).setRoads(roads);
        }
    }
    getWin() {
        return new Item_1.Item(this.data.WinItem);
    }
    getHouses() {
        return new Map(this.houses);
    }
    getIntro() {
        return this.introduction;
    }
}
exports.Westeros = Westeros;
//# sourceMappingURL=jSONToCard.js.map
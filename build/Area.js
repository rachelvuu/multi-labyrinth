"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = require("./Item");
class Area {
    constructor(house = "", title = "", description = "", itemFound = new Item_1.Item("Nothing"), directions = new Map()) {
        this.house = house;
        this.title = title;
        this.description = description;
        this.directions = directions;
        this.itemFound = itemFound;
    }
    getTitle() {
        return this.title;
    }
    getDescription() {
        return this.description;
    }
    getDirections() {
        return this.directions;
    }
    getItem() {
        return this.itemFound;
    }
    getValidDirections() {
        return this.directions.keys();
    }
    curentHouse() {
        this.house;
    }
    getRoad(area) {
        return this.directions.get(area);
    }
    setRoads(roads) {
        this.directions = roads;
    }
    getDestination(direction) {
        return this.directions.get(direction).getDestination();
    }
    getItemTitle() {
        return this.itemFound.getTitle();
    }
    validDirection(direction) {
        let val = false;
        this.directions.forEach((value, key) => {
            if (key == direction) {
                val = true;
            }
        });
        return val;
    }
    getHouse() {
        return this.house;
    }
    removeItem() {
        this.itemFound = new Item_1.Item("");
    }
    equals(e) {
        return e.house == this.house;
    }
    displayArea() {
        console.log(this.title);
        console.log(this.description);
        console.log("In this kingdom you can find: " + this.itemFound.getTitle());
        console.log();
    }
}
exports.Area = Area;
//# sourceMappingURL=Area.js.map
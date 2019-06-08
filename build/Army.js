"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Area_1 = require("./Area");
class Army {
    constructor(currentLocation = new Area_1.Area("", "", ""), armyStats = new Set(), id = Math.random()) {
        this.armyStats = armyStats;
        this.id = id;
        this.currentLocation = currentLocation;
    }
    getId() {
        return this.id;
    }
    getLocation() {
        return this.currentLocation;
    }
    getLocationName() {
        return this.currentLocation.getHouse();
    }
    myArmyStats() {
        return this.armyStats;
    }
    addToArmy(newItem) {
        this.armyStats.add(newItem);
    }
    hasItem(item) {
        for (let cu of this.armyStats) {
            if (item.getTitle() == cu.getTitle()) {
                return true;
            }
        }
        return false;
    }
    getHouse() {
        return this.currentLocation.getHouse();
    }
    removeItem(item) {
        this.armyStats.forEach(element => {
            if (element.equals(item)) {
                this.armyStats.delete(element);
            }
        });
    }
    getValidDirection(arg) {
        return this.currentLocation.validDirection(arg);
    }
    getRoad(arg) {
        return this.currentLocation.getRoad(arg);
    }
    displayDetails() {
        this.currentLocation.displayArea();
    }
    changeArea(area) {
        this.currentLocation = area;
    }
    showArmy() {
        console.log("You have : ");
        for (let item of this.armyStats) {
            console.log(item.getTitle());
        }
    }
    removeItemArea() {
        this.currentLocation.removeItem();
    }
    getItemTitle() {
        return this.currentLocation.getItemTitle();
    }
}
exports.Army = Army;
//# sourceMappingURL=Army.js.map
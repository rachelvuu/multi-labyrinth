"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Area_1 = require("./Area");
class Monster {
    constructor(name, itemDestroy, locationNow = new Area_1.Area("", "", "")) {
        this.name = name;
        this.itemDestroy = itemDestroy;
        this.currentLocation = locationNow;
    }
    getTitle() {
        return this.name;
    }
    getMonsterItem() {
        return this.itemDestroy;
    }
    getMonsterItemTitle() {
        return this.itemDestroy.getTitle();
    }
    changeMonsterMove() {
        let validDirecions = this.currentLocation.getDirections();
        let keys = Array.from(validDirecions.keys());
        let i = 0;
        let rand = Math.floor(Math.random() * keys.length);
        for (let item of keys) {
            //0 is added for testing
            if (i === 0) {
                let finalDestination = validDirecions.get(item).getDestination();
                this.currentLocation = finalDestination;
                return;
            }
            i++;
        }
    }
    changeArea(area) {
        this.currentLocation = area;
    }
    getLocation() {
        return this.currentLocation;
    }
}
exports.Monster = Monster;
//# sourceMappingURL=Monster.js.map
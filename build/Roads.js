"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Area_1 = require("./Area");
const Hazard_1 = require("./Hazard");
const Item_1 = require("./Item");
class Roads {
    constructor(title, direction, endingPoint = new Area_1.Area(), price = new Hazard_1.Hazard("Nothing", new Item_1.Item("Nothing"))) {
        this.ending = endingPoint;
        this.title = title;
        this.direction = direction;
        this.price = price;
    }
    getDestination() {
        return this.ending;
    }
    getTitle() {
        return this.title;
    }
    getHazard() {
        return this.price;
    }
    getPrice() {
        return this.price;
    }
}
exports.Roads = Roads;
//# sourceMappingURL=Roads.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Item {
    constructor(title) {
        this.title = title;
    }
    getTitle() {
        return this.title;
    }
    equals(Item2) {
        console.log(this.title == Item2.getTitle());
        console.log(this.title);
        console.log(Item2.getTitle());
        return this.title == Item2.getTitle();
    }
    isEmpty() {
        if (this.title == "") {
            return true;
        }
        return false;
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map
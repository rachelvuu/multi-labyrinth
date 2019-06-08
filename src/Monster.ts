import {Item} from "./Item";
import {Area} from "./Area";
import {Moveable} from "./moveable";

export class Monster implements Moveable {
    name : String;
    itemDestroy : Item;
    currentLocation : Area;

    constructor(name : String, itemDestroy : Item , locationNow : Area = new Area("","","")){
        this.name = name;
        this.itemDestroy = itemDestroy;
        this.currentLocation = locationNow;
    }

    getTitle(){
        return this.name;
    }

    getMonsterItem(){
        return this.itemDestroy;
    }

    getMonsterItemTitle() :String{
        return this.itemDestroy.getTitle();
    }

    changeMonsterMove(){
        let validDirecions = this.currentLocation.getDirections();
        let keys = Array.from(validDirecions.keys());
        let i = 0;
        let rand = Math.floor(Math.random() * keys.length);
        for(let item of keys){
            //0 is added for testing
            if(i === 0){
                let finalDestination = 
                validDirecions.get(item)!.getDestination();
                this.currentLocation= finalDestination ;
                return ;
            }
            i++;
        }
    }

    changeArea(area : Area){
        this.currentLocation = area;
    }

    getLocation(){
        return this.currentLocation;
    }
}
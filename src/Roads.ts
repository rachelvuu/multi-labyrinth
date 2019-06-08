import { Area } from './Area';
import { Hazard } from './Hazard';
import {Item} from "./Item";

interface RoadCharacteristics {
    ending : Area;
    title : String;
    price : Hazard;
    direction :String;
    
    getDestination() : Area ;
    getTitle() :  String;
    getHazard() :Hazard ;
}

export class Roads implements RoadCharacteristics { 
    ending: Area;
    title: String;
    direction : String;
    price: Hazard;

    constructor( title :String , direction : String , endingPoint : Area = new Area(), price : Hazard = new Hazard("Nothing", new Item("Nothing")) ){
        this.ending = endingPoint;
        this.title = title;
        this.direction = direction;
        this.price = price;
    }

    getDestination() : Area {
        return this.ending;
    }

    getTitle() :  String{
        return this.title;
    }

    getHazard() :Hazard {
        return this.price;
    }

    getPrice() {
        return this.price;
    }

    
}
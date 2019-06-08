import { Roads } from "./Roads";
import {Item} from "./Item";
import { throws } from "assert";


interface AreaCharacteristics{
    title: String;
    description : String;
    directions :  Map<String , Roads>;
    itemFound : Item;
}

export class Area implements AreaCharacteristics{
    public house : String;
    public title: String;    
    public description: String;
    public directions: Map<String , Roads>;
    public itemFound : Item;

    constructor (house : String= "" , title: String ="", description : String ="",  itemFound : Item = new Item("Nothing") , directions : Map<String , Roads> = new Map<String , Roads>()) {
        this.house = house;
        this.title = title;
        this.description = description;
        this.directions= directions;
        this.itemFound = itemFound;
    }
    
    public getTitle() :  String {
        return this.title;
    }

    public getDescription() :  String{
        return this.description;
    }

    public getDirections() {
        return this.directions;
    }

    public getItem(){
        return this.itemFound;
    }

    public getValidDirections(){
        return this.directions.keys();
    }

    public curentHouse(){
        this.house;
    }

    public getRoad(area :String){
        return this.directions.get(area); 
    }

    public setRoads(roads : Map<String, Roads>){
        this.directions = roads;
    }

    public getDestination(direction:String){
        return this.directions.get(direction)!.getDestination();
    }

    public getItemTitle() : String{
        return this.itemFound.getTitle();
    }

    public validDirection( direction: String){
        let val = false;
        this.directions.forEach((value: Roads, key: String) => {
            if(key == direction){
                val = true;
            }
        });
        return val;
    }

    public getHouse(){
        return this.house;
    }
    public removeItem(){
        this.itemFound = new Item("");
    }

    equals(e : Area){
        return e.house == this.house;
    }

    displayArea(){
        console.log(this.title);
        console.log(this.description);
        console.log("In this kingdom you can find: "+ this.itemFound.getTitle());
        console.log();
    }

    
}


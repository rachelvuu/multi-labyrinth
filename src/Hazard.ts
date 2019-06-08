import {Item} from "./Item";

interface HazardCharacteristics{
    title : String;
    itemToCross : Item;
}

export class Hazard implements HazardCharacteristics {
    public title: String;    
    public itemToCross: Item;

    constructor( title : String , item : Item){
        this.title = title;
        this.itemToCross = item;
    }

    public getTitle(){
        return this.title;
    }

    public getItemToCross(){
        return this.itemToCross;
    }
}
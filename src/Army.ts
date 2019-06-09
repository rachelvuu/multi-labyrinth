import { Area } from "./Area";
import {Item} from "./Item";
import { Roads } from "./Roads";
import {Moveable} from "./moveable";



export class Army implements Moveable{
    
    id : number;
    currentLocation: Area;
    public armyStats : Set<Item>;

    constructor(id:number = Math.random(), currentLocation : Area = new Area("","","")  , armyStats : Set<Item> = new Set<Item>()) {
        this.armyStats = armyStats;
        this.id = id;
        this.currentLocation = currentLocation;
    }

    equals(army : Army){
         army.getId() == this.id;
    }

    getId(): number{
        return this.id;
    }

    getLocation() :Area {
        return this.currentLocation;
    }

    getLocationName(){
        return this.currentLocation.getHouse();
    }

    myArmyStats(){
        return this.armyStats;
    }

    addToArmy( newItem : Item){
        this.armyStats.add(newItem);
    }

    hasItem(item : Item){
        for (let cu of this.armyStats) {
            if(item.getTitle() == cu.getTitle()){
                return true;
            }
        }
        return false;
    }

    getHouse() : String {
        return this.currentLocation.getHouse();
    }

    removeItem(item : Item){
        this.armyStats.forEach(element => {
            if(element.equals(item) ){
                this.armyStats.delete(element);
            }
        });
    }
    
    getValidDirection(arg : String): boolean{
       return this.currentLocation.validDirection(arg);
    }

    getRoad(arg : String): Roads| undefined{
        return this.currentLocation.getRoad(arg);
    }

    displayDetails(): void {
        this.currentLocation.displayArea()
    }


    changeArea(area :Area){
        this.currentLocation = area;
    }

    showArmy(){
        console.log("You have : ")
        for (let item of this.armyStats) {
            console.log(item.getTitle()); 
        }
    }

    removeItemArea(){
        this.currentLocation.removeItem();
    }

    getItemTitle() : String{
        return this.currentLocation.getItemTitle();
    }

}



import { Area } from "./Area";
import {Item} from "./Item";
import {Roads} from "./Roads";
import { Hazard } from "./Hazard";
import { Monster } from "./Monster";

export class Westeros{

    data: any ;
    introduction :String;
    houses : Map<String,Area>;
    constructor(){
        this.data = require('../src/Westeros.json');
        this.houses = this.makeHouse();
        this.makeRoads();
        this.introduction = this.data.Introduction;
    }

    getExit(){
        return this.houses.get(this.data.Exit);
    }

    getStart(){
        return this.houses.get(this.data.Start);
    }

    removeItemArea(house : String){
        let curentHouse = this.houses.get(house);
        curentHouse!.removeItem();
        if(curentHouse !== undefined){
            this.houses.set(house, curentHouse );
        }
        
    }

    makeMonster(){
        let monster = this.data.Monster;
        let housesArea = this.houses.get(monster.locationNow)
        return new Monster(monster.name, new Item(monster.itemToDestroy) ,housesArea );
    }

    makeHouse(){
        let setHouse = new Map<String, Area>();
        for(let i =0 ; i < this.data.Westeros.length ; i++){
            let area;
            let currentAreaJSON = this.data.Westeros[i];
            let id = currentAreaJSON.House;
            let areaTitle = currentAreaJSON.title;
            let areaDesc  = currentAreaJSON.description;
            let item = new Item(currentAreaJSON.item);
            let roadsJSON = currentAreaJSON.Roads;
            let roads = new Map<String, Roads>();
            setHouse.set( id, new Area(id, areaTitle , areaDesc , item , roads));
        }
        return setHouse;
    }
 
    makeRoads(){
        for(let i =0 ; i < this.data.Westeros.length ; i++){
            let currentAreaJSON = this.data.Westeros[i];
            let roadsJSON = currentAreaJSON.Roads;
            let roads = new Map<String, Roads>();
            for( let j =0 ; j< roadsJSON.length; j++){
                let roadNowDestination = this.houses.get(roadsJSON[j].Destination);
                let direction = roadsJSON[j].Direction;
                let title = roadsJSON[j].Title;
                let hazard = roadsJSON[j].Hazard;
                roads.set(direction,new Roads( title , direction,roadNowDestination,new Hazard(hazard.Description , new Item(hazard.itemReq))));
            }
            let id = currentAreaJSON.House;
            this.houses.get(id)!.setRoads(roads);
        }
    }

    getWin(){
        return new Item(this.data.WinItem);
    }

    getHouses(){
        return new Map<String,Area>(this.houses);
    }

    getIntro(){
        return this.introduction;
    }
}



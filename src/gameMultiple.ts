import { Roads } from "./Roads";
import {Item} from "./Item";
import {Area} from "./Area";
import { Army } from "./Army";
import {Monster} from "./Monster";
import { WesterosWorld } from "./jSONToCard";



export class MultiPlayerGame {
    
    world : WesterosWorld;
    players : Set< Army>;
    monster: Monster;
    areas: Map<String, Area>;
    areaList: Set<String>;

    constructor(){
        this.world = new WesterosWorld();
        this.players = new Set<Army>();
        this.monster = this.world.makeMonster();
        this.areas = this.world.getHouses();
        this.areaList = new Set<String>(this.areas.keys());
        
    }

    addPlayer(id: number){
        this.players = this.players.add(new Army(this.getRandomStartingPlace(), id));
    }

    getPlayer(id : Number) : Army| undefined{
        this.players.forEach(element => {
            if(element.getId() === id){
                return element;
            }
        });
        console.log("ID doesn't exists")
        return undefined;
    }

    modifyWorld( world : WesterosWorld){
        this.world = world;
    }

    getRandomStartingPlace(): any {
        // Make a random starter Removed for testing
        let randomIndex = Math.floor( Math.random() * this.areaList.size );
        let i = 0;
        for (let currentArea of this.areaList) {
            if (i == randomIndex) {
                return this.areas.get(currentArea)
            }
            i++;
        }
        return undefined;
        // For predicatble behavior
        /*let area = this.westerosWords.getStart() ? (this.westerosWords.getStart() ) : new Area();
        return(area);*/
    }

}

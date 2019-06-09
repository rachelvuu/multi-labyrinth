import { Roads } from "./Roads";
import {Item} from "./Item";
import {Area} from "./Area";
import { Army } from "./Army";
import {Monster} from "./Monster";
import { Westeros } from "./jSONToCard";



export class MultiPlayerGame {
    
    world : Westeros;
    players : Set< Army>;

    constructor(){
        this.world = new Westeros();
        this.players = new Set<Army>();
    }

    addPlayer(id: number){
        this.players = this.players.add(new Army(id));
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

    modifyWorld( world : Westeros){
        this.world = world;
    }

}

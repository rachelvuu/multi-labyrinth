import { Roads } from "./Roads";
import {Item} from "./Item";
import {Area} from "./Area";
import { Army } from "./Army";
import {Monster} from "./Monster";
import { Westeros } from "./jSONToCard";



export class MultiPlayerGame {
    
    world : Westeros;
    players : Map<String, Army>;

    constructor(){
        this.world = new Westeros();
        this.players = new Map<String,Army>();
    }

    addPlayer(id: String){
        this.players = this.players.set(id, new Army());
    }

    getPlayer(id : String) : Army| undefined{
        return this.players.get(id);
    }

    modifyWorld( world : Westeros){
        this.world = world;
    }

}

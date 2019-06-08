import {Area} from "./Area";
import {Roads} from "./Roads";
import {Hazard} from "./Hazard";
import {Item} from "./Item";

export class Westeros{
    
    houseLanister :Area;
    houseTyrell :Area ;
    houseBoratheon : Area ; 
    houseMartell: Area;
    houseArryn: Area ;
    houseTargaryn : Area ;
    houseStark: Area;
    houseTully : Area;
    westeros : Map<String, Area>;



    constructor(){
        this.westeros = new Map<String, Area>();
        this.houseLanister = this.makeLannister();
        this.houseTyrell = this.makeReach();
        this.houseBoratheon  = this.makeStormlands();
        this.houseMartell = this.makeDorne();
        this.houseArryn = this.makeEyrie();
        this.houseTargaryn = this.makeKingsLanding();
        this.houseStark= this.makeNorth();
        this.houseTully  = this.makeReverside();
        this.addRoads();
        
    }

    addRoads(){
        
    }


    makeLannister(){
        let lannisterTitle = "House Lannister of Casterly Rock";
        let lannisterDescription = "\n \n House Lannister of Casterly Rock is one of \n the Great Houses of Seven Kingdoms, and the principal house of the \n westerlands. Their seat is Casterly Rock, though another branch    \n exists that is based in nearby Lannisport.Their sigil is a golden lion  \n on a field of crimson \n \n The westerlands have the Reach to the South and The Riverlands to East";
        let lannisterItem = new Item("Gold Coins");

        return new Area("Lannister",lannisterTitle , lannisterDescription , lannisterItem );
    }

    makeReach(){
        let tyrellTitle : String = "House Tyrell of the Reach";
        let tyrellDescription :String  = "\n \nHouse Tyrell of Highgarden is an extinct Great House of Westeros. \nIt ruled over the Reach, a vast, fertile, \n and heavily-populated region of southwestern Westeros, \nfrom their castle-seat of Highgarden as Lords Paramount of the Reach and Wardens of \n the South. \n They have House Lannister to the North and Kinglandding to West"
        let tyrellItem :Item = new Item("Food");
        return new Area("",tyrellTitle , tyrellDescription , tyrellItem);
    }

    makeStormlands(){
        let title : String =  "House Boratheon of the Stormlands";
        let description =  "\n \n House Baratheon of Storm's End is one of the Great Houses of Westeros, \n and is the principal house in the stormlands, which they rule as Lords\n Paramount of the Stormlands. \n Their seat, Storm's End, is an ancient castle raised by the Storm Kings\n They have the Just Dorne to the South";
        return new Area("",title , description);
    }

    makeKingsLanding(){
        let title : String =  "The Capital";
        let description =  "\n \n King's Landing is the capital, and largest city, of the Seven Kingdoms.\n Located on the east coast of Westeros in the Crownlands, just north of \nwhere the Blackwater Rush flows into Blackwater Bay and overlooking Blackwater Bay,\n King's Landing is the site of the Iron Throne and \nthe Red Keep, the seat of the King of the Andals and the First Men.\n Since it centrally located their lies the Riversides to the North , the Reach to the West and StormLands to the South"

        return new Area("",title , description);
    }

    makeDorne(){
        let title : String =  "House Martell";
        let description =  "\n \n House Martell of Sunspear is a legally extinct Great House of Westeros. \nIt ruled the peninsula of Dorne in the far south of the continent from their castle Sunspear. The Have the stormlands to the North"
        return new Area("",title , description );
    }


    makeReverside(){
        let title : String =  "House Tully";
        let description =  "\n \n House Tully of Riverrun is a deposed Great House of Westeros. Its most senior member carried the title of Lord of Riverrun and Lord Paramount of the Trident, until the Red Wedding. The current head is Lord Edmure Tully, son of the late Hoster Tully. The Tully sigil is a silver trout on a red and blue background. Their house words are Family, Duty, Honor. \n Centerally located they have The North to the NORTH, The Eyrie to the EAST , Westerlands to the WEST and KingsLanding to the South"
        let item :Item = new Item("Horses");
        return new Area("",title , description , item);
    }

    makeEyrie(){
        let title : String =  "House Arryn";
        let description =  "\n \n House Arryn of the Eyrie is one of the Great Houses of Westeros. It has ruled over the \nVale of Arryn for millennia, originally as the Kings of Mountain \nand Vale and more recently as Defenders of the Vale and Wardens of \nthe East under the Targaryen, Baratheon, and Lannister dynasties. \n Being isolated, The are only connected by the Riverlands by House Tully to their West"
        let item :Item = new Item("Clothes");
        return new Area("",title , description , item);
    }

    makeNorth(){
        let title : String =  "House Stark";
        let description =  "\n \n House Stark of Winterfell is one of the Great Houses of Westeros and the principal noble house of the north. In days of old they ruled as Kings of Winter, but since Aegon's Conquest they have been Wardens of the North and ruled as Lords of Winterfell. Their seat, Winterfell, is an ancient castle renowned for its strength.\n Being isolated, The are only connected by the Riverlands by House Tully to their South"
        let item = new Item("Dragons");
        return new Area("",title , description , item);
    }

    getWesteros() : Set<Area>{
        let westeros = new Set<Area>();
        westeros.add(this.houseLanister );
        westeros.add(this.houseTyrell);
        westeros.add(this.houseBoratheon) ; 
        westeros.add(this.houseMartell);
        westeros.add(this.houseArryn) ;
        westeros.add(this.houseTargaryn) ;
        westeros.add(this.houseStark);
        westeros.add(this.houseTully);
        return westeros;
    }


}







export class Item  {

    protected title : String;
    
    constructor( title : String  ){
        this.title =  title;   
    }

    getTitle(): String {
        return this.title;
    }

    equals(Item2 :Item) : Boolean {
        console.log(this.title == Item2.getTitle());
        console.log(this.title );
        console.log(Item2.getTitle());
        return this.title == Item2.getTitle();
    }

    isEmpty(){
        if(this.title == ""){
            return true;
        }
        return false;
    }
}


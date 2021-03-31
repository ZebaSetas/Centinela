export class Environment {    
    name: string;
    keyConnection: string;
    id: number;

    constructor(id: number, name: string) {
        this.name = name;
        this.id = id;        
    }
}
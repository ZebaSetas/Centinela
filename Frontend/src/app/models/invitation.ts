export class Invitation {
    name:string;
    email: string;    
    role:number;

    constructor(name:string, email: string, role:number) {
        this.name = name;
        this.email = email;        
        this.role = role;
    }
}
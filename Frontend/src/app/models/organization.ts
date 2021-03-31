import { User } from './user';

export class Organization {
    
    id: number;
    name: string;
    //users: Array<NbUser>;
    user: User;

    constructor(name:string, user: User) {
        this.name = name;
        //this.users = new Array<NbUser>();
        //this.users.push(user);
        this.user = user;
    }    
}

import {State} from './state';
import { UserToList } from './user-to-list';
import { Environment } from './environment';
import { System } from './system';
import { stat } from 'fs';
import { Organization } from './organization';
import { environment } from '../../environments/environment.prod';
import { NbUser } from '@nebular/auth';

export class Bug {
    id: number;
    title: string;
    description:  string;
    severity: number;     
    environmentId:number;
    state: State;        
    systemId:number;        
    stateId:number;
    userId:number;
    constructor(id: number, title: string, description: string, severity: number, state: State, systemId:number,environmentId:number, userId:number){
        this.id = id;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.state = state;                    
        this.systemId = systemId;                        
        this.environmentId = environmentId;
        this.userId = userId;
        this.stateId = state.id
    }
}


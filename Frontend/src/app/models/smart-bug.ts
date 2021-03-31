import { Bug } from './bug';
import { State } from './state';

export class SmartBug {
    id: number;
    numberBug:string;
    title: string;
    severity: number;
    developer: string;
    stateId: number;
    state: string;
    system: string;
    environment: string;
    description: string;
    systemId: number;
    organizationId: number;
    userId: number;
    environmentId: number;
    constructor(bug:Bug) {
        this.id = bug.id;
        this.stateId = bug.state.id;
        this.description = bug.description;
        this.systemId = bug.systemId;
        this.environmentId = bug.environmentId;
        this.userId = bug.userId;
        this.numberBug = "#"+bug.id;
        if(bug.title!=null) {
            this.title = bug.title.substring(0,30);
            if(bug.title.length>20) {
                this.title += "...";
            }
        }
        this.severity = bug.severity;
        if(bug.state!=null) {
            this.state = bug.state.value;
        }
        if(bug.userId != null) {
            var users = JSON.parse(localStorage.getItem('users'));
            if(users) {
                var user;
                users.forEach(element => {
                    if(element.id===bug.userId) {
                        user=element;
                    }
                });
                if(user) this.developer = user.name.substring(0, 30);
                if(user.name.length > 30) {
                    this.developer += "...";
                }
            }
        }
        else
            this.developer = '';
        
        if(bug.systemId!=null) {
            var systems = JSON.parse(localStorage.getItem('systems'));
            var system;
            systems.forEach(element => {
                if(element.id===bug.systemId) {
                    system=element;
                }
            });
            if(system) {
                this.system = system.name.substring(0,30);
                if(system.name.length > 30) {
                    this.system += "...";
                }
                if(bug.environmentId!=null) {
                    var environment;
                    if(system.environments) {                            
                        var envs = system.environments
                        envs.forEach(env => {
                            if(env.id === bug.environmentId) {
                                environment=env;
                            }
                        });     
                        if(environment) this.environment = environment.name;
                    }
                }
            }
        }
    }

    toModel():Bug{
        var state = new State(this.stateId, this.state);    
        return new Bug(this.id, this.title,this.description, this.severity, state, this.systemId, 
            this.environmentId, this.userId)
    }
}

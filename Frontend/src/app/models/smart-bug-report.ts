import { Bug } from './bug';
import { State } from './state';

export class SmartBugReport {    
    id: number;    
    numberBug: string;
    title: string;    
    severity: number;   
    system: string;
    environment:string;
    description:string;               
    systemId: number;    
    environmentId: number;

    constructor(bug: any) {
        this.id = bug.foreignId;
        this.description = bug.description;
        this.systemId = bug.system.foreignId;
        this.environmentId = bug.environment.foreignId;
        this.numberBug = "#" + bug.foreignId;
        if(bug.title!=null) {
            this.title = bug.title.substring(0,30);
            if(bug.title.length > 20) {
                this.title += "...";
            }
        }
        this.severity = bug.severity;
        if(bug.system.foreignId != null) {
            var systems = JSON.parse(localStorage.getItem('systems'));
            var system;
            systems.forEach(element => {
                if(element.id === bug.system.foreignId) {
                    system = element;
                }
            });
            if(system) {
                this.system = system.name.substring(0,30);
                if(system.name.length > 30) {
                    this.system += "...";
                }
                if(bug.environment.foreignId != null) {
                    var environment;
                    if(system.environments) {
                        var envs = system.environments;
                        envs.forEach(env => {
                            if(env.id === bug.environment.foreignId) {
                                environment = env;
                            }
                        });
                        if(environment) this.environment = environment.name;
                    }
                }
            }
        }
    }

    toModel(): Bug {
        var state = new State(1, "No resuelto");
        return new Bug(this.id, this.title, this.description, this.severity, state, this.systemId, this.environmentId, null);
    }
}
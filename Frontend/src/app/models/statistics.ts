import {SeverityCounter} from './severity-counter';
import {StateCounter} from './state-counter';


export class Statistics {    
    bySeverity: Array<SeverityCounter>;
    byState:Array<StateCounter>;

    constructor(bySeverity: Array<SeverityCounter>, byState:Array<StateCounter>) {
        this.bySeverity = bySeverity;
        this.byState = byState;        
    }
}
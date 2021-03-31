export class Preference {
    id: number;
    timeHour:number; 
    timeMinute:number;
    severity:number;
    isImmediate:Boolean;
    isEnabled:Boolean
    
    constructor(id: number, timeHour:number, timeMinute:number, severity:number, isImmediate:Boolean, isEnabled:Boolean){        
        this.id = id;
        this.timeHour = timeHour; 
        this.timeMinute = timeMinute;
        this.severity = severity;
        this.isImmediate = isImmediate;
        this.isEnabled = isEnabled
    }
}

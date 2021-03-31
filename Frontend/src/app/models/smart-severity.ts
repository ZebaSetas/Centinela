import { Preference } from './preference';
import { TypeAlert } from './type-alert';

export class SmartSeverity {    
    selector: TypeAlert;
    preference:Preference; 
    
    constructor(selector: TypeAlert, preference:Preference){        
        this.selector = selector;
        this.preference = preference
    }

    setSelector(selector: TypeAlert) {       
        if(selector === TypeAlert.NOT_ALLOW){
            this.preference.isEnabled = false;
        }
        else if (selector === TypeAlert.DIRECT){
            this.preference.isEnabled = true;
            this.preference.isImmediate = true;
        }
        else if (selector === TypeAlert.USER){
            this.preference.isEnabled = true;
            this.preference.isImmediate = false;
        }
        
      }
    
    setPreference(newPreference){
        this.preference.id = newPreference.id;
        this.preference.severity = newPreference.severity;        
        this.preference.timeHour = this.getLocalHout(newPreference.timeHour);
        this.preference.timeMinute = newPreference.timeMinute - (newPreference.timeMinute%10);
        this.preference.isEnabled = newPreference.isEnabled;
        this.preference.isImmediate = newPreference.isImmediate;
        if(!newPreference.isEnabled){
            this.selector = TypeAlert.NOT_ALLOW;
        }
        else if (newPreference.isImmediate){
            this.selector = TypeAlert.DIRECT;
        }
        else{
            this.selector = TypeAlert.USER;
        }
    }

    private getLocalHout(utcHour):number{        
        var localDate = new Date();   
        var diff = localDate.getHours() - localDate.getUTCHours();
        localDate.setHours(diff+utcHour);
        return localDate.getHours();
    }

    setHour(hour:number){
        this.preference.timeHour = hour;
    } 

     setMinuto(minute:number){
        this.preference.timeMinute = minute;
    } 
  
  }

 
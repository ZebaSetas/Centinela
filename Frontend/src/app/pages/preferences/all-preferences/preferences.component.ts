import { Component, OnInit } from '@angular/core';
import { SmartSeverity } from 'app/models/smart-severity';
import { Preference } from '../../../models/preference';
import { PreferenceGeneralOut } from '../../../models/preference-general-out';
import { PreferenceGeneral } from '../../../models/preference-general';
import { NbToastrService } from '@nebular/theme';
import { TypeAlert } from '../../../models/type-alert';
import {PreferenceService} from '../../../services/preference.service';
import { CentinelaToast } from '../../utils/centinela-toast';

@Component({
  selector: 'ngx-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {    
  severity_1 = new SmartSeverity(TypeAlert.NOT_ALLOW, new Preference(null,0,0,1,false,true));    
  severity_2 = new SmartSeverity(TypeAlert.NOT_ALLOW,new Preference(null,0,0,2,false,true));
  severity_3 = new SmartSeverity(TypeAlert.NOT_ALLOW, new Preference(null,0,0,3,false,true));
  severity_4 = new SmartSeverity(TypeAlert.NOT_ALLOW, new Preference(null,0,0,4,false,true));  
  selectors = [TypeAlert.NOT_ALLOW,TypeAlert.DIRECT,TypeAlert.USER];
  severities:SmartSeverity[] = [this.severity_1,this.severity_2,this.severity_3,this.severity_4];       
  toast:CentinelaToast;
  severity1IsNotUserType:Boolean = this.severity_1.selector !== TypeAlert.USER;
  severity2IsNotUserType:Boolean = this.severity_2.selector !== TypeAlert.USER;
  severity3IsNotUserType:Boolean = this.severity_3.selector !== TypeAlert.USER;
  severity4IsNotUserType:Boolean = this.severity_4.selector !== TypeAlert.USER;
  preferenceIsEnabled:boolean = false;
  
  constructor(private toastrService: NbToastrService,private preferenceService:PreferenceService) {
    this.toast = new CentinelaToast(toastrService);
  }  
  
  ngOnInit(): void {
    this.preferenceService.getAll().subscribe(      
       preferences => {                            
        for (let preference of preferences){          
           var position = preference.severity-1;          
           var severity = this.severities[position];          
           severity.setPreference(preference);
        };
        this.severity1IsNotUserType = !(this.severity_1.selector === TypeAlert.USER);
        this.severity2IsNotUserType = !(this.severity_2.selector === TypeAlert.USER);
        this.severity3IsNotUserType = !(this.severity_3.selector === TypeAlert.USER);
        this.severity4IsNotUserType = !(this.severity_4.selector === TypeAlert.USER);      
      },
      (error: any) => {          
          console.log(error);
          this.toast.showToast(4, "No Ok", "Hubo un traer las alertas" );           
      }
    );
    this.preferenceService.getPreferenceGeneral().subscribe(      
      preference => {         
        if(preference[0]){
          this.preferenceIsEnabled = preference[0].isEnabled;
        }
        else{
          this.preferenceIsEnabled = false;
        }
        
      },
     (error: any) => {          
         console.log(error);
         this.toast.showToast(4, "No Ok", "Hubo un traer las alertas" );           
     }
   );

  }

  savePreferenceWithHour(preference, hour){
    console.log(hour);
    preference.timeHour = hour;      
    this.savePreference(preference);    
  }

  savePreference(mypreference:Preference){    
    var outPreference = new Preference(mypreference.id,this.oftenUTCHour(mypreference.timeHour),
                                       mypreference.timeMinute,mypreference.severity,
                                       mypreference.isImmediate, mypreference.isEnabled);      
    this.preferenceService.savePreference(outPreference).subscribe(            
      preference => {      
        console.log(mypreference)
        mypreference.id = preference.id                                          
        this.toast.showToast(1, "Ok", "La severidad fué modificada con éxito" ); 
        this.severity1IsNotUserType = this.severity_1.selector !== TypeAlert.USER;
        this.severity2IsNotUserType = this.severity_2.selector !== TypeAlert.USER;
        this.severity3IsNotUserType = this.severity_3.selector !== TypeAlert.USER;
        this.severity4IsNotUserType = this.severity_4.selector !== TypeAlert.USER;
        
      },
      (error: any) => {          
          console.log(error);
          this.toast.showToast(4, "No Ok", "Hubo un error al modificar la severidad" );          
      }
    );
  }

  toggle(preferenceIsEnabled){  
    this.preferenceService.savePreferenceGeneral(new PreferenceGeneralOut(preferenceIsEnabled)).subscribe(            
      preference => {                                              
        this.toast.showToast(1, "Ok", "La preferencia fué modificada con éxito" ); 
        this.preferenceIsEnabled = preferenceIsEnabled;
      },
      (error: any) => {          
          console.log(error);
          this.toast.showToast(4, "No Ok", "Hubo un error al modificar la preferencia" );          
      }
    );
  }

  oftenUTCHour (hourData): number{
    var hour = parseInt(hourData);
    var date = new Date();
    date.setHours(hour); 
    return date.getUTCHours();
  }

  severity1Change(selector){       
    this.severity_1.setSelector(selector);
    this.savePreference(this.severity_1.preference);
  }
  severity2Change(selector){
    this.severity_2.setSelector(selector);
    this.savePreference(this.severity_2.preference);
  }

  severity3Change(selector){
    this.severity_3.setSelector(selector);
    this.savePreference(this.severity_3.preference);
  }

  severity4Change(selector){    
    this.severity_4.setSelector(selector);
    this.savePreference(this.severity_4.preference);
  }

  severity1Hour(hour){        
    this.savePreferenceWithHour(this.severity_1.preference,hour);
  }
  severity2Hour(hour){
    this.savePreferenceWithHour(this.severity_2.preference,hour);
  }

  severity3Hour(hour){
    this.savePreferenceWithHour(this.severity_3.preference,hour);
  }

  severity4Hour(hour){ 
    this.savePreferenceWithHour(this.severity_4.preference,hour);
  }

  severity1Minute(minute){
    this.severity_1.preference.timeMinute = parseInt(minute);
    this.savePreference(this.severity_1.preference);
  }

  severity2Minute(minute){
    this.severity_2.preference.timeMinute = parseInt(minute);
    this.savePreference(this.severity_2.preference);
  }

  severity3Minute(minute){
    this.severity_3.preference.timeMinute = parseInt(minute);
    this.savePreference(this.severity_3.preference);
  }

  severity4Minute(minute){
    this.severity_4.preference.timeMinute = parseInt(minute);
    this.savePreference(this.severity_4.preference);
  }

}




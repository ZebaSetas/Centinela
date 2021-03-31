import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Bug } from 'app/models/bug';
import { BugService } from '../../../services/bug.service';
import { NbToastrService } from '@nebular/theme';
import { LoginService } from '../../../services/login.service';
import { UserService } from '../../../services/user.service';
import { UserToList } from 'app/models/user-to-list';
import { FormControl } from '@angular/forms';
import { CentinelaToast } from '../../utils/centinela-toast';
import { SmartBug } from '../../../models/smart-bug';

@Component({
  selector: 'ngx-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.scss']
})
export class BugComponent implements OnInit {
  inputItemNgModel:String;
  textareaItemNgModel:String;
  inputItemFormControl = new FormControl();
  textareaItemFormControl = new FormControl();
  isAdmin:Boolean = true;
  editTitleText:String;
  smartBug:SmartBug;
  bugId:number;
  lala:number;
  title:string;
  system:string;
  environment:string;
  description:string;
  stateId:number;
  severity:number;
  developer: string;  
  cssTagCircle:string= "circle";
  circle:string;
  lastStatus:number;
  newState:string;
  editTitle:Boolean=false;
  editDesc:Boolean=false;
  users: Array<UserToList>;
  toast:CentinelaToast;


  constructor(private bugService: BugService, private currentRoute:ActivatedRoute,private route: Router, 
    private toastrService: NbToastrService, private loginService:LoginService, private userService: UserService) { 
      this.toast = new CentinelaToast(toastrService);
  }

  ngOnInit() {
    const id = this.currentRoute.snapshot.paramMap.get('id');   
    this.isAdmin = this.loginService.userIsAdmin();    
    this.bugService.getById(id).subscribe(bug=>{      
        if(bug===null) this.route.navigateByUrl('/error');
        else{         
              var smartBug = new SmartBug(bug);      
              this.smartBug = smartBug;
              this.bugId = smartBug.id;
              this.title = smartBug.title;
              this.description = smartBug.description;
              this.stateId = smartBug.stateId;            
              this.severity = smartBug.severity;
              this.developer = smartBug.developer;
              this.lastStatus = smartBug.stateId;    
              this.environment = smartBug.environment;
              this.system = smartBug.system;    
              this.circle = this.cssTagCircle+smartBug.severity;                                    
              this.userService.getAll().subscribe(users=>{
                this.users = users;     
          });
        }            
      },
      error=> { 
        this.route.navigateByUrl('/error');
      }  
    )
    
  }

  changeTitle(event){
    this.title = event.target.value; 
  }
  changeDescription(event){
    this.description = event.target.value; 
  }

  editTitleOnClick(){
    this.editTitle=true;
  }

  saveTitleOnClick(){
    this.editTitle=false;
    this.smartBug.title = this.title;
    this.updateBug();
  }

  editDescOnClick(){
    this.editDesc=true;
  }
  saveDescOnClick(){
    this.editDesc=false;
    this.smartBug.description = this.description;
    this.updateBug();
  }
  
  
  onMenuItemSelectedSeverity(idNewSeverity):void{    
    this.smartBug.severity = Number(idNewSeverity);
    this.circle = this.cssTagCircle+idNewSeverity;      
    this.updateBug();
  }

  updateBug():void{
    this.bugService.updateBug(this.smartBug.toModel()).subscribe(
      bugUpdated=>{
        if(bugUpdated!=null){
          this.toast.showToast(1, "Ok", "El error fué modificado con éxito" );          
        }
        else{          
          this.newState = "Fue resuelto";
          this.toast.showToast(3, "No Ok", "No se pudo modificar" );
        }
    },
      error=>{        
        this.newState = "Fue resuelto";
        this.toast.showToast(4, "No Ok", "Hubo un error al modificar" );
        
      }
    )
  }

  onMenuItemSelected(idNewState):void{    
    this.smartBug.stateId = Number(idNewState);
    this.updateBug();
  }

  onMenuUserSelected(newUser):void{    
    this.users.forEach(user => {
      if(newUser===user.name){
        this.smartBug.userId = user.id;    
      }
    });    
    this.updateBug();
  }

}


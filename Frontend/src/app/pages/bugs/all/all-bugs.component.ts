import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BugService } from '../../../services/bug.service';
import { Bug } from '../../../models/bug';
import { SmartBug } from '../../../models/smart-bug';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CentinelaToast } from '../../utils/centinela-toast';

@Component({
  selector: 'ngx-all-bugs',
  templateUrl: './all-bugs.component.html',
  styleUrls: ['./all-bugs.component.scss'],
})
export class AllBugsComponent {  
  limit: number = 30;
  initialOffset: number = 0
  offset: number = 0;
  pageName: String = 'Errores reportados';
  messageError: string;
  smartBugs: SmartBug[];
  sour: LocalDataSource;
  dataSet: SmartBug[];
  source: LocalDataSource = new LocalDataSource();
  hasPrevius: Boolean=false;  
  hasNext: Boolean=false;
  severity: string = "severity_asc";
  state: string = "pending";
  isRigthButtonAction: Boolean = true;
  toast: CentinelaToast;
  
  settings = {
    pager: {
      display: true,
      perPage: this.limit
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      //deleteButtonContent: '<i class="nb-trash"></i>',
      deleteButtonContent: '<div class="min-button"><i class="fa fa-eye"></i></div>',
      confirmDelete: true,
    },  
    actions: {
      columnTitle: 'Ver',
      add: false,
      edit: false,
      delete: true,      
      position: 'left',
    },    
    columns: {
      numberBug:{
        title: 'Error',        
        type: 'string',
        width:'20px',
      },
      title: {
        title: 'Título',        
        type: 'string',
      }, 
      system: {
        title: 'Sistema',        
        type: 'string',
      },    
      environment: {
        title: 'Ambiente',        
        type: 'string',
      },    
      state: {        
        title: 'Estado',        
        editor: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [
              {value: 'Fue resuelto', title:'Fue resuelto'},
              {value: 'No resuelto', title:'No resuelto'},
            ],
          },
        },
        filter: {
          type: 'list',          
          config: {
            selectText: 'Todos',
            list: [
              {value: 'Fue resuelto', title:'Fue resuelto'},
              {value: 'No resuelto', title:'No resuelto'},
            ],
          },
        },
      },
      severity: {
        title: 'Severidad',        
        editor: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [
              {value: '1', title:'1'},
              {value: '2', title:'2'},
              {value: '3', title:'3'},
              {value: '4', title:'4'},
            ],
          },
        },
        filter: {
          type: 'list',          
          config: {
            selectText: 'Todos',
            list: [
              {value: '1', title:'1'},
              {value: '2', title:'2'},
              {value: '3', title:'3'},
              {value: '4', title:'4'},
            ],
          },
        },
      }, 
      developer: {
        title: 'Desarrollador',
        type: 'string',
      },    
    },
  };

  constructor(private route: Router, private toastrService: NbToastrService, private bugService: BugService) 
  {
    this.toast = new CentinelaToast(toastrService);   
    this.showBugs();
  }

  routeToAPage(event): void {    
    var bug:SmartBug = event.data;
    this.route.navigateByUrl('/bug/'+bug.id);    
  }

  convertBugsToSmartBugs(array: Array<Bug>): SmartBug[] {
    return array.map(bug => new SmartBug(bug));
  }
  
  onClickButtonLeft() { 
    this.offset -= this.limit;
    this.isRigthButtonAction = false;  
    if(this.offset <= this.initialOffset) {
      this.hasPrevius = false;    
    }
    this.showBugs();
  }
  
  onClickButtonRigth() {
    this.offset += this.limit;
    this.isRigthButtonAction = true;
    this.showBugs();
  }

  onMenuItemSelected(selected:number) {        
    if (selected == 1){
      this.state="pending";
    }
    else if(selected == 2) {
      this.state= "completed";
    }
    else if(selected == 3) {
      this.state=null;
    }   
    this.offset = this.initialOffset;
    this.showBugs();    
  }
  
  showBugs() {    
    this.bugService.getAll(this.severity, this.state, this.limit, this.offset).subscribe(      
      bugs => {        
        this.smartBugs = this.convertBugsToSmartBugs(bugs);        
        if(bugs.length == null || bugs.length == 0) {
          if(this.isRigthButtonAction) {
            this.hasNext = false;
            this.toast.showToast(2, "Info", "No quedan más errores" );    
          }          
        }
        else{
          if(this.isRigthButtonAction) {
            if (bugs.length < this.limit)
              this.hasNext = false;
            else            
              this.hasNext = true;

            if(this.offset > this.initialOffset) {
              this.hasPrevius = true;                  
            }                
          }
          else{
            this.hasNext = true;                
            if(this.offset < this.initialOffset) {
              this.hasPrevius = false;                  
            }
          }
          this.source.load(this.smartBugs);
        }
       },
      (error: any) => {
          this.messageError = error;
          console.log(error);
      }
    )
  }
}
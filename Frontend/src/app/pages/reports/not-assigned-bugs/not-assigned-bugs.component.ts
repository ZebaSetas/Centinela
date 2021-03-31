import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CentinelaToast } from '../../utils/centinela-toast';
import { NbToastrService } from '@nebular/theme';
import { StatisticService } from '../../../services/statistics.service';
import { Bug } from '../../../models/bug';
import { SmartBugReport } from '../../../models/smart-bug-report';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-not-assigned-bugs',
  templateUrl: './not-assigned-bugs.component.html',
  styleUrls: ['./not-assigned-bugs.component.scss']
})
export class NotAssignedBugsComponent implements OnInit {
  limit: number = 30;
  initialOffset: number = 0
  offset: number = 0;
  source: LocalDataSource = new LocalDataSource();
  toast: CentinelaToast;
  essageError: string;
  smartBugsReports: SmartBugReport[];
  isRigthButtonAction: boolean = true;
  hasPrevius: boolean=false;  
  hasNext: boolean=false;
  messageError: string;

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
      severity: {
        title: 'Severidad',        
        type: 'string'
      }  
    }
  };

  constructor(private statisticsService: StatisticService, 
    private toastrService: NbToastrService, private route: Router) {
    this.toast = new CentinelaToast(toastrService);   
    this.showBugs();
  }

  ngOnInit() {
  }

  showBugs() {    
    this.statisticsService.getBugsNotAssigned(this.limit, this.offset).subscribe(
      bugs => {
        this.smartBugsReports = this.convertBugsToSmartBugs(bugs);
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
          this.source.load(this.smartBugsReports);
        }
       },
      (error: any) => {
          this.messageError = error;
          console.log(error);
      }
    )
  }

  convertBugsToSmartBugs(array: Array<Bug>): SmartBugReport[] {
    return array.map(bug => new SmartBugReport(bug));
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

  routeToAPage(event): void {    
    var bug: SmartBugReport = event.data;
    this.route.navigateByUrl('/bug/' + bug.id);    
  }
}

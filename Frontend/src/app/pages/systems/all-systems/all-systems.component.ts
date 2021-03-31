import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SystemService } from '../../../services/system.service';
import { System } from '../../../models/system';
import { SmartSystem } from '../../../models/smart-system';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-all-systems',
  templateUrl: './all-systems.component.html',
  styleUrls: ['./all-systems.component.scss']
})
export class AllSystemsComponent {

  source: LocalDataSource = new LocalDataSource();
  systems: Array<System>;
  smartSystem: SmartSystem[];

  settings = {
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
      systemName: {
        title: 'Nombre',        
        type: 'string',
      }
    }
  };

  constructor(private route: Router, private systemService: SystemService) { 
    this.systemService.getAllSystems().subscribe(
      (sys) => {        

        this.smartSystem = this.convertSystemToSmartSystem(sys.systems);   
        console.log(this.smartSystem);     
        this.source.load(this.smartSystem);
       },
      (error: any) => {
          //this.messageError = error;
          console.log(error);
      }
    );
  }

  convertSystemToSmartSystem(array: Array<any>): SmartSystem[] {
    return array.map(sys => new SmartSystem(sys.id, sys.name, sys.organizationId));
  }

  routeToAPage(event): void {    
    var system: SmartSystem = event.data;
    this.route.navigateByUrl('systems/' + system.id + "/environments");
  }
}

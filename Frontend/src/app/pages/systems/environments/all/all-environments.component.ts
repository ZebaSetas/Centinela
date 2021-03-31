import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SystemService } from '../../../../services/system.service';
import { Environment } from '../../../../models/environment';
import { ActivatedRoute } from '@angular/router';
import { CentinelaToast } from '../../../utils/centinela-toast';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-all-environments',
  templateUrl: './all-environments.component.html',
  styleUrls: ['./all-environments.component.scss']
})
export class AllEnvironmentsComponent implements OnInit {

  systemId: string;
  source: LocalDataSource = new LocalDataSource();
  tableEnvironments: Environment[];
  environment: any = {};
  messageError: string;
  messageOk: string;
  keyConnection: string;
  toast:CentinelaToast;

  settings = {
    delete: {
      deleteButtonContent: '<div class="min-button"><i class="fa fa-eye"></i></div>',
      confirmDelete: true,
    },
    actions: {
      columnTitle: 'Ver',
      add: false,
      edit: false,
      delete: false,
      position: 'left'
    },    
    columns: {
      name: {
        title: 'Nombre',        
        type: 'string',
      }
    }
  };

  constructor(private systemService: SystemService, 
    private currentRoute: ActivatedRoute, 
    protected cd: ChangeDetectorRef,
    private toastrService: NbToastrService) { 
      this.toast = new CentinelaToast(toastrService);
    }

  ngOnInit() {
    this.systemId = this.currentRoute.snapshot.paramMap.get('id');
    this.populateTable();
  }

  populateTable() {
    this.systemService.getAllEnvironmentForTheSystem(this.systemId).subscribe(
      (env) => {        
        this.tableEnvironments = this.convertEnvironmentsForList(env.environments); 
        this.source.load(this.tableEnvironments);
       },
      (error: any) => {
          //this.messageError = error;
          console.log(error);
      }
    );
  }

  convertEnvironmentsForList(array: Array<any>): Environment[] {
    return array.map(env => new Environment(null, env.name));
  }

  createEnvironment(environmentName) {
    this.messageOk = '';
    this.messageError = '';
    const htmlEnvironment = this.environment as Environment;
    const environment = new Environment(null, htmlEnvironment.name);
    this.systemService.createEnvironment(this.systemId, environment).subscribe(
      (env) => {
        this.keyConnection = env.environment.keyConnection;
        this.messageOk = `La clave del ambiente ${env.environment.name} es: ${this.keyConnection}`;
        this.populateTable();
        environmentName.reset();
      },
      (error: any) => {
        console.log(error);
        this.messageError = 'Ya existe un ambiente con el nombre ' + htmlEnvironment.name;
        this.cd.detectChanges();
      }
    );
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toast.showToast(1, "Ok", `La clave fue copiada al portapapeles` );      
  }
}

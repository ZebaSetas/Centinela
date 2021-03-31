import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SystemService } from '../../../services/system.service';
import { System } from '../../../models/system';

@Component({
  selector: 'ngx-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  system: any = {};
  messageError: string;
  messageOk: string;

  constructor(private systemService: SystemService, 
              protected cd: ChangeDetectorRef) { }
  
  ngOnInit(): void { }

  createSystem() {
    this.messageOk = '';
    this.messageError = '';
    const htmlSystem = this.system as System;
    const system = new System(htmlSystem.name);
    this.systemService.createSystem(system).subscribe(
      () => {
        this.messageOk = "El sistema fue creado correctamente";
      },
      (error: any) => {
        this.messageError = 'Ya existe una organizacion creada con el nombre ' + htmlSystem.name;
        this.cd.detectChanges();
      }
    );
  }
}


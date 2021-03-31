import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemsComponent } from './systems.component';
import { AllSystemsComponent } from './all-systems/all-systems.component';
import { SystemComponent } from './system/system.component';
import { AllEnvironmentsComponent } from './environments/all/all-environments.component';


const routes: Routes = [{
  path: '',
  component: SystemsComponent,
  children: [
    {
      path: 'systems',
      component: AllSystemsComponent,      
    },
    {
      path: 'systems/add',
      component: SystemComponent,      
    },
    {
      path: 'systems/:id/environments',
      component: AllEnvironmentsComponent,      
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }

export const routedComponents = [
  SystemsComponent,
  SystemComponent,
  AllSystemsComponent,
  AllEnvironmentsComponent, 
];

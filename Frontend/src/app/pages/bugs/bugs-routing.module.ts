import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BugsComponent } from './bugs.component';
import { AllBugsComponent } from './all/all-bugs.component';
import { BugComponent } from './view-bug/bug.component';


const routes: Routes = [{
  path: '',
  component: BugsComponent,
  children: [
    {
      path: 'bugs',
      component: AllBugsComponent,      
    },
    {
      path: 'bug/:id',
      component: BugComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  BugsComponent,
  AllBugsComponent,
  BugComponent
];

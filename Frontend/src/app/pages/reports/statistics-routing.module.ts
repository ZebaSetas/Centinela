import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountBugsComponent } from './statistics/count-bugs/count-bugs.component';
import { TopUsersBugsComponent } from './topUsersBugs/top-users-bugs.component';
import { NotAssignedBugsComponent } from './not-assigned-bugs/not-assigned-bugs.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'statistics',
      component: CountBugsComponent,      
    }, 
    {
      path: 'top-users-bugs',
      component: TopUsersBugsComponent,
    },
    {
      path: 'not-assigned-bugs',
      component: NotAssignedBugsComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }

export const routedComponents = [
  CountBugsComponent,
  TopUsersBugsComponent,
  NotAssignedBugsComponent
];

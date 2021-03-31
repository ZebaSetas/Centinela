import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvitationComponent } from './invitation/invitation.component';

const routes: Routes = [{
  path: '',
  component: InvitationComponent,
  children: [
    {
      path: 'invitations',
      component: InvitationComponent,      
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvitationsRoutingModule { }
export const routedComponents = [
  InvitationComponent
];
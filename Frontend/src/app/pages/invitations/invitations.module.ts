import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationsRoutingModule } from './invitations-routing.module';
import { InvitationComponent } from './invitation/invitation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  NbCardModule, 
  NbIconModule, 
  NbSelectModule, 
  NbInputModule, 
  NbTreeGridModule,
  NbButtonModule,
  NbLayoutModule,
  NbAlertModule } from '@nebular/theme';
  import { ThemeModule } from '../../@theme/theme.module';
  

@NgModule({
  declarations: [InvitationComponent],
  imports: [
    NbButtonModule,
    NbLayoutModule,
    NbCardModule,
    NbTreeGridModule,
    NbAlertModule,
    NbIconModule,
    NbSelectModule,
    NbInputModule,
    ThemeModule,
    CommonModule,
    InvitationsRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class InvitationsModule { }

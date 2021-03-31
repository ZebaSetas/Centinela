import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesRoutingModule } from './preferences-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { PreferencesComponent } from './all-preferences/preferences.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { 
  NbCardModule, 
  NbIconModule, 
  NbSelectModule, 
  NbInputModule, 
  NbTreeGridModule,
  NbButtonModule,
  NbLayoutModule,  
  NbAccordionModule,
  NbTabsetModule,  
  NbCheckboxModule,
  NbRadioModule,  
  NbAlertModule, 
  NbListModule} from '@nebular/theme';
  

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    NbButtonModule,
    NbLayoutModule,
    NbRadioModule,
    MatRadioModule,
    NbCardModule,
    NbCheckboxModule,
    NbListModule,
    NbAccordionModule,
    NbTreeGridModule,
    NbAlertModule,
    NbIconModule,
    NbSelectModule,
    NbInputModule,
    ThemeModule,
    CommonModule,
    NbTabsetModule,
    PreferencesRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class PreferencesModule { }

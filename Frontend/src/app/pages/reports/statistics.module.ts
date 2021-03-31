import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsRoutingModule} from './statistics-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CountBugsComponent } from './statistics/count-bugs/count-bugs.component';
import { TopUsersBugsComponent } from './topUsersBugs/top-users-bugs.component';
import { NotAssignedBugsComponent } from './not-assigned-bugs/not-assigned-bugs.component';

import { 
  NbActionsModule,
  NbCardModule, 
  NbIconModule,   
  NbSelectModule, 
  NbInputModule,    
  NbTreeGridModule,
  NbButtonModule,
  NbDatepickerModule,
  NbLayoutModule,
  NbAlertModule,
  NbListModule,
  NbUserModule } from '@nebular/theme';


@NgModule({
  declarations: [
    CountBugsComponent, 
    TopUsersBugsComponent,
    NotAssignedBugsComponent],
  imports: [    
    NbCardModule,
    NbActionsModule,
    NbButtonModule,
    NbLayoutModule,
    NbCardModule,
    NbTreeGridModule,
    NbAlertModule,
    NbIconModule,
    NbSelectModule,
    NbInputModule,
    NbListModule,
    NbUserModule,
    ThemeModule,
    CommonModule,    
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    ThemeModule,    
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
    NbDatepickerModule,
    Ng2SmartTableModule,
    StatisticsRoutingModule
  ],

})
export class StatisticsModule { }

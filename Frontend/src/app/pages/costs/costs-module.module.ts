import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CostsRoutingModule,routedComponents } from './costs-routing.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ThemeModule } from '../../@theme/theme.module';
import { ChartModule } from 'angular2-chartjs';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CostsListData } from '../../services/costs-list-data';
import { CostsBarData } from '../../services/cost-bar-data';

import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, 
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbTreeGridModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbListModule  
  
} from '@nebular/theme';

@NgModule({
  declarations: [
    ...routedComponents],
  imports: [
    CostsRoutingModule,
    CommonModule,
    LeafletModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, 
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,    
    NbTreeGridModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbListModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    ChartModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,
  ],
  providers: [
    CostsListData,
    CostsBarData
  ],
})
export class CostsModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostsByMonthsComponent } from './costs-by-months/costs-by-months.component';
import { CostsOneMonthComponent } from './costs-one-month/costs-one-month.component';
import { TrafficCardsHeaderComponent } from './costs-by-months/traffic-cards-header/traffic-cards-header.component';
import { TrafficFrontCardComponent } from './costs-by-months/front-side/traffic-front-card.component';
import { TrafficBackCardComponent } from './costs-by-months/back-side/traffic-back-card.component';
import {TrafficBarComponent} from './costs-by-months/front-side/traffic-bar/traffic-bar.component';
import {TrafficBarChartComponent} from './costs-by-months/back-side/traffic-bar-chart.component';
import { CostsComponent } from './costs.component';

const routes: Routes = [{
  path: '',
  component: CostsComponent,
  children: [
    {
      path: 'costs',
      component: CostsByMonthsComponent,      
    },
    {
      path: 'costs/:id',
      component: CostsOneMonthComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostsRoutingModule { }
export const routedComponents = [
  CostsComponent,
  CostsByMonthsComponent,
  CostsOneMonthComponent,
  TrafficBarComponent,
  TrafficFrontCardComponent,
  TrafficCardsHeaderComponent,
  TrafficBackCardComponent,
  TrafficBarChartComponent
];
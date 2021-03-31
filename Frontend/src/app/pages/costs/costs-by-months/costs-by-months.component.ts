import {  OnDestroy, Component, OnInit } from '@angular/core';
import { TrafficList, TrafficListData } from '../../../@core/data/traffic-list';
import { TrafficBarData, TrafficBar } from '../../../@core/data/traffic-bar';
import { takeWhile } from 'rxjs/operators';
import { CostsListData } from '../../../services/costs-list-data';
import { CostsService } from '../../../services/costs.service';
import { CostsBarData } from '../../../services/cost-bar-data';
import { MonthCost } from '../../../models/month-cost';
import { NbToastrService } from '@nebular/theme';
import { CentinelaToast } from 'app/pages/utils/centinela-toast';



@Component({
  selector: 'ngx-costs-by-months',
  templateUrl: './costs-by-months.component.html',
  styleUrls: ['./costs-by-months.component.scss']
})
export class CostsByMonthsComponent implements OnInit, OnDestroy {
  private alive = true;
  trafficBarData: TrafficBar;
  trafficListData: TrafficList;
  revealed = false;
  period: string = '2020';
  myInternalMonth: string = "month";
  toast:CentinelaToast;
  constructor(private trafficListService: CostsListData,
    private toastrService: NbToastrService,
              private costServie:CostsService,              
              private trafficBarService: CostsBarData) {    
        this.toast = new CentinelaToast(toastrService);     
  }

  ngOnDestroy() {
    this.alive = false;
  }

  toggleView() {
    this.revealed = !this.revealed;
  }
  
  ngOnInit(): void {    
    this.setPeriodAngGetData(this.period);
  }

  setPeriodAngGetData(year: string): void {    
    this.costServie.getAll(year).subscribe(      
      monthsCostAlone => {
        if(monthsCostAlone===null) this.toast.showToast(4, "", "No se encuentran facturas de ese año" );
        else{
          var monthsCost = new Array();
          for(let month of monthsCostAlone){
              var monthCost = new MonthCost(month.id, month.bugs, month.users, month.period, month.bugs.total+month.users.total);
              monthsCost.push(monthCost);
          }
          console.log(monthsCost);
          monthsCost.sort(function(a,b){
            if(a.id > b.id) return 1;
            if(a.id<b.id) return -1;
            else return 0;
          });                
          sessionStorage.setItem("monthsCost",JSON.stringify(monthsCost));
          this.getTrafficFrontCardData(monthsCost);    
          this.getTrafficBackCardData(monthsCost);          
        }        
      },
      (error: any) => {
        this.toast.showToast(4, "", "Hubo un inconveniente al buscar las facturas" );
        console.log(error);
      }
    );
  }


  getTrafficBackCardData(monthsCost:MonthCost[]) {
    this.trafficBarService.getTrafficBarData(monthsCost)
      .pipe(takeWhile(() => this.alive ))
      .subscribe(trafficBarData => {
        this.trafficBarData = trafficBarData;
      });
  }

  getTrafficFrontCardData(monthsCost:MonthCost[]) {    
    this.trafficListService.getTrafficListData(monthsCost)
      .pipe(takeWhile(() => this.alive))
      .subscribe(trafficListData => {
        this.trafficListData = trafficListData;
      });
  }

 
}

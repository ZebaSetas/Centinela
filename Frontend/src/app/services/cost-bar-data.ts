import { Injectable } from '@angular/core';
import { TrafficBarData } from 'app/@core/data/traffic-bar';

import { of as observableOf,  Observable } from 'rxjs';
import { PeriodsService } from '../@core/mock/periods.service';
import { TrafficBar } from '../@core/data/traffic-bar';
import { MonthCost } from '../models/month-cost';


@Injectable()
export class CostsBarData {   

  private data = { };

  constructor(private period: PeriodsService) {
    this.data = {      
      month: this.getDataForMonthPeriodByCache(),      
    };
  }

  getDataForMonthPeriodByCache(): TrafficBar {
    var monthsCost:MonthCost[] = JSON.parse(sessionStorage.getItem("monthsCost"));
    if(monthsCost!=null){
        var dataMonth = new Array(monthsCost.length);
        var months = new Array(monthsCost.length);
        for (var i=0; i<monthsCost.length; i++) { 
            dataMonth[i] = monthsCost[i].total;
            months[i] = this.period.getMonths()[monthsCost[i].period.month-1];
        }
        return {
          data: dataMonth,
          labels: months,
          formatter: 'U$s',
        };
    }
  }

  getDataForMonthPeriod(monthsCost:MonthCost[]): TrafficBar {    
    if(monthsCost!=null){
        var dataMonth = new Array(monthsCost.length);
        var months = new Array(monthsCost.length);
        for (var i=0; i<monthsCost.length; i++) { 
            dataMonth[i] = monthsCost[i].total;
            months[i] = this.period.getMonths()[monthsCost[i].period.month-1];
        }
        return {
          data: dataMonth,
          labels: months,
          formatter: 'U$s',
        };
    }
  }


  getTrafficBarData(monthsCost:MonthCost[]): Observable<TrafficBar> {
    this.data["month"] = this.getDataForMonthPeriod(monthsCost);
    return observableOf(this.data["month"]);
  }
}

import { Injectable } from '@angular/core';
import { TrafficListData } from 'app/@core/data/traffic-list';
import { PeriodsService } from 'app/@core/mock/periods.service';
import { of as observableOf,  Observable } from 'rxjs';
import { TrafficList } from '../@core/data/traffic-list';
import { MonthCost } from '../models/month-cost';

@Injectable()
export class CostsListData {
  private getRandom = (roundTo: number) => Math.round(Math.random() * roundTo);
  private data = {};

  constructor(private period: PeriodsService) {
    this.data = {    
      month: this.buildDataByCache(),
    };
  }

  private buildDataByCache(): TrafficList[] {
    var monthsCost:MonthCost[] = JSON.parse(sessionStorage.getItem("monthsCost"));
    if(monthsCost!=null) return this.reduceData(monthsCost);
  }

  private buildData(monthsCost:MonthCost[]): TrafficList[] {
    var monthsCost:MonthCost[] = JSON.parse(sessionStorage.getItem("monthsCost"));
    if(monthsCost!=null) return this.reduceData(monthsCost);
  }


  private reduceData(monthsCost: MonthCost[]): TrafficList[] {
    return monthsCost.reduce((result,monthCost, index) => {       
      var timePeriod = this.period.getMonths()[monthCost.period.month-1];      
      const hasResult = result[index - 1];
      const prevDate = hasResult ? result[index - 1].comparison.nextDate : this.period.getMonths()[monthCost.period.month-2];
      const prevValue = hasResult ? result[index - 1].comparison.nextValue :  0;
      const nextValue = monthCost.total;
      const delta = prevValue>0 ? ((nextValue*100)/prevValue) - 100 : ((nextValue*100)/1) - 100
      const deltaValue:number = this.truncateDecimals(delta,0);
      var prevValuePocentage = 0;  
      var nextValuePocentage = 0;
      if(prevValue>nextValue){        
        nextValuePocentage = nextValue * 100/ prevValue;
        prevValuePocentage = 100;
      }
      else{        
        if(nextValue>0){
          prevValuePocentage = prevValue * 100/nextValue
          nextValuePocentage = 100;
        }
      }

      var charUp = deltaValue < 0 ? "-" : deltaValue >0 ? "+" : "";
      const item = {
        id: monthCost.id,
        date: timePeriod,
        value: monthCost.total,
        delta: {
          up: deltaValue <= 0,
          char: charUp,
          value: Math.abs(deltaValue),
        },
        comparison: {
          prevDate,
          prevValue,
          nextDate: timePeriod,
          nextValue,
        },
        comparisonPorcentage: {
          prevDate,
          prevValuePocentage,
          nextDate: timePeriod,
          nextValuePocentage: nextValuePocentage,
        },
      };
      console.log(item);
      return [...result, item];
    }, []);
  }

  truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
    return truncatedNum / multiplier;
};

  getTrafficListData(monthcosts:MonthCost[]): Observable<TrafficList> {      
    this.data["month"] = this.buildData(monthcosts);
    return observableOf(this.data["month"].reverse());
  }


}

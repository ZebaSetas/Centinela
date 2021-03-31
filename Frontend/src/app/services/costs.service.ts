import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of as observableOf, Observable, throwError } from 'rxjs';
import { Organization } from '../models/organization';
import { GlobalsService } from "./globals.service";
import { Cost, MonthCost, PeriodCost } from '../models/month-cost';
import { MonthCostAlone } from 'app/models/month-cost-alone';


@Injectable({
    providedIn: 'root'
})

export class CostsService {
    constructor(private http: HttpClient,private globals: GlobalsService) { } 

    getAll(year: string): Observable<Array<MonthCostAlone>> {
        var queryParams = this.buildQueryParams(parseInt(year));        
        const url = `${environment.api}/costs`+queryParams;        
        console.log(url);
        const headers = this.globals.getHeaderOptions();        
        return this.http.get<Array<MonthCostAlone>>(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
    
    buildQueryParams(year: number) {
        var today = new Date();        
        var currentYear = today.getFullYear();
        var month = today.getMonth()+1;
        if(currentYear === year){            
            return "?From="+year+"-01-01"+"&To="+year+"-"+month+"-01";
        }
        else{
            return "?from="+year+"-01-01"+"&to="+year+"-"+12+"-01";
        }
    }
   
    // getAll(year:string): Observable<Array<MonthCost>> {               
    //     if(year==="2020") {
    //         var data = this.buildData();
    //         data.push(this.buildData2018()[1]);
    //         return observableOf(data);
    //     }

    //     if(year==="2019") return observableOf(this.buildData2019());
    //     if(year==="2018") return observableOf(this.buildData2018());
    // }

    buildData():Array<MonthCost>{
        let junio = new PeriodCost(6,2020);        
        let julio = new PeriodCost(7,2020);
        let ago  = new PeriodCost(8,2020);        
        let sept = new PeriodCost(9,2020);        
        let oct = new PeriodCost(10,2020);        
        let nov  = new PeriodCost(11,2020);

        let junioBC = new Cost(10,20,30);
        let julioBC = new Cost(20,30,50);
        let agoBC = new Cost(10,30,40);
        let septBC = new Cost(10,30,40);
        let octBC = new Cost(50,40,90);        
        let novBC  = new Cost(200,300,500);
                
        let junioUC = new Cost(10,20,30);
        let julioUC = new Cost(20,30,50);
        let agoUC = new Cost(10,30,40);
        let septUC = new Cost(10,30,40);
        let octUC = new Cost(50,40,90);        
        let novUC  = new Cost(200,300,500);
       
        let junioM = new MonthCost(1, junioBC,junioUC,junio,2020);
        let julioM = new MonthCost(2, julioBC,julioUC,julio,20000);
        let agoM = new MonthCost(3, agoBC,agoUC,ago,300000);
        let septM = new MonthCost(4, septBC,septUC,sept,20000);
        let octM = new MonthCost(5, octBC,octUC,oct,15000);
        let novM  = new MonthCost(6, novBC,novUC,nov,2020);

        var result = [junioM,julioM,agoM,septM,octM,novM];
        return result;
    }

    buildData2019():Array<MonthCost>{
        let junio = new PeriodCost(6,2020);        
        let julio = new PeriodCost(7,2020);
        let ago  = new PeriodCost(8,2020);        
        let sept = new PeriodCost(9,2020);        
        let oct = new PeriodCost(10,2020);        
        let nov  = new PeriodCost(11,2020);

        let junioBC = new Cost(10,20,30);
        let julioBC = new Cost(20,30,50);
        let agoBC = new Cost(10,30,40);
        let septBC = new Cost(10,30,40);
        let octBC = new Cost(50,40,90);        
        let novBC  = new Cost(200,300,500);
                
        let junioUC = new Cost(10,20,30);
        let julioUC = new Cost(20,30,50);
        let agoUC = new Cost(10,30,40);
        let septUC = new Cost(10,30,40);
        let octUC = new Cost(50,40,90);        
        let novUC  = new Cost(200,300,500);
       
        let junioM = new MonthCost(1, junioBC,junioUC,junio,2019);
        let julioM = new MonthCost(2, julioBC,julioUC,julio,80000);
        let agoM = new MonthCost(3, agoBC,agoUC,ago,3000);
        let septM = new MonthCost(4, septBC,septUC,sept,10000);
        let octM = new MonthCost(5, octBC,octUC,oct,35000);
        let novM  = new MonthCost(6, novBC,novUC,nov,2019);

        var result = [junioM,julioM,agoM,septM,octM,novM];
        return result;
    }

    buildData2018():Array<MonthCost>{
        let junio = new PeriodCost(6,2020);        
        let julio = new PeriodCost(7,2020);
        let ago  = new PeriodCost(8,2020);        
        let sept = new PeriodCost(9,2020);        
        let oct = new PeriodCost(10,2020);        
        let nov  = new PeriodCost(11,2020);

        let junioBC = new Cost(10,20,30);
        let julioBC = new Cost(20,30,50);
        let agoBC = new Cost(10,30,40);
        let septBC = new Cost(10,30,40);
        let octBC = new Cost(50,40,90);        
        let novBC  = new Cost(200,300,500);
                
        let junioUC = new Cost(10,20,30);
        let julioUC = new Cost(20,30,50);
        let agoUC = new Cost(10,30,40);
        let septUC = new Cost(10,30,40);
        let octUC = new Cost(50,40,90);        
        let novUC  = new Cost(200,300,500);
       
        let junioM = new MonthCost(1, junioBC,junioUC,junio,2018);
        let julioM = new MonthCost(2, julioBC,julioUC,julio,50000);
        let agoM = new MonthCost(3, agoBC,agoUC,ago,30700);
        let septM = new MonthCost(4, septBC,septUC,sept,60000);
        let octM = new MonthCost(5, octBC,octUC,oct,70000);
        let novM  = new MonthCost(6, novBC,novUC,nov,2018);

        var result = [junioM,julioM,agoM,septM,octM,novM];
        return result;
    }
}



import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { GlobalsService } from "./globals.service";
import { Statistics } from '../models/statistics';


@Injectable({
    providedIn: 'root'
})

export class StatisticService {

    constructor(private http: HttpClient,private globals: GlobalsService) { }
    
    
    getStatistics(dateFrom:string,dateTo:string): Observable<Statistics> {        
        const url = `${environment.api}/reports/statistics?dateFrom=${dateFrom}&dateTo=${dateTo}`;        
        const headers = this.globals.getHeaderOptions();        
        return this.http.get<Statistics>(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    getTopUsers(): Observable<any> {        
        const url = `${environment.api}/reports/bugs/topUsers/solved`;        
        const headers = this.globals.getHeaderOptions();        
        return this.http.get(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    getBugsNotAssigned(limit:number, offset:number): Observable<any> {
        var queryParams = "?limit="+limit+"&offset="+offset;      
        const url = `${environment.api}/reports/bugs/notAssigned${queryParams}`;        
        const headers = this.globals.getHeaderOptions();        
        return this.http.get(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
}
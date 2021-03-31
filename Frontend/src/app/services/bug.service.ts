import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,  HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Bug } from '../models/bug';
import { GlobalsService } from "./globals.service";

@Injectable({
    providedIn: 'root'
})

export class BugService {
    constructor(private http: HttpClient, private globals: GlobalsService) { }    
    getAll(order:string,state:string,limit:number,offset:number): Observable<Array<Bug>> {        
        var queryParams = this.buildQueryParams(order,state,limit,offset);        
        const url = `${environment.api}/bugs`+queryParams;        
        const headers = this.globals.getHeaderOptions();        
        return this.http.get<Array<Bug>>(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    updateBug(bug:Bug): Observable<Bug> {          
        const url = `${environment.api}/bugs/${bug.id}`;        
        const headers = this.globals.getHeaderOptions();        
        return this.http.put<Bug>(url,JSON.stringify(bug) ,headers)
            .pipe(
                map((response) => response),                
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
    
    
    getById(bugId:string):Observable<Bug> {
        const url = `${environment.api}/bugs/${bugId}`;
        const headers = this.globals.getHeaderOptions();
        return this.http.get<Bug>(url, headers)
          .pipe(catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    buildQueryParams(order:string,state:string, limit:number,offset:number): string{
        var result = "?limit="+limit+"&offset="+offset;
        var thereIsOrder = order != null;
        var thereIsState = state != null;
        if (thereIsOrder){
            result += "&"+"order="+order;
        }
        if (thereIsState){
            result += "&"+"state="+state;
        }       
        return result;
    }
}
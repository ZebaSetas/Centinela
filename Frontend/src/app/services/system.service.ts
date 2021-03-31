import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { System } from '../models/system';
import { GlobalsService } from "./globals.service";
import { Environment } from 'app/models/environment';

@Injectable({
    providedIn: 'root'
})

export class SystemService {

    constructor(private http: HttpClient, private globals: GlobalsService) { }
    
    createSystem(system: System): Observable<System> {
        const url = `${environment.api}/systems`; 
        const headers = this.globals.getHeaderOptions();      
        return this.http.post<System>(url, system, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    getAllSystems(): Observable<any> {        
        const url = `${environment.api}/systems`; 
        const headers = this.globals.getHeaderOptions();        
        return this.http.get(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
    getAllEnvironmentForTheSystem(systemId: string): Observable<any> {        
        const url = `${environment.api}/systems/${systemId}/environments`; 
        const headers = this.globals.getHeaderOptions();        
        return this.http.get(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    createEnvironment(systemId: string, environmentModel: Environment): Observable<any> {
        const url = `${environment.api}/systems/${systemId}/environments`; 
        console.log(environmentModel)
        const headers = this.globals.getHeaderOptions();      
        return this.http.post<Environment>(url, environmentModel, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
}
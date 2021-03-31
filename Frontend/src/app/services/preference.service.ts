import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Organization } from '../models/organization';
import { GlobalsService } from "./globals.service";
import { Preference } from '../models/preference';
import { PreferenceGeneral } from '../models/preference-general';
import { PreferenceGeneralOut } from '../models/preference-general-out';

@Injectable({
    providedIn: 'root'
})

export class PreferenceService {

    constructor(private http: HttpClient,private globals: GlobalsService) { }
    
    savePreference(preference: Preference): Observable<Preference> {    
        console.log(preference);        
        const url = `${environment.api}/preferences`; 
        const headers = this.globals.getHeaderOptions(); 
        return this.http.post<Preference>(url, JSON.stringify(preference),  headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    savePreferenceGeneral(preference: PreferenceGeneralOut): Observable<PreferenceGeneralOut> {
        const url = `${environment.api}/preferences/general`; 
        const headers = this.globals.getHeaderOptions(); 
        return this.http.post<PreferenceGeneralOut>(url, JSON.stringify(preference),  headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    getPreferenceGeneral(): Observable<PreferenceGeneral> {                 
        const url = `${environment.api}/preferences/general`;        
        const headers = this.globals.getHeaderOptions();        
        return this.http.get<PreferenceGeneral>(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    getAll(): Observable<Array<Preference>> {
        const url = `${environment.api}/preferences`;        
        const headers = this.globals.getHeaderOptions();        
        console.log(url)
        return this.http.get<Array<Preference>>(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Organization } from '../models/organization';
import { GlobalsService } from "./globals.service";

@Injectable({
    providedIn: 'root'
})

export class OrganizationService {

    constructor(private http: HttpClient,private globals: GlobalsService) { }

    getOrganizationById(organizationId: string): Observable<any> {        
        const url = `${environment.api}/organizations/${organizationId}`; 
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
        return this.http.get<Organization>(url, { headers })
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
}
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Organization } from '../models/organization';
import { GlobalsService } from "./globals.service";
import { User } from '../models/user';
import { UserToList } from '../models/user-to-list';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    constructor(private http: HttpClient,private globals: GlobalsService) { }
    
    createOrganizationWithFirstAdminUser(organization: Organization): Observable<Organization> {
        const url = `${environment.api}/users`; 
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Organization>(url, organization, { headers })
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    getAll(): Observable<Array<UserToList>> {        
        const url = `${environment.api}/users`;        
        const headers = this.globals.getHeaderOptions();        
        return this.http.get<Array<UserToList>>(url, headers)
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
}
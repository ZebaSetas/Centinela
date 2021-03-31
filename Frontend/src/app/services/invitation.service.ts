import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { GlobalsService } from "./globals.service";
import { Invitation } from '../models/invitation';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})

export class InvitationService {

    constructor(private http: HttpClient,private globals: GlobalsService) { }
    
    create(invitation: Invitation): Observable<Invitation> {        
        const headers = this.globals.getHeaderOptions();   
        const url = `${environment.api}/invitations`;         
        return this.http.post<Invitation>(url, invitation, headers)
    }

    getInvitationInfo(invitationId: String): Observable<any> {
        const url = `${environment.api}/invitations/${invitationId}`; 
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<Invitation>(url, { headers })
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }

    acceptInvitation(invitationId: String, user: User) : Observable<User> {
        const url = `${environment.api}/invitations/${invitationId}`; 
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<User>(url, user, { headers })
            .pipe(
                map((response) => response),
                catchError((error: HttpErrorResponse) => throwError(error.error || 'Server Error')));
    }
}
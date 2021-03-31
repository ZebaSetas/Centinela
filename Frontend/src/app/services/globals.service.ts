import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalsService {
    constructor(private loginService: LoginService) {}

    MAX_TITLE_TABLE:number = 20;
    MAX_DESCRIPTION_TABLE:number = 40;
    arrayBySeverityStatistics = new Array();
    arrayByStateStatistics= new Array();
    lastCountErrorsStatitics:number;
    lastTextStatistics: string;

    getHeaderOptions() {        
        const token = this.loginService.getToken();
        console.log(token)
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Authorization', token);
        headers = headers.append('Content-Type', 'application/json');
        return { headers };
    }

    setArraysStatistics(bySeverity:any,byState:any,
                        lastCountErrorsStatitics:number,
                        lastTextStatistics:string){
        this.arrayBySeverityStatistics = bySeverity;
        this.arrayByStateStatistics = byState;
        this.lastCountErrorsStatitics = lastCountErrorsStatitics;
        this.lastTextStatistics = lastTextStatistics;

    }
  
}


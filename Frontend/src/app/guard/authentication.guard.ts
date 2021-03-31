import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, CanActivateChild } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({ providedIn: 'root' })

export class AuthenticationGuard implements CanActivateChild {
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

    canActivateChild() {
        const token = this.loginService.getToken();
        if (token && !this.isExpiredToken()) {
            return true;
        }
        else {
          this.router.navigate(['/login']);
          return false;
        }
    }

    private isExpiredToken() {
        const tokenExpiration = this.loginService.getTokenExpiration();
        if (Date.now() >= +tokenExpiration * 1000) {
            return true;
        }
    }
}
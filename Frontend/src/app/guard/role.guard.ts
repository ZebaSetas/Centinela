import { Injectable } from '@angular/core';
import { Router, CanActivateChild } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({ providedIn: 'root' })

export class RoleGuard implements CanActivateChild {
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

    canActivateChild() {
        const isAdmin = this.loginService.userIsAdmin();
        if (isAdmin) {
            return true;
        }
        else {
          this.router.navigateByUrl('/bugs');
          return false;
        }
    }
}
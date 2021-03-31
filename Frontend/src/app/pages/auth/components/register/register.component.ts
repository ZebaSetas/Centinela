import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NB_AUTH_OPTIONS } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';
import { switchMap } from 'rxjs/operators';

import { NbAuthService } from '../../services/auth.service';

import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { Organization } from '../../../../models/organization';
import { OrganizationService } from '../../../../services/organization.service';
import { InvitationService } from '../../../../services/invitation.service';

@Component({
  selector: 'nb-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbRegisterComponent implements OnInit {

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  organization: any = {};
  messageError: string;

  invitationId: string;
  inviteOrganizationName: string;

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router, 
              private currentRoute: ActivatedRoute, 
              private userService: UserService,
              private organizationService: OrganizationService,
              private invitationService: InvitationService) {

    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.strategy = this.getConfigValue('forms.register.strategy');
  }

  ngOnInit() {
    this.invitationId = this.currentRoute.snapshot.paramMap.get('id');
    if (this.isAnInvitation()) {

      this.invitationService.getInvitationInfo(this.invitationId).pipe(
        switchMap((invite) => this.organizationService.getOrganizationById(invite.invitation.organizationId))
      ).subscribe((org) => {
        this.inviteOrganizationName = org.organization.name;
        this.cd.detectChanges();
      },
      (error: any) => {
        this.submitted = false;
        setTimeout(() => {
          return this.router.navigate(['/login']);
        }, this.redirectDelay);
      });
    }
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    const formUser = this.user as User;
    const user = new User(formUser.email, formUser.password, formUser.name);

    if (this.isAnInvitation()) {
      this.invitationService.acceptInvitation(this.invitationId, user).subscribe(
        () => {
          this.submitted = false;
          setTimeout(() => {
            return this.router.navigate(['/login']);
          }, this.redirectDelay);
        },
        (error: any) => {
          this.submitted = false;
          this.messageError = error.error;
          this.cd.detectChanges();
        }
      );
    }
    else {
      const formOrganization = this.organization as Organization;
      const organization = new Organization(formOrganization.name, user);

      this.userService.createOrganizationWithFirstAdminUser(organization).subscribe(
        () => {
          this.submitted = false;
          setTimeout(() => {
            return this.router.navigate(['/login']);
          }, this.redirectDelay);
        },
        (error: any) => {
          this.submitted = false;
          this.messageError = error.trace.errors[0].message;
          this.cd.detectChanges();
        }
      );
    }
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  isAnInvitation(): boolean {
    if (this.invitationId == null)
      return false;
    else
      return true;
  }
}
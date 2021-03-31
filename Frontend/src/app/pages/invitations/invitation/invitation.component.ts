import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {Invitation} from '../../../models/invitation'
import {HtmlInvitation} from '../../../models/html-invitation'
import { NbToastrService } from '@nebular/theme';
import { InvitationService } from '../../../services/invitation.service';
import { CentinelaToast } from '../../utils/centinela-toast';

@Component({
  selector: 'ngx-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {
  invitation: any = {}
  toast:CentinelaToast;
  
  constructor(private invitationService:InvitationService,
    protected cd: ChangeDetectorRef,
    private toastrService: NbToastrService) { 
      this.toast = new CentinelaToast(toastrService);
    }

  ngOnInit(): void {
  }

  onMenuItemSelected(roleId){
    
  }

  createInvitation(invitationName,invitationEmail,invitationRole){    
    var htmlResult = this.invitation as HtmlInvitation;
    var role = Number.parseInt(htmlResult.role)
    //Están invertidos los roles en el backend en id
    if (role === 1) role = 2
    else if (role === 2) role = 1    
    var invitationResult = new Invitation(htmlResult.name, htmlResult.email, role);    
    console.log(invitationResult)
    var isValid:Boolean = this.validate(invitationResult);
    if(isValid){
      this.invitationService.create(invitationResult).subscribe(
        (invitation) => {
          this.toast.showToast(1, "Ok", `Fue enviada una invitación al usuario  ${invitationResult.name} ` );   
          invitationName.reset();
          invitationEmail.reset();          
          invitationRole.reset();               
        },
        (error: any) => {
          this.toast.showToast(4, "Error", `No se pudo enviar la invitación al usuario  ${invitationResult.name}: ` );
          this.cd.detectChanges();
          console.log(error)
        }
      );    
    }
  }

  validate(invitation:Invitation):Boolean{
    var message = "Los campos: {";
    var ok = true;
    if(!invitation.name){
      message += "nombre, ";
      ok = false;
    }
    if(!invitation.email){
      message += "correo, ";
      ok = false;
    }
    
    if(!invitation.role){
      message += "rol";
      ok = false;
    }
    else{
      message = message.substr(0,message.length-2);
    }
    message += "} deben completarse";
    if(!ok)  this.toast.showToast(4, "Error", message );
    return ok;
  }

}

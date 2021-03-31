import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NbAuthComponent } from './pages/auth/components/auth.component';
import { NbLoginComponent } from './pages/auth/components/login/login.component';
import { NbRegisterComponent } from './pages/auth/components/register/register.component';
import { AuthenticationGuard } from './guard/authentication.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'bugs', pathMatch: 'full' },
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,        
      },  
      {
        path: 'register/:id',
        component: NbRegisterComponent,        
      }
    ],
  },
  {
    path: '',
    canActivateChild: [AuthenticationGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  }
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

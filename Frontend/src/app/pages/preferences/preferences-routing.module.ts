import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreferencesComponent } from './all-preferences/preferences.component';

const routes: Routes = [{
  path: '',
  component: PreferencesComponent,
  children: [
    {
      path: 'preferences',
      component: PreferencesComponent,      
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferencesRoutingModule { }
export const routedComponents = [
  PreferencesComponent
];
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyAccountComponent} from './my-account.component';
import {AuthGuardService} from '../services/auth-guard.service';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {TaskFormComponent} from './my-tasks/task-form/task-form.component';

const routes: Routes = [
  {path: '', component: MyAccountComponent},
  {path: ':id', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuardService]},
  {path: 'new-task', component: TaskFormComponent, canActivate: [AuthGuardService]},
  {path: 'update/:id/:month/:year', component: TaskFormComponent, canActivate: [AuthGuardService]},
  // PL
  {path: 'moj-profil', component: MyProfileComponent, canActivate: [AuthGuardService]},
  {path: 'zadanie', component: TaskFormComponent, canActivate: [AuthGuardService]},
  {path: 'aktualizuj/:id/:month/:year', component: TaskFormComponent, canActivate: [AuthGuardService]}
  // DE... FR... IT...
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule {}

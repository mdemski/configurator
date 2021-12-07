import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyAccountComponent} from './my-account.component';
import {AuthGuardService} from '../services/auth-guard.service';
import {MyProfileComponent} from './my-profile/my-profile.component';

const routes: Routes = [
  {path: '', component: MyAccountComponent},
  {path: ':id', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'moj-profil', component: MyProfileComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule {}

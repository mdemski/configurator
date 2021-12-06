import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyAccountComponent} from './my-account.component';
import {AuthGuardService} from '../services/auth-guard.service';

const routes: Routes = [
  {path: '', component: MyAccountComponent},
  {path: ':id', component: MyAccountComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule {}

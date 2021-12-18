import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ComplaintProductDetailsComponent} from './complaint-product-details/complaint-product-details.component';
import {ComplaintsGuard} from '../store/complaint/complaints.guard';
import {ComplaintComponent} from './complaint/complaint.component';

const routes: Routes = [
  // {path: 'complaints', component: ComplaintComponent},
  {
    path: ':id', component: ComplaintProductDetailsComponent
  }];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ComplaintRoutingModule {
}

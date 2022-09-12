import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComplaintProductDetailsComponent} from './complaint-product-details/complaint-product-details.component';
import {ComplaintFormComponent} from './complaint-form/complaint-form.component';

const routes: Routes = [
  {path: 'new-complaint', component: ComplaintFormComponent},
  {path: 'update/:id/:year', component: ComplaintFormComponent},
  {path: ':id', component: ComplaintProductDetailsComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ComplaintRoutingModule {
}

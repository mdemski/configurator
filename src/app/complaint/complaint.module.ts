import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {ComplaintRoutingModule} from './complaint-routing.module';
import {ComplaintComponent} from './complaint/complaint.component';
import {ComplaintFormComponent} from './complaint-form/complaint-form.component';
import {ComplaintState} from '../store/complaint/complaint.state';
import {ComplaintProductDetailsComponent} from './complaint-product-details/complaint-product-details.component';

@NgModule({
  declarations: [
    ComplaintComponent,
    ComplaintFormComponent,
    ComplaintProductDetailsComponent
  ],
  imports: [
    SharedModule,
    // NgxsModule.forFeature([ComplaintState]),
    ComplaintRoutingModule
  ],
  exports: [
    ComplaintComponent,
    ComplaintFormComponent
  ]
})
export class ComplaintModule { }

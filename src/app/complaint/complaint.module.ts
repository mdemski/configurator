import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {ComplaintRoutingModule} from './complaint-routing.module';
import {ComplaintComponent} from './complaint/complaint.component';
import {ComplaintFormComponent} from './complaint-form/complaint-form.component';
import {ComplaintState} from '../store/complaint/complaint.state';



@NgModule({
  declarations: [
    ComplaintComponent,
    ComplaintFormComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    NgxsModule.forFeature([ComplaintState]),
    ComplaintRoutingModule
  ],
  exports: [
    ComplaintComponent,
    ComplaintFormComponent
  ]
})
export class ComplaintModule { }

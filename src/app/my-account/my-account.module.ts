import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {MyAccountRoutingModule} from './my-account-routing.module';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {MyConfigurationsComponent} from './my-configurations/my-configurations.component';
import {MyComplaintsComponent} from './my-complaints/my-complaints.component';
import {MyTasksComponent} from './my-tasks/my-tasks.component';
import {InformationsComponent} from './informations/informations.component';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {UserState} from '../store/user/user.state';
import {ConfigurationState} from '../store/configuration/configuration.state';
import {ComplaintModule} from '../complaint/complaint.module';
import { TaskFormComponent } from './my-tasks/task-form/task-form.component';

@NgModule({
  declarations: [MyOrdersComponent, MyConfigurationsComponent, MyComplaintsComponent, MyTasksComponent, InformationsComponent, MyProfileComponent, TaskFormComponent],
  imports: [
    SharedModule,
    ComplaintModule,
    NgxsModule.forFeature([UserState, ConfigurationState]),
    MyAccountRoutingModule
  ],
  exports: [
    MyOrdersComponent,
    MyConfigurationsComponent,
    MyTasksComponent,
    InformationsComponent,
    MyComplaintsComponent
  ],
})
export class MyAccountModule {
}

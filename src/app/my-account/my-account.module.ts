import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {ConfigurationState} from '../store/configuration/configuration.state';
import {MyAccountRoutingModule} from './my-account-routing.module';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyConfigurationsComponent } from './my-configurations/my-configurations.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { InformationsComponent } from './informations/informations.component';

@NgModule({
  declarations: [MyOrdersComponent, MyConfigurationsComponent, MyComplaintsComponent, MyTasksComponent, InformationsComponent],
  imports: [
    SharedModule,
    NgxsModule.forFeature([ConfigurationState]),
    MyAccountRoutingModule
  ]
})
export class MyAccountModule { }

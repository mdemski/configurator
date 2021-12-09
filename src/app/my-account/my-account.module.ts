import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {MyAccountRoutingModule} from './my-account-routing.module';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyConfigurationsComponent } from './my-configurations/my-configurations.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { InformationsComponent } from './informations/informations.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import {UserState} from '../store/user/user.state';

@NgModule({
    declarations: [MyOrdersComponent, MyConfigurationsComponent, MyComplaintsComponent, MyTasksComponent, InformationsComponent, MyProfileComponent],
  exports: [
    MyOrdersComponent,
    MyConfigurationsComponent,
    MyTasksComponent,
    InformationsComponent,
    MyComplaintsComponent
  ],
    imports: [
        SharedModule,
        NgxsModule.forFeature([UserState]),
        MyAccountRoutingModule
    ]
})
export class MyAccountModule { }

import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {ConfigurationState} from '../store/configuration/configuration.state';
import {MyAccountRoutingModule} from './my-account-routing.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    NgxsModule.forFeature([ConfigurationState]),
    MyAccountRoutingModule
  ]
})
export class MyAccountModule { }

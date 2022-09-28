import { NgModule } from '@angular/core';

import { AdvicesRoutingModule } from './advices-routing.module';
import { TextAdviceComponent } from './text-advice/text-advice.component';
import { VideoAdviceComponent } from './video-advice/video-advice.component';
import {SharedModule} from '../shared/shared.module';
import { AdvicesComponent } from './advices.component';


@NgModule({
  declarations: [
    TextAdviceComponent,
    VideoAdviceComponent,
    AdvicesComponent
  ],
  imports: [
    SharedModule,
    AdvicesRoutingModule
  ]
})
export class AdvicesModule { }

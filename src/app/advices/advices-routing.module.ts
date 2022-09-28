import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdvicesComponent} from './advices.component';
import {VideoAdviceComponent} from './video-advice/video-advice.component';
import {TextAdviceComponent} from './text-advice/text-advice.component';

const routes: Routes = [
  {path: '', component: AdvicesComponent},
  {path: '/video/:adviceId', component: VideoAdviceComponent},
  {path: '/text/:adviceId', component: TextAdviceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvicesRoutingModule { }

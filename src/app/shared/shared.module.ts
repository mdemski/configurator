import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DisableControlDirective} from '../directives/disable-control.directive';
import {ModalComponent} from '../modal/modal.component';
import {BouncingLoaderComponent} from '../loaders/bouncing-loader.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    DisableControlDirective,
    ModalComponent,
    BouncingLoaderComponent,
  ],
  imports: [
    CommonModule,
    FilterPipeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilterPipeModule,
    DisableControlDirective,
    ModalComponent,
    BouncingLoaderComponent,
  ]
})
export class SharedModule { }

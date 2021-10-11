import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DisableControlDirective} from '../directives/disable-control.directive';
import {ModalComponent} from '../modal/modal.component';
import {BouncingLoaderComponent} from '../loaders/bouncing-loader.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../app.module';
import {HttpClient} from '@angular/common/http';
import {EmptyArrayPipe} from '../pipes/empty-array.pipe';

@NgModule({
  declarations: [
    DisableControlDirective,
    EmptyArrayPipe,
    ModalComponent,
    BouncingLoaderComponent,
  ],
  imports: [
    CommonModule,
    FilterPipeModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilterPipeModule,
    DisableControlDirective,
    ModalComponent,
    BouncingLoaderComponent,
    TranslateModule,
    EmptyArrayPipe
  ]
})
export class SharedModule { }

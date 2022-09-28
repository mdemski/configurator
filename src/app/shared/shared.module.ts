import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DisableControlDirective} from '../directives/disable-control.directive';
import {ModalComponent} from '../modal/modal.component';
import {BouncingLoaderComponent} from '../loaders/bouncing-loader.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../app.module';
import {HttpClient} from '@angular/common/http';
import {EmptyArrayPipe} from '../pipes/empty-array.pipe';
import {OkpolLoaderComponent} from '../loaders/okpol-loader/okpol-loader.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { NavbarNavigatorComponent } from './navbar-navigator/navbar-navigator.component';
import {RouterModule} from '@angular/router';
import {FilterPipe} from '../pipes/filter.pipe';
import {HighlightDirective} from '../directives/highlight.directive';

@NgModule({
  declarations: [
    DisableControlDirective,
    EmptyArrayPipe,
    ModalComponent,
    BouncingLoaderComponent,
    OkpolLoaderComponent,
    ScrollTopComponent,
    NavbarNavigatorComponent,
    FilterPipe,
    HighlightDirective
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
    RouterModule,
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
    EmptyArrayPipe,
    OkpolLoaderComponent,
    ScrollTopComponent,
    NavbarNavigatorComponent,
    FilterPipe,
    HighlightDirective
  ]
})
export class SharedModule { }

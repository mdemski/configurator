import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TechnologyPresentationComponent } from './technology-presentation/technology-presentation.component';
import {RouterModule, Routes} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { BouncingLoaderComponent } from './loader/bouncing-loader/bouncing-loader.component';

const appRoutes: Routes = [
  {path: '', component: TechnologyPresentationComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [
    AppComponent,
    TechnologyPresentationComponent,
    BouncingLoaderComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }

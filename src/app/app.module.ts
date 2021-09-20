import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {RegulationsComponent} from './regulations/regulations.component';
import {FooterComponent} from './footer/footer.component';
import {ContactComponent} from './contact/contact.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {ShoppingCartComponent} from './shop/shopping-cart/shopping-cart.component';
import {MyAccountComponent} from './my-account/my-account.component';
import {DatabaseService} from './services/database.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterConfirmationPageComponent} from './register/register-confirmation-page/register-confirmation-page.component';
import {AuthService} from './services/auth.service';

import {BouncingLoaderComponent} from './loaders/bouncing-loader.component';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { DisableControlDirective } from './directives/disable-control.directive';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { ModalComponent } from './modal/modal.component';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {AppState} from './store/app/app.state';
import {RouterState} from './store/router/router.state';
import {NgxsRouterPluginModule, RouterStateSerializer} from '@ngxs/router-plugin';
import {CustomRouterStateSerializer} from './store/router/custom-router-state.serializer';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    RegulationsComponent,
    FooterComponent,
    ContactComponent,
    HomeComponent,
    ShoppingCartComponent,
    MyAccountComponent,
    RegisterConfirmationPageComponent,
    BouncingLoaderComponent,
    DisableControlDirective,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FilterPipeModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    NgxsModule.forRoot([
      RouterState,
      AppState
    ], {
      developmentMode: !environment.production,
      selectorOptions: {injectContainerState: false}
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot()
  ],
  providers: [DatabaseService, AuthService,
    {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer}],
  bootstrap: [AppComponent]
})
export class AppModule {
}

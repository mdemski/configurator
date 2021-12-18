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
import {MyAccountComponent} from './my-account/my-account.component';
import {DatabaseService} from './services/database.service';
import {RegisterConfirmationPageComponent} from './register/register-confirmation-page/register-confirmation-page.component';

import {IonicModule} from '@ionic/angular';
import {environment} from '../environments/environment';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {AppState} from './store/app/app.state';
import {RouterState} from './store/router/router.state';
import {NgxsRouterPluginModule, RouterStateSerializer} from '@ngxs/router-plugin';
import {CustomRouterStateSerializer} from './store/router/custom-router-state.serializer';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CartComponent} from './cart/cart.component';
import {CartState} from './store/cart/cart.state';
import {CartGuard} from './store/cart/cart.guard';
import {AuthService} from './services/auth.service';
import {MyAccountModule} from './my-account/my-account.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MyAccountComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    RegulationsComponent,
    FooterComponent,
    ContactComponent,
    HomeComponent,
    RegisterConfirmationPageComponent,
    CartComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(),
    NgxsModule.forRoot([
      RouterState,
      AppState,
      CartState
    ], {
      developmentMode: !environment.production,
      selectorOptions: {injectContainerState: false}
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    AppRoutingModule,
    MyAccountModule
  ],
  providers: [DatabaseService, AuthService, CartGuard,
    {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer}],
  bootstrap: [AppComponent]
})
export class AppModule {
}

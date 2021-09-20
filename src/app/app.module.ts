import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {ConfiguratorComponent} from './configurator/configurator.component';
import {RoofWindowsConfigComponent} from './configurator/roof-windows-config/roof-windows-config.component';
import {VerticalWindowsConfigComponent} from './configurator/vertical-windows-config/vertical-windows-config.component';
import {SkylightsConfigComponent} from './configurator/skylights-config/skylights-config.component';
import {FlashingsConfigComponent} from './configurator/flashings-config/flashings-config.component';
import {AccessoriesConfigComponent} from './configurator/accessories-config/accessories-config.component';
import {ShopComponent} from './shop/shop.component';
import {VerticalWindowsComponent} from './shop/vertical-windows/vertical-windows.component';
import {RoofWindowDetailsComponent} from './shop/roof-windows/roof-window-details/roof-window-details.component';
import {AccessoriesComponent} from './shop/accessories/accessories.component';
import {RoofWindowsComponent} from './shop/roof-windows/roof-windows.component';
import {SkylightsComponent} from './shop/skylights/skylights.component';
import {VerticalWindowDetailsComponent} from './shop/vertical-windows/vertical-window-details/vertical-window-details.component';
import {SkylightDetailsComponent} from './shop/skylights/skylight-details/skylight-details.component';
import {AccessorieDetailsComponent} from './shop/accessories/accessorie-details/accessorie-details.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {RegulationsComponent} from './regulations/regulations.component';
import {FooterComponent} from './footer/footer.component';
import {ContactComponent} from './contact/contact.component';
import {HomeComponent} from './home/home.component';
import {ConfigurationSummaryComponent} from './configurator/configuration-summary/configuration-summary.component';
import {AppRoutingModule} from './app-routing.module';
import {ShoppingCartComponent} from './shop/shopping-cart/shopping-cart.component';
import {MyAccountComponent} from './my-account/my-account.component';
import {DatabaseService} from './services/database.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterConfirmationPageComponent} from './register/register-confirmation-page/register-confirmation-page.component';
import {AuthService} from './services/auth.service';

import {BouncingLoaderComponent} from './loaders/bouncing-loader.component';
import {FlashingsComponent} from './shop/flashings/flashings.component';
import {FlashingDetailsComponent} from './shop/flashings/flashing-details/flashing-details.component';
import {RoofWindowFiltrationComponent} from './shop/roof-windows/roof-window-filtration/roof-window-filtration.component';
import {FilterPipe} from './pipes/filter.pipe';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { DisableControlDirective } from './directives/disable-control.directive';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { SingleConfigurationSummaryComponent } from './configurator/single-configuration-summary/single-configuration-summary.component';
import { ModalComponent } from './modal/modal.component';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {AppState} from './store/app/app.state';
import {RouterState} from './store/router/router.state';
import {NgxsRouterPluginModule, RouterStateSerializer} from '@ngxs/router-plugin';
import {CustomRouterStateSerializer} from './store/router/custom-router-state.serializer';
import {RoofWindowState} from './store/roof-window/roof-window.state';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ConfiguratorComponent,
    RoofWindowsConfigComponent,
    VerticalWindowsComponent,
    SkylightsConfigComponent,
    FlashingsConfigComponent,
    AccessoriesConfigComponent,
    ShopComponent,
    VerticalWindowsComponent,
    RoofWindowDetailsComponent,
    VerticalWindowsConfigComponent,
    AccessoriesComponent,
    RoofWindowsComponent,
    SkylightsComponent,
    VerticalWindowDetailsComponent,
    SkylightDetailsComponent,
    AccessorieDetailsComponent,
    LoginComponent,
    RegisterComponent,
    RegulationsComponent,
    FooterComponent,
    ContactComponent,
    HomeComponent,
    ConfigurationSummaryComponent,
    ShoppingCartComponent,
    MyAccountComponent,
    RegisterConfirmationPageComponent,
    BouncingLoaderComponent,
    FlashingsComponent,
    FlashingDetailsComponent,
    RoofWindowFiltrationComponent,
    FilterPipe,
    DisableControlDirective,
    SingleConfigurationSummaryComponent,
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
      AppState,
      RoofWindowState
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

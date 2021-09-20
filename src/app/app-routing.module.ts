import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfiguratorComponent} from './configurator/configurator.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ContactComponent} from './contact/contact.component';
import {VerticalWindowsComponent} from './shop/vertical-windows/vertical-windows.component';
import {MyAccountComponent} from './my-account/my-account.component';
import {AuthGuardService} from './services/auth-guard.service';
import {RoofWindowsConfigComponent} from './configurator/roof-windows-config/roof-windows-config.component';
import {HomeComponent} from './home/home.component';
import {FlashingsConfigComponent} from './configurator/flashings-config/flashings-config.component';
import {AccessoriesConfigComponent} from './configurator/accessories-config/accessories-config.component';
import {VerticalWindowsConfigComponent} from './configurator/vertical-windows-config/vertical-windows-config.component';
import {SkylightsConfigComponent} from './configurator/skylights-config/skylights-config.component';
import {ConfigurationSummaryComponent} from './configurator/configuration-summary/configuration-summary.component';
import {SingleConfigurationSummaryComponent} from './configurator/single-configuration-summary/single-configuration-summary.component';

const appRoutes: Routes = [
  {path: 'sklep', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)},

  {path: 'okna-pionowe', component: VerticalWindowsComponent},

  {path: 'konfigurator', component: ConfiguratorComponent},
  {path: 'konfigurator/okna-dachowe', component: RoofWindowsConfigComponent},
  {path: 'konfigurator/okna-dachowe/:configId/:formName/:productCode', component: RoofWindowsConfigComponent},
  {path: 'konfigurator/kolnierze', component: FlashingsConfigComponent},
  {path: 'konfigurator/kolnierze/:configId/:formName/:productCode', component: FlashingsConfigComponent},
  {path: 'konfigurator/akcesoria', component: AccessoriesConfigComponent},
  {path: 'konfigurator/akcesoria/:configId/:formName/:productCode', component: AccessoriesConfigComponent},
  {path: 'konfigurator/okna-pionowe', component: VerticalWindowsConfigComponent},
  {path: 'konfigurator/wylazy-dachowe', component: SkylightsConfigComponent},
  {path: 'konfigurator/podsumowanie', component: ConfigurationSummaryComponent},
  {path: 'konfigurator/podsumowanie/:configId', component: SingleConfigurationSummaryComponent},

  {path: '', component: HomeComponent},
  {path: 'moje-konto', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'moje-konto/:id', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'rejestracja', component: RegisterComponent},
  {path: 'kontakt', component: ContactComponent},
  {path: 'logowanie', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

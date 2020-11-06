import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShopComponent} from './shop/shop.component';
import {ConfiguratorComponent} from './configurator/configurator.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ContactComponent} from './contact/contact.component';
import {RoofWindowsComponent} from './shop/roof-windows/roof-windows.component';
import {SkylightsComponent} from './shop/skylights/skylights.component';
import {AccessoriesComponent} from './shop/accessories/accessories.component';
import {VerticalWindowsComponent} from './shop/vertical-windows/vertical-windows.component';
import {RoofWindowDetailsComponent} from './shop/roof-windows/roof-window-details/roof-window-details.component';
import {MyAccountComponent} from './my-account/my-account.component';
import {SkylightDetailsComponent} from './shop/skylights/skylight-details/skylight-details.component';
import {AccessorieDetailsComponent} from './shop/accessories/accessorie-details/accessorie-details.component';
import {AuthGuardService} from './services/auth-guard.service';
import {RoofWindowsConfigComponent} from './configurator/roof-windows-config/roof-windows-config.component';
import {HomeComponent} from './home/home.component';
import {FlashingsConfigComponent} from './configurator/flashings-config/flashings-config.component';
import {AccessoriesConfigComponent} from './configurator/accessories-config/accessories-config.component';
import {VerticalWindowsConfigComponent} from './configurator/vertical-windows-config/vertical-windows-config.component';
import {SkylightsConfigComponent} from './configurator/skylights-config/skylights-config.component';
import {FlashingsComponent} from './shop/flashings/flashings.component';
import {FlashingDetailsComponent} from './shop/flashings/flashing-details/flashing-details.component';

const appRoutes: Routes = [
  {path: 'sklep', component: ShopComponent},
  {path: 'sklep/okna-dachowe', component: RoofWindowsComponent},
  {path: 'sklep/okna-dachowe/:windowId', component: RoofWindowDetailsComponent},
  {path: 'sklep/kolnierze', component: FlashingsComponent},
  {path: 'sklep/kolnierze/:flashingId', component: FlashingDetailsComponent},
  {path: 'sklep/wylazy-dachowe', component: SkylightsComponent},
  {path: 'sklep/wylazy-dachowe/:skylightId', component: SkylightDetailsComponent},
  {path: 'sklep/akcesoria', component: AccessoriesComponent},
  {path: 'sklep/akcesoria/:accessoryId', component: AccessorieDetailsComponent},

  {path: 'okna-pionowe', component: VerticalWindowsComponent},

  {path: 'konfigurator', component: ConfiguratorComponent},
  {path: 'konfigurator/okna-dachowe', component: RoofWindowsConfigComponent},
  {path: 'konfigurator/kolnierze', component: FlashingsConfigComponent},
  {path: 'konfigurator/akcesoria', component: AccessoriesConfigComponent},
  {path: 'konfigurator/okna-pionowe', component: VerticalWindowsConfigComponent},
  {path: 'konfigurator/wylazy-dachowe', component: SkylightsConfigComponent},

  {path: '', component: HomeComponent},
  {path: 'moje-konto', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'moje-konto/:id', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'rejestracja', component: RegisterComponent},
  {path: 'kontakt', component: ContactComponent},
  {path: 'logowanie', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ContactComponent} from './contact/contact.component';
import {VerticalWindowsComponent} from './shop/vertical-windows/vertical-windows.component';
import {MyAccountComponent} from './my-account/my-account.component';
import {AuthGuardService} from './services/auth-guard.service';
import {HomeComponent} from './home/home.component';
import {ConfigurationsGuard} from './store/configuration/configurations.guard';
import {RoofWindowsGuard} from './store/roof-window/roof-windows.guard';
import {FlashingsGuard} from './store/flashing/flashings.guard';
import {AccessoriesGuard} from './store/accessory/accessories.guard';
import {SkylightsGuard} from './store/skylight/skylights.guard';
import {FlatRoofWindowsGuard} from './store/flat-roof-window/flat-roof-windows.guard';
import {AvailableConfigDataGuard} from './store/avaiable-config-data/available-config-data.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth-interceptor';
import {RegisterConfirmationPageComponent} from './register/register-confirmation-page/register-confirmation-page.component';

const appRoutes: Routes = [
  {path: 'sklep', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)},

  {path: 'okna-pionowe', component: VerticalWindowsComponent},

  {path: 'konfigurator', loadChildren: () => import('./configurator/configurator.module').then(m => m.ConfiguratorModule),
    canActivate: [ConfigurationsGuard, AvailableConfigDataGuard]},

  {path: '', component: HomeComponent},
  {path: 'moje-konto', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'moje-konto/:id', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'rejestracja', component: RegisterComponent},
  {path: 'confirmation', component: RegisterConfirmationPageComponent},
  {path: 'confirmation/:random/:uuid', component: RegisterConfirmationPageComponent},
  {path: 'kontakt', component: ContactComponent},
  {path: 'logowanie', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'enabled', useHash: true})],
  exports: [RouterModule],
  providers: [ConfigurationsGuard, RoofWindowsGuard, FlashingsGuard, AccessoriesGuard,
    SkylightsGuard, FlatRoofWindowsGuard, AvailableConfigDataGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    ]
})
export class AppRoutingModule {
}

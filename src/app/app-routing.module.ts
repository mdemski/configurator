import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ContactComponent} from './contact/contact.component';
import {VerticalWindowsComponent} from './shop/vertical-windows/vertical-windows.component';
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
import {CartComponent} from './cart/cart.component';
import {CartGuard} from './store/cart/cart.guard';
import {UserGuard} from './store/user/user.guard';
import {ComplaintsGuard} from './store/complaint/complaints.guard';
import {ResetPasswordComponent} from './my-account/my-profile/reset-password/reset-password.component';

const appRoutes: Routes = [
  // Default
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)},

  {path: 'vertical-windows', component: VerticalWindowsComponent},
  {path: 'cart', component: CartComponent, canActivate: [CartGuard]},

  {
    path: 'configurator', loadChildren: () => import('./configurator/configurator.module').then(m => m.ConfiguratorModule),
    canActivate: [ConfigurationsGuard, AvailableConfigDataGuard]
  },
  {
    path: 'complaints', loadChildren: () => import('./complaint/complaint.module').then(m => m.ComplaintModule),
    canActivate: [UserGuard, ComplaintsGuard]
  },
  {
    path: 'advices', loadChildren: () => import('./advices/advices.module').then(m => m.AdvicesModule)
  },
  {
    path: 'my-account', loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountModule),
    canActivate: [AuthGuardService, CartGuard, ConfigurationsGuard, UserGuard, ComplaintsGuard]
  },
  {path: 'register', component: RegisterComponent},
  {path: 'confirmation', component: RegisterConfirmationPageComponent},
  {path: 'confirmation/:random/:uuid', component: RegisterConfirmationPageComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'login', component: LoginComponent},
  {path: 'reset', component: ResetPasswordComponent},
  // PL
  {path: 'sklep', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)},

  {path: 'okna-pionowe', component: VerticalWindowsComponent},
  {path: 'koszyk', component: CartComponent, canActivate: [CartGuard]},

  {
    path: 'konfigurator', loadChildren: () => import('./configurator/configurator.module').then(m => m.ConfiguratorModule),
    canActivate: [ConfigurationsGuard, AvailableConfigDataGuard]
  },
  {
    path: 'reklamacje', loadChildren: () => import('./complaint/complaint.module').then(m => m.ComplaintModule),
    canActivate: [UserGuard, ComplaintsGuard]
  },
  {
    path: 'porady', loadChildren: () => import('./advices/advices.module').then(m => m.AdvicesModule)
  },
  {
    path: 'moje-konto', loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountModule),
    canActivate: [AuthGuardService, CartGuard, ConfigurationsGuard, UserGuard, ComplaintsGuard]
  },
  {path: 'rejestracja', component: RegisterComponent},
  {path: 'potwierdzenie', component: RegisterConfirmationPageComponent},
  {path: 'potwierdzenie/:random/:uuid', component: RegisterConfirmationPageComponent},
  {path: 'kontakt', component: ContactComponent},
  {path: 'logowanie', component: LoginComponent},
  {path: 'reset', component: ResetPasswordComponent},
  // FR... IT... DE...
  {path: '', component: HomeComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [ConfigurationsGuard, RoofWindowsGuard, FlashingsGuard, AccessoriesGuard,
    SkylightsGuard, FlatRoofWindowsGuard, AvailableConfigDataGuard, UserGuard, ComplaintsGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppRoutingModule {
}

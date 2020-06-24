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
import {VerticalWindowDetailsComponent} from './shop/vertical-windows/vertical-window-details/vertical-window-details.component';
import {AuthGuardService} from './services/auth-guard.service';

const appRoutes: Routes = [
  {path: 'sklep', component: ShopComponent, children:
      [ {path: 'okna-dachowe', component: RoofWindowsComponent, children: [
            {path: ':id', component: RoofWindowDetailsComponent},
        ]},
        {path: 'wylazy', component: SkylightsComponent, children: [
            {path: ':id', component: SkylightDetailsComponent},
          ]},
        {path: 'akcesoria', component: AccessoriesComponent, children: [
            {path: ':id', component: AccessorieDetailsComponent},
          ]},
        {path: 'okna-pionowe', component: VerticalWindowsComponent, children: [
            {path: ':id', component: VerticalWindowDetailsComponent},
          ]}]},
  {path: 'konfigurator', component: ConfiguratorComponent},
  {path: 'rejestracja', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'moje-konto/:id', component: MyAccountComponent, canActivate: [AuthGuardService]},
  {path: 'kontakt', component: ContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

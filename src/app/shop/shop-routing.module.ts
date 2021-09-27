import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShopComponent} from './shop.component';
import {RoofWindowsComponent} from './roof-windows/roof-windows.component';
import {RoofWindowDetailsComponent} from './roof-windows/roof-window-details/roof-window-details.component';
import {FlashingsComponent} from './flashings/flashings.component';
import {FlashingDetailsComponent} from './flashings/flashing-details/flashing-details.component';
import {SkylightsComponent} from './skylights/skylights.component';
import {SkylightDetailsComponent} from './skylights/skylight-details/skylight-details.component';
import {AccessoriesComponent} from './accessories/accessories.component';
import {AccessorieDetailsComponent} from './accessories/accessorie-details/accessorie-details.component';
import {RoofWindowsGuard} from '../store/roof-window/roof-windows.guard';
import {FlashingsGuard} from '../store/flashing/flashings.guard';

const routes: Routes = [
  {path: '', component: ShopComponent},
  {path: 'okna-dachowe', component: RoofWindowsComponent, canActivate: [RoofWindowsGuard]},
  {path: 'okna-dachowe/:windowId', component: RoofWindowDetailsComponent},
  {path: 'kolnierze', component: FlashingsComponent, canActivate: [FlashingsGuard]},
  {path: 'kolnierze/:flashingId', component: FlashingDetailsComponent},
  {path: 'wylazy-dachowe', component: SkylightsComponent},
  {path: 'wylazy-dachowe/:skylightId', component: SkylightDetailsComponent},
  {path: 'akcesoria', component: AccessoriesComponent},
  {path: 'akcesoria/:accessoryId', component: AccessorieDetailsComponent},
];

@NgModule({
  // TODO czy definicja scrollowania na root działa również na dzieciach? {scrollPositionRestoration: 'enabled'}
  imports: [
    RouterModule.forChild(routes),
    ],
  exports: [RouterModule]
})
export class ShopRoutingModule {}

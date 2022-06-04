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
import {AccessoriesDetailsComponent} from './accessories/accessorie-details/accessories-details.component';
import {RoofWindowsGuard} from '../store/roof-window/roof-windows.guard';
import {FlashingsGuard} from '../store/flashing/flashings.guard';
import {AccessoriesGuard} from '../store/accessory/accessories.guard';
import {SkylightsGuard} from '../store/skylight/skylights.guard';
import {FlatRoofWindowsComponent} from './flat-roof-windows/flat-roof-windows.component';
import {FlatRoofWindowDetailsComponent} from './flat-roof-windows/flat-roof-window-details/flat-roof-window-details.component';
import {FlatRoofWindowsGuard} from '../store/flat-roof-window/flat-roof-windows.guard';

const routes: Routes = [
  {path: '', component: ShopComponent},
  {path: 'okna-dachowe', component: RoofWindowsComponent, canActivate: [RoofWindowsGuard]},
  {path: 'okna-dachowe/:windowId', component: RoofWindowDetailsComponent, canActivate: [RoofWindowsGuard]},
  {path: 'kolnierze', component: FlashingsComponent, canActivate: [FlashingsGuard]},
  {path: 'kolnierze/:flashingId', component: FlashingDetailsComponent, canActivate: [FlashingsGuard]},
  {path: 'wylazy-dachowe', component: SkylightsComponent, canActivate: [SkylightsGuard]},
  {path: 'wylazy-dachowe/:skylightId', component: SkylightDetailsComponent, canActivate: [SkylightsGuard]},
  {path: 'akcesoria', component: AccessoriesComponent, canActivate: [AccessoriesGuard]},
  {path: 'akcesoria/:accessoryId', component: AccessoriesDetailsComponent, canActivate: [AccessoriesGuard]},
  {path: 'plaski-dach', component: FlatRoofWindowsComponent, canActivate: [FlatRoofWindowsGuard]},
  {path: 'plaski-dach/:flatId', component: FlatRoofWindowDetailsComponent, canActivate: [FlatRoofWindowsGuard]},
];

@NgModule({
  // TODO czy definicja scrollowania na root działa również na dzieciach? {scrollPositionRestoration: 'enabled'}
  imports: [
    RouterModule.forChild(routes),
    ],
  exports: [RouterModule]
})
export class ShopRoutingModule {}

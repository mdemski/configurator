import {NgModule} from '@angular/core';
import {ShopRoutingModule} from './shop-routing.module';
import {ShopComponent} from './shop.component';
import {RoofWindowDetailsComponent} from './roof-windows/roof-window-details/roof-window-details.component';
import {VerticalWindowsConfigComponent} from '../configurator/vertical-windows-config/vertical-windows-config.component';
import {AccessoriesComponent} from './accessories/accessories.component';
import {RoofWindowsComponent} from './roof-windows/roof-windows.component';
import {SkylightsComponent} from './skylights/skylights.component';
import {VerticalWindowDetailsComponent} from './vertical-windows/vertical-window-details/vertical-window-details.component';
import {SkylightDetailsComponent} from './skylights/skylight-details/skylight-details.component';
import {AccessorieDetailsComponent} from './accessories/accessorie-details/accessorie-details.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../app.module';
import {HttpClient} from '@angular/common/http';
import {RoofWindowFiltrationComponent} from './roof-windows/roof-window-filtration/roof-window-filtration.component';
import {FilterPipe} from '../pipes/filter.pipe';
import {NgxsModule} from '@ngxs/store';
import {RoofWindowState} from '../store/roof-window/roof-window.state';
import {FlashingsComponent} from './flashings/flashings.component';
import {FlashingDetailsComponent} from './flashings/flashing-details/flashing-details.component';
import {SharedModule} from '../shared/shared.module';
import {FlashingState} from '../store/flashing/flashing.state';
import { FlatRoofWindowsComponent } from './flat-roof-windows/flat-roof-windows.component';
import { FlatRoofWidnowDetailsComponent } from './flat-roof-windows/flat-roof-widnow-details/flat-roof-widnow-details.component';
import {SkylightsState} from '../store/skylight/skylights.state';
import {AccessoryState} from '../store/accessory/accessory.state';
import {FlatRoofWindowState} from '../store/flat-roof-window/flat-roof-window.state';

@NgModule({
  imports: [
    SharedModule,
    NgxsModule.forFeature([RoofWindowState, FlashingState, AccessoryState, SkylightsState, FlatRoofWindowState]),
    ShopRoutingModule,
  ],
  declarations: [
    FilterPipe,
    ShopComponent,
    RoofWindowDetailsComponent,
    RoofWindowFiltrationComponent,
    VerticalWindowsConfigComponent,
    AccessoriesComponent,
    RoofWindowsComponent,
    SkylightsComponent,
    VerticalWindowDetailsComponent,
    SkylightDetailsComponent,
    AccessorieDetailsComponent,
    FlashingsComponent,
    FlashingDetailsComponent,
    FlatRoofWindowsComponent,
    FlatRoofWidnowDetailsComponent,
  ]
})
export class ShopModule { }

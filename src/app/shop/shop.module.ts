import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPipe} from '../pipes/filter.pipe';
import {NgxsModule} from '@ngxs/store';
import {RoofWindowState} from '../store/roof-window/roof-window.state';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxsModule.forFeature([RoofWindowState]),
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
  ]
})
export class ShopModule { }

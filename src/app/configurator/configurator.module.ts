import {NgModule} from '@angular/core';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../app.module';
import {HttpClient} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';
import {RoofWindowState} from '../store/roof-window/roof-window.state';
import {ConfiguratorRoutingModule} from './configurator-routing.module';
import {ConfiguratorComponent} from './configurator.component';
import {RoofWindowsConfigComponent} from './roof-windows-config/roof-windows-config.component';
import {VerticalWindowsComponent} from '../shop/vertical-windows/vertical-windows.component';
import {SkylightsConfigComponent} from './skylights-config/skylights-config.component';
import {FlashingsConfigComponent} from './flashings-config/flashings-config.component';
import {AccessoriesConfigComponent} from './accessories-config/accessories-config.component';
import {ConfigurationSummaryComponent} from './configuration-summary/configuration-summary.component';
import {SingleConfigurationSummaryComponent} from './single-configuration-summary/single-configuration-summary.component';
import {SharedModule} from '../shared/shared.module';
import {FlashingState} from '../store/flashing/flashing.state';
import {ConfigurationState} from '../store/configuration/configuration.state';
import {AccessoryState} from '../store/accessory/accessory.state';
import {SkylightsState} from '../store/skylight/skylights.state';
import {FlatRoofWindowState} from '../store/flat-roof-window/flat-roof-window.state';

@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxsModule.forFeature([ConfigurationState, RoofWindowState, FlashingState, AccessoryState, SkylightsState, FlatRoofWindowState]),
    ConfiguratorRoutingModule
  ],
  declarations: [
    ConfiguratorComponent,
    RoofWindowsConfigComponent,
    VerticalWindowsComponent,
    SkylightsConfigComponent,
    FlashingsConfigComponent,
    AccessoriesConfigComponent,
    ConfigurationSummaryComponent,
    SingleConfigurationSummaryComponent,
  ]
})
export class ConfiguratorModule {}

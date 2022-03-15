import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {RoofWindowState} from '../store/roof-window/roof-window.state';
import {ConfiguratorRoutingModule} from './configurator-routing.module';
import {ConfiguratorComponent} from './configurator.component';
import {RoofWindowsConfigComponent} from './roof-windows-config/roof-windows-config.component';
import {VerticalWindowsComponent} from '../shop/vertical-windows/vertical-windows.component';
import {FlatRoofWindowsConfigComponent} from './flat-roof-windows-config/flat-roof-windows-config.component';
import {FlashingsConfigComponent} from './flashings-config/flashings-config.component';
import {AccessoriesConfigComponent} from './accessories-config/accessories-config.component';
import {ConfigurationSummaryComponent} from './configuration-summary/configuration-summary.component';
import {SingleConfigurationSummaryComponent} from './single-configuration-summary/single-configuration-summary.component';
import {SharedModule} from '../shared/shared.module';
import {FlashingState} from '../store/flashing/flashing.state';
import {ConfigurationState} from '../store/configuration/configuration.state';
import {AccessoryState} from '../store/accessory/accessory.state';
import {SkylightState} from '../store/skylight/skylight.state';
import {FlatRoofWindowState} from '../store/flat-roof-window/flat-roof-window.state';
import {AvailableConfigDataState} from '../store/avaiable-config-data/available-config-data.state';

@NgModule({
  imports: [
    SharedModule,
    NgxsModule.forFeature([ConfigurationState, RoofWindowState, FlashingState, AccessoryState,
      SkylightState, FlatRoofWindowState, AvailableConfigDataState]),
    ConfiguratorRoutingModule
  ],
  declarations: [
    ConfiguratorComponent,
    RoofWindowsConfigComponent,
    VerticalWindowsComponent,
    FlatRoofWindowsConfigComponent,
    FlashingsConfigComponent,
    AccessoriesConfigComponent,
    ConfigurationSummaryComponent,
    SingleConfigurationSummaryComponent,
  ]
})
export class ConfiguratorModule {}

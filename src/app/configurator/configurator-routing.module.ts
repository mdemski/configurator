import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoofWindowsConfigComponent} from './roof-windows-config/roof-windows-config.component';
import {FlashingsConfigComponent} from './flashings-config/flashings-config.component';
import {AccessoriesConfigComponent} from './accessories-config/accessories-config.component';
import {VerticalWindowsConfigComponent} from './vertical-windows-config/vertical-windows-config.component';
import {FlatRoofWindowsConfigComponent} from './flat-roof-windows-config/flat-roof-windows-config.component';
import {ConfigurationSummaryComponent} from './configuration-summary/configuration-summary.component';
import {SingleConfigurationSummaryComponent} from './single-configuration-summary/single-configuration-summary.component';
import {ConfiguratorComponent} from './configurator.component';
import {RoofWindowsGuard} from '../store/roof-window/roof-windows.guard';
import {FlashingsGuard} from '../store/flashing/flashings.guard';
import {AccessoriesGuard} from '../store/accessory/accessories.guard';
import {FlatRoofWindowsGuard} from '../store/flat-roof-window/flat-roof-windows.guard';
import {ConfigurationsGuard} from '../store/configuration/configurations.guard';
import {AvailableConfigDataGuard} from '../store/avaiable-config-data/available-config-data.guard';

const routes: Routes = [
  {path: '', component: ConfiguratorComponent},
  {path: 'roof-windows', component: RoofWindowsConfigComponent,
    canActivate: [RoofWindowsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'roof-windows/:configId/:formName/:productCode', component: RoofWindowsConfigComponent,
    canActivate: [RoofWindowsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'flashings', component: FlashingsConfigComponent,
    canActivate: [FlashingsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'flashings/:configId/:formName/:productCode', component: FlashingsConfigComponent,
    canActivate: [FlashingsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'accessories', component: AccessoriesConfigComponent,
    canActivate: [AccessoriesGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'accessories/:configId/:formName/:productCode', component: AccessoriesConfigComponent,
    canActivate: [AccessoriesGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'vertical-windows', component: VerticalWindowsConfigComponent},
  {path: 'flat-roof-windows', component: FlatRoofWindowsConfigComponent,
    canActivate: [FlatRoofWindowsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'flat-roof-windows/:configId/:formName/:productCode', component: FlatRoofWindowsConfigComponent,
    canActivate: [FlatRoofWindowsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'summary', component: ConfigurationSummaryComponent,
    canActivate: [ConfigurationsGuard]},
  {path: 'summary/:configId', component: SingleConfigurationSummaryComponent,
    canActivate: [ConfigurationsGuard]},
  // PL
  {path: 'okna-dachowe', component: RoofWindowsConfigComponent,
    canActivate: [RoofWindowsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'okna-dachowe/:configId/:formName/:productCode', component: RoofWindowsConfigComponent,
    canActivate: [RoofWindowsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'kolnierze', component: FlashingsConfigComponent,
    canActivate: [FlashingsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'kolnierze/:configId/:formName/:productCode', component: FlashingsConfigComponent,
    canActivate: [FlashingsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'akcesoria', component: AccessoriesConfigComponent,
    canActivate: [AccessoriesGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'akcesoria/:configId/:formName/:productCode', component: AccessoriesConfigComponent,
    canActivate: [AccessoriesGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'okna-pionowe', component: VerticalWindowsConfigComponent},
  {path: 'okna-na-dach-plaski', component: FlatRoofWindowsConfigComponent,
    canActivate: [FlatRoofWindowsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'okna-na-dach-plaski/:configId/:formName/:productCode', component: FlatRoofWindowsConfigComponent,
    canActivate: [FlatRoofWindowsGuard, ConfigurationsGuard, AvailableConfigDataGuard]},
  {path: 'podsumowanie', component: ConfigurationSummaryComponent,
    canActivate: [ConfigurationsGuard]},
  {path: 'podsumowanie/:configId', component: SingleConfigurationSummaryComponent,
    canActivate: [ConfigurationsGuard]}
  // DE... FR... IT...
];

@NgModule({
  // TODO czy definicja scrollowania na root działa również na dzieciach? {scrollPositionRestoration: 'enabled'}
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguratorRoutingModule {}

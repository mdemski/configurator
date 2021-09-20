import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoofWindowsConfigComponent} from './roof-windows-config/roof-windows-config.component';
import {FlashingsConfigComponent} from './flashings-config/flashings-config.component';
import {AccessoriesConfigComponent} from './accessories-config/accessories-config.component';
import {VerticalWindowsConfigComponent} from './vertical-windows-config/vertical-windows-config.component';
import {SkylightsConfigComponent} from './skylights-config/skylights-config.component';
import {ConfigurationSummaryComponent} from './configuration-summary/configuration-summary.component';
import {SingleConfigurationSummaryComponent} from './single-configuration-summary/single-configuration-summary.component';
import {ConfiguratorComponent} from './configurator.component';

const routes: Routes = [
  {path: '', component: ConfiguratorComponent},
  {path: 'okna-dachowe', component: RoofWindowsConfigComponent},
  {path: 'okna-dachowe/:configId/:formName/:productCode', component: RoofWindowsConfigComponent},
  {path: 'kolnierze', component: FlashingsConfigComponent},
  {path: 'kolnierze/:configId/:formName/:productCode', component: FlashingsConfigComponent},
  {path: 'akcesoria', component: AccessoriesConfigComponent},
  {path: 'akcesoria/:configId/:formName/:productCode', component: AccessoriesConfigComponent},
  {path: 'okna-pionowe', component: VerticalWindowsConfigComponent},
  {path: 'wylazy-dachowe', component: SkylightsConfigComponent},
  {path: 'podsumowanie', component: ConfigurationSummaryComponent},
  {path: 'podsumowanie/:configId', component: SingleConfigurationSummaryComponent},
];

@NgModule({
  // TODO czy definicja scrollowania na root działa również na dzieciach? {scrollPositionRestoration: 'enabled'}
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguratorRoutingModule {}

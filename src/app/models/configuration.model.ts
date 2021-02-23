import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';

export interface ConfigurationModel {
  window: RoofWindowSkylight | null;
  flashing: Flashing | null;
  accessory: Accessory | null;
}

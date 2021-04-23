import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';

export interface ConfigurationModel {
  user: string;
  userConfigurations: SingleConfiguration[];
}

export interface SingleConfiguration {
  id: number;
  name: string;
  windows: {
    id: number,
    quantity: number,
    window: RoofWindowSkylight
  }[] | null;
  flashings: {
    id: number,
    quantity: number,
    flashing: Flashing
  }[] | null;
  accessories: {
    id: number,
    quantity: number,
    accessory: Accessory
  }[] | null;
}

import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';

export interface ConfigurationRoofWindowModel {
  user: string;
  userConfigurations: {
    id: number,
    windows: {
      id: number,
      quantity: number,
      window: RoofWindowSkylight
    }[] | null,
    flashings: {
      id: number,
      quantity: number,
      flashing: Flashing
    }[] | null,
    accessories: {
      id: number,
      quantity: number,
      accessory: Accessory
    }[] | null
  }[];
}

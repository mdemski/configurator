import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';

export interface SingleConfiguration {
  id: number;
  name: string;
  windows: {
    id: number,
    quantity: number,
    window: RoofWindowSkylight,
    windowFormName: string,
    windowFormData: any
  }[] | null;
  flashings: {
    id: number,
    quantity: number,
    flashing: Flashing,
    flashingFormName: string,
    flashingFormData: any
  }[] | null;
  accessories: {
    id: number,
    quantity: number,
    accessory: Accessory,
    accessoryFormName: string,
    accessoryFormData: any
  }[] | null;
}

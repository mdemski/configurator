import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';
import {VerticalWindow} from './vertical-window';
import {FlatRoofWindow} from './flat-roof-window';

export interface SingleConfiguration {
  user: string;
  id: number;
  name: string;
  products: {
    windows: {
      windowConfig: {
        id: number,
        window: RoofWindowSkylight,
        quantity: number,
        windowFormName: string,
        windowFormData: any
      } | null
    } | null,
    flashings: {
      flashingConfig: {
        id: number,
        flashing: Flashing,
        quantity: number,
        flashingFormName: string,
        flashingFormData: any
      } | null
    } | null,
    accessories: {
      accessoryConfig: {
        id: number,
        accessory: Accessory,
        quantity: number,
        accessoryFormName: string,
        accessoryFormData: any
      } | null
    } | null,
    verticals: {
      verticalConfig: {
        id: number,
        vertical: VerticalWindow,
        quantity: number,
        verticalFormName: string,
        verticalFormData: any
      } | null
    } | null,
    flats: {
      flatConfig: {
        id: number,
        flat: FlatRoofWindow,
        quantity: number,
        flatFormName: string,
        flatFormData: any
      } | null
    } | null
  };
}

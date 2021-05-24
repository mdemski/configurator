import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';
import {VerticalWindow} from './vertical-window';
import {FlatRoofWindow} from './flat-roof-window';

export interface SingleConfiguration {
  id: number,
  name: string,
  products: {
    windowConfig: {
      id: number,
      window: RoofWindowSkylight,
      quantity: number,
      windowFormName: string,
      windowFormData: any
    } | null,
    flashingConfig: {
      id: number,
      flashing: Flashing,
      quantity: number,
      flashingFormName: string,
      flashingFormData: any
    } | null,
    accessoryConfig: {
      id: number,
      accessory: Accessory,
      quantity: number,
      accessoryFormName: string,
      accessoryFormData: any
    } | null,
    verticalConfig: {
      id: number,
      vertical: VerticalWindow,
      quantity: number,
      verticalFormName: string,
      verticalFormData: any
    } | null,
    flatConfig: {
      id: number,
      flat: FlatRoofWindow,
      quantity: number,
      flatFormName: string,
      flatFormData: any
    } | null;
  };
}

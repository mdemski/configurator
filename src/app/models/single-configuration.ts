import {WindowConfig} from './window-config';
import {FlashingConfig} from './flashing-config';
import {AccessoryConfig} from './accessory-config';
import {VerticalConfig} from './vertical-config';
import {FlatConfig} from './flat-config';
import {Address} from './address';

export interface SingleConfiguration {
  _id?: string;
  globalId: string;
  created: Date;
  lastUpdate: Date;
  user: string;
  userId: number;
  name: string;
  installationAddress?: Address;
  emailToSend?: string;
  active: boolean;
  products: {
    windows: Array<WindowConfig> | null,
    flashings: Array<FlashingConfig> | null,
    accessories: Array<AccessoryConfig> | null,
    verticals: Array<VerticalConfig> | null,
    flats: Array<FlatConfig> | null
  };
  comments?: string;
}

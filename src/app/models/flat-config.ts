import {Accessory} from './accessory';
import {FlatRoofWindow} from './flat-roof-window';

export interface FlatConfig {
  id: number;
  flat: FlatRoofWindow | null;
  quantity: number;
  flatFormName: string;
  flatFormData: any | null;
}

import {Accessory} from './accessory';

export interface AccessoryConfig {
  id: number;
  accessory: Accessory | null;
  quantity: number;
  accessoryFormName: string;
  accessoryFormData: any | null;
}

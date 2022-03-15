import {Accessory} from '../../models/accessory';

export class GetAccessories {
  static readonly type = '[Accessory] Get Accessories';
}

export class SetChosenAccessory {
  static readonly type = '[Accessory] Set Chosen Accessory';

  constructor(public accessory: Accessory) {
  }
}

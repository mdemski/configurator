import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';
import {FlatRoofWindow} from './flat-roof-window';
import {VerticalWindow} from './vertical-window';

export class Item {
  private _product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow
  private _quantity: number;
  private _price: number;

  constructor(product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow, quantity: number, price: number) {
    this._product = product;
    this._quantity = quantity;
    this._price = price;
  }

  get product(): RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow {
    return this._product;
  }

  set product(value: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow) {
    this._product = value;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }
}

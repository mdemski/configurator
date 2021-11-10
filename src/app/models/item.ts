import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';
import {FlatRoofWindow} from './flat-roof-window';
import {VerticalWindow} from './vertical-window';

export class Item {
  private _itemId: string;
  private _product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow;
  private _quantity: number;
  private _created: Date;
  private _isOrdered: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(itemId: string, product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow, quantity: number, created: Date, isOrdered: boolean) {
    this._itemId = itemId;
    this._product = product;
    this._quantity = quantity;
    this._created = created;
    this._isOrdered = isOrdered;
  }

  get itemId(): string {
    return this._itemId;
  }

  set itemId(value: string) {
    this._itemId = '_' + Math.random().toString(36).substr(2, 9);
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

  get created(): Date {
    return this._created;
  }

  set created(value: Date) {
    this._created = value;
  }

  get isOrdered(): boolean {
    return this._isOrdered;
  }

  set isOrdered(value: boolean) {
    this._isOrdered = value;
  }
}

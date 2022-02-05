import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {Accessory} from './accessory';
import {FlatRoofWindow} from './flat-roof-window';
import {VerticalWindow} from './vertical-window';

export class Item {
  constructor(private _itemId: string, private _product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow,
              private _quantity: number, private _totalDiscount: number, private _created: Date, private _isOrdered: boolean) {
  }

  get itemId(): string {
    return this._itemId;
  }

  set itemId(value: string) {
    this._itemId = value;
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

  get totalDiscount(): number {
    return this._totalDiscount;
  }

  set totalDiscount(value: number) {
    this._totalDiscount = value;
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

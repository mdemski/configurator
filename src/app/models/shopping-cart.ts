import {Item} from './item';

export class ShoppingCart {
  private _items: Item[];

  constructor(items: Item[]) {
    this._items = items;
  }

  get items(): Item[] {
    return this._items;
  }

  set items(value: Item[]) {
    this._items = value;
  }
}

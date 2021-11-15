import {Item} from './item';

export class Cart {
  private _id: string;
  private _cartItems: Item[];
  private _created: Date;
  private _totalAmount: number;
  private _totalAmountAfterDiscount: number;
  private _currency: string;

  constructor(id: string, cartItems: Item[], created: Date, totalAmount: number, totalAmountAfterDiscount: number, currency: string) {
    this._id = this.id;
    this._cartItems = cartItems;
    this._created = created;
    this._totalAmount = totalAmount;
    this._totalAmountAfterDiscount = totalAmountAfterDiscount;
    this._currency = currency;
  }

  get id(): string {
    return '' + Math.random().toString(36).substr(2, 9);
  }

  set id(value: string) {
    this._id = value;
  }

  get cartItems(): Item[] {
    return this._cartItems;
  }

  set cartItems(value: Item[]) {
    this._cartItems = value;
  }

  get created(): Date {
    return this._created;
  }

  set created(value: Date) {
    this._created = value;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  set totalAmount(value: number) {
    this._totalAmount = value;
  }

  get totalAmountAfterDiscount(): number {
    return this._totalAmountAfterDiscount;
  }

  set totalAmountAfterDiscount(value: number) {
    this._totalAmountAfterDiscount = value;
  }

  get currency(): string {
    return this._currency;
  }

  set currency(value: string) {
    this._currency = value;
  }
}

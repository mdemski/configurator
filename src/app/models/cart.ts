import {Item} from './item';

export class Cart {
  public _id?: string;
  private _cartItems: Item[];
  private _timestamp: number;
  private _totalAmount: number;
  private _totalAmountAfterDiscount: number;
  private _currency: string;

  constructor(id: string, cartItems: Item[], timestamp: number, totalAmount: number, totalAmountAfterDiscount: number, currency: string) {
    this._id = id;
    this._cartItems = cartItems;
    this._timestamp = timestamp;
    this._totalAmount = totalAmount;
    this._totalAmountAfterDiscount = totalAmountAfterDiscount;
    this._currency = currency;
  }

  get id(): string {
    return this._id;
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

  get timestamp(): number {
    return this._timestamp;
  }

  set timestamp(value: number) {
    this._timestamp = value;
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

import {Item} from './item';

export class Cart {
  public _id?: string;
  private _cartItems: Item[];
  private _timestamp: number;
  private _totalAmount: number;
  private _totalAmountAfterDiscount: number;
  private _currency: string;
  private _exchange: number;
  private _active: boolean;
  private _ordered: boolean;

  constructor(id: string, cartItems: Item[], timestamp: number, totalAmount: number, totalAmountAfterDiscount: number, currency: string, exchange: number, active: boolean, ordered: boolean) {
    this._id = id;
    this._cartItems = cartItems;
    this._timestamp = timestamp;
    this._totalAmount = totalAmount;
    this._totalAmountAfterDiscount = totalAmountAfterDiscount;
    this._currency = currency;
    this._exchange = exchange;
    this._active = active;
    this._ordered = ordered;
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

  get exchange(): number {
    return this._exchange;
  }

  set exchange(value: number) {
    this._exchange = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get ordered(): boolean {
    return this._ordered;
  }

  set ordered(value: boolean) {
    this._ordered = value;
  }
}

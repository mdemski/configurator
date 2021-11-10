import {Company} from './company';
import {User} from './user';
import {Item} from './item';

export class Order {
  private _orderNumber: string;
  private _cartId: string;
  private _erpId: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _status: string;
  private _company: Company;
  private _user: User;
  private _items: Item[];
  private _sum: number;
  private _sumAfterDiscount: number;
  private _currency: string;

  // tslint:disable-next-line:max-line-length
  constructor(orderNumber: string, cartId: string, erpId: string, createdAt: Date, updatedAt: Date, status: string, company: Company, user: User, items: Item[], sum: number, sumAfterDiscount: number, currency: string) {
    this._orderNumber = orderNumber;
    this._cartId = cartId;
    this._erpId = erpId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._status = status;
    this._company = company;
    this._user = user;
    this._items = items;
    this._sum = sum;
    this._sumAfterDiscount = sumAfterDiscount;
    this._currency = currency;
  }

  get orderNumber(): string {
    return this._orderNumber;
  }

  set orderNumber(value: string) {
    this._orderNumber = value;
  }

  get cartId(): string {
    return this._cartId;
  }

  set cartId(value: string) {
    this._cartId = value;
  }

  get erpId(): string {
    return this._erpId;
  }

  set erpId(value: string) {
    this._erpId = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get company(): Company {
    return this._company;
  }

  set company(value: Company) {
    this._company = value;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get items(): Item[] {
    return this._items;
  }

  set items(value: Item[]) {
    this._items = value;
  }

  get sum(): number {
    return this._sum;
  }

  set sum(value: number) {
    this._sum = value;
  }

  get sumAfterDiscount(): number {
    return this._sumAfterDiscount;
  }

  set sumAfterDiscount(value: number) {
    this._sumAfterDiscount = value;
  }

  get currency(): string {
    return this._currency;
  }

  set currency(value: string) {
    this._currency = value;
  }
}

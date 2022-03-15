import {Company} from './company';
import {User} from './user';
import {Cart} from './cart';

export class Order {
  private _orderNumber: string;
  private _cart: Cart;
  private _erpId: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _status: string;
  private _company: Company;
  private _user: User;
  private _comments: string;

  constructor(orderNumber: string, cart: Cart, erpId: string, createdAt: Date, updatedAt: Date, status: string, company: Company, user: User, comments: string) {
    this._orderNumber = orderNumber;
    this._cart = cart;
    this._erpId = erpId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._status = status;
    this._company = company;
    this._user = user;
    this._comments = comments;
  }

  get orderNumber(): string {
    return this._orderNumber;
  }

  set orderNumber(value: string) {
    this._orderNumber = value;
  }

  get cart(): Cart {
    return this._cart;
  }

  set cart(value: Cart) {
    this._cart = value;
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

  get comments(): string {
    return this._comments;
  }

  set comments(value: string) {
    this._comments = value;
  }
}

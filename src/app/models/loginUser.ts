import moment from 'moment';

export class LoginUser {

  private _email: string;
  private _username: string;
  private _token: string;
  private _expireDate: Date;

  constructor(email: string, username: string, token: string, expireDate: Date) {
    this._email = email;
    this._username = username;
    this._token = token;
    this._expireDate = expireDate;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  set token(value: string) {
    this._token = value;
  }

  get token() {
    if (!this._expireDate || !moment().isBefore(this._expireDate)) {
      return null;
    }
    return this._token;
  }

  set expireDate(value: Date) {
    this._expireDate = value;
  }

  get expireDate(): Date {
    return this._expireDate;
  }
}

import {Address} from './address';

export class User {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _password: string;
  private _rePassword: string;
  private _role: string;
  private _activated: boolean;
  private _uuid: string;
  private _discount: number;
  private _companyNip: string;
  private _address: Address;

  // tslint:disable-next-line:max-line-length
  constructor(firstName: string, lastName: string, email: string, password: string, rePassword: string, role: string, activated: boolean, uuid: string, discount: number, companyNip: string, address: Address) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._password = password;
    this._rePassword = rePassword;
    this._role = role;
    this._activated = activated;
    this._uuid = uuid;
    this._discount = discount;
    this._companyNip = companyNip;
    this._address = address;
  }


  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get rePassword(): string {
    return this._rePassword;
  }

  set rePassword(value: string) {
    this._rePassword = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }

  get activated(): boolean {
    return this._activated;
  }

  set activated(value: boolean) {
    this._activated = value;
  }

  get uuid(): string {
    return this._uuid;
  }

  set uuid(value: string) {
    this._uuid = value;
  }

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = value;
  }

  get companyNip(): string {
    return this._companyNip;
  }

  set companyNip(value: string) {
    this._companyNip = value;
  }

  get address(): Address {
    return this._address;
  }

  set address(value: Address) {
    this._address = value;
  }
}

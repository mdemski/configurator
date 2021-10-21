export class User {
  public _id?: string;
  private _email: string;
  private _password: string;
  private _rePassword: string;
  private _role: string;
  private _activated: boolean;
  private _uuid: string;
  private _discount: number;
  private _companyNip: string;
  private _ipAddress?: string;

  // tslint:disable-next-line:max-line-length
  constructor(id: string, email: string, password: string, rePassword: string, role: string, activated: boolean, uuid: string, discount: number, companyNip: string, ipAddress: string) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._rePassword = rePassword;
    this._role = role;
    this._activated = activated;
    this._uuid = uuid;
    this._discount = discount;
    this._companyNip = companyNip;
    this._ipAddress = ipAddress;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
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

  get ipAddress(): string {
    return this._ipAddress;
  }

  set ipAddress(value: string) {
    this._ipAddress = value;
  }
}

export class User {
  public _id?: string;
  private _email: string;
  private _password: string;
  private _rePassword: string;
  private _name: string;
  private _role: string;
  private _activated: boolean;
  private _uuid: string;
  private _basicDiscount: number;
  private _roofWindowsDiscount: number;
  private _skylightsDiscount: number;
  private _flashingsDiscount: number;
  private _accessoriesDiscount: number;
  private _flatRoofWindowsDiscount: number;
  private _verticalWindowsDiscount: number;
  private _companyNip: string;
  private _mainAddressId?: string;
  private _addressToSendId?: string;
  private _activationLink: string;
  private _created: Date;
  private _lastUpdate: Date;

  // tslint:disable-next-line:max-line-length
  constructor(id: string, email: string, password: string, rePassword: string, name: string, role: string, activated: boolean, uuid: string, basicDiscount: number, roofWindowsDiscount: number, skylightsDiscount: number, flashingsDiscount: number, accessoriesDiscount: number, flatRoofWindowsDiscount: number, verticalWindowsDiscount: number, companyNip: string, mainAddressId: string, addressToSendId: string, activationLink: string, created: Date, lastUpdate: Date) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._rePassword = rePassword;
    this._name = name;
    this._role = role;
    this._activated = activated;
    this._uuid = uuid;
    this._basicDiscount = basicDiscount;
    this._roofWindowsDiscount = roofWindowsDiscount;
    this._skylightsDiscount = skylightsDiscount;
    this._flashingsDiscount = flashingsDiscount;
    this._accessoriesDiscount = accessoriesDiscount;
    this._flatRoofWindowsDiscount = flatRoofWindowsDiscount;
    this._verticalWindowsDiscount = verticalWindowsDiscount;
    this._companyNip = companyNip;
    this._mainAddressId = mainAddressId;
    this._addressToSendId = addressToSendId;
    this._activationLink = activationLink;
    this._created = created;
    this._lastUpdate = lastUpdate;
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

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
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

  get basicDiscount(): number {
    return this._basicDiscount;
  }

  set basicDiscount(value: number) {
    this._basicDiscount = value;
  }

  get roofWindowsDiscount(): number {
    return this._roofWindowsDiscount;
  }

  set roofWindowsDiscount(value: number) {
    this._roofWindowsDiscount = value;
  }

  get skylightsDiscount(): number {
    return this._skylightsDiscount;
  }

  set skylightsDiscount(value: number) {
    this._skylightsDiscount = value;
  }

  get flashingsDiscount(): number {
    return this._flashingsDiscount;
  }

  set flashingsDiscount(value: number) {
    this._flashingsDiscount = value;
  }

  get accessoriesDiscount(): number {
    return this._accessoriesDiscount;
  }

  set accessoriesDiscount(value: number) {
    this._accessoriesDiscount = value;
  }

  get flatRoofWindowsDiscount(): number {
    return this._flatRoofWindowsDiscount;
  }

  set flatRoofWindowsDiscount(value: number) {
    this._flatRoofWindowsDiscount = value;
  }

  get verticalWindowsDiscount(): number {
    return this._verticalWindowsDiscount;
  }

  set verticalWindowsDiscount(value: number) {
    this._verticalWindowsDiscount = value;
  }

  get companyNip(): string {
    return this._companyNip;
  }

  set companyNip(value: string) {
    this._companyNip = value;
  }

  get mainAddressId(): string {
    return this._mainAddressId;
  }

  set mainAddressId(value: string) {
    this._mainAddressId = value;
  }

  get addressToSendId(): string {
    return this._addressToSendId;
  }

  set addressToSendId(value: string) {
    this._addressToSendId = value;
  }

  get activationLink(): string {
    return this._activationLink;
  }

  set activationLink(value: string) {
    this._activationLink = value;
  }

  get created(): Date {
    return this._created;
  }

  set created(value: Date) {
    this._created = value;
  }

  get lastUpdate(): Date {
    return this._lastUpdate;
  }

  set lastUpdate(value: Date) {
    this._lastUpdate = value;
  }
}

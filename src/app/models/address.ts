export class Address {
  private _id?: string;
  private _firstName: string;
  private _lastName: string;
  private _phoneNumber: string;
  private _street: string;
  private _localNumber: string;
  private _zipCode: string;
  private _city: string;
  private _country: string;
  // private _localization: {
  //   coordinateA: number;
  //   coordinateB: number;
  // };

  // tslint:disable-next-line:max-line-length
  constructor(firstName: string, lastName: string, phoneNumber: string, street: string, localNumber: string, zipCode: string, city: string, country: string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._phoneNumber = phoneNumber;
    this._street = street;
    this._localNumber = localNumber;
    this._zipCode = zipCode;
    this._city = city;
    this._country = country;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
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

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get street(): string {
    return this._street;
  }

  set street(value: string) {
    this._street = value;
  }

  get localNumber(): string {
    return this._localNumber;
  }

  set localNumber(value: string) {
    this._localNumber = value;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  set zipCode(value: string) {
    this._zipCode = value;
  }

  get city(): string {
    return this._city;
  }

  set city(value: string) {
    this._city = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }
}

export class Address {
  private _firstName: string;
  private _lastName: string;
  private _phoneNumber: string;
  private _street: string;
  private _address: string;
  private _zipCode: string;
  private _country: string;
  private _localization: {
    coordinateA: number;
    coordinateB: number;
  };

  constructor(firstName: string, lastName: string, phoneNumber: string, street: string, address: string, zipCode: string, country: string, localization: { coordinateA: number; coordinateB: number }) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._phoneNumber = phoneNumber;
    this._street = street;
    this._address = address;
    this._zipCode = zipCode;
    this._country = country;
    this._localization = localization;
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

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  set zipCode(value: string) {
    this._zipCode = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get localization(): { coordinateA: number; coordinateB: number } {
    return this._localization;
  }

  set localization(value: { coordinateA: number; coordinateB: number }) {
    this._localization = value;
  }
}

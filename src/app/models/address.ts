interface Localization {
  coordinateA: number;
  coordinateB: number;
}

export class Address {
  private _street: string;
  private _address: string;
  private _zipCode: string;
  private _country: string;
  private _localization: Localization;

  constructor(street: string, address: string, zipCode: string, country: string, localization: Localization) {
    this._street = street;
    this._address = address;
    this._zipCode = zipCode;
    this._country = country;
    this._localization = localization;
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

  get localization(): Localization {
    return this._localization;
  }

  set localization(value: Localization) {
    this._localization = value;
  }
}

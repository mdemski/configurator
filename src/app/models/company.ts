export class Company {
  private _name: string;
  private _nip: string;
  private _street: string;
  private _number: string;
  private _zipCode: string;
  private _agent: string;


  constructor(name: string, nip: string, street: string, number: string, zipCode: string, agent: string) {
    this._name = name;
    this._nip = nip;
    this._street = street;
    this._number = number;
    this._zipCode = zipCode;
    this._agent = agent;
  }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get nip(): string {
    return this._nip;
  }

  set nip(value: string) {
    this._nip = value;
  }

  get street(): string {
    return this._street;
  }

  set street(value: string) {
    this._street = value;
  }

  get number(): string {
    return this._number;
  }

  set number(value: string) {
    this._number = value;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  set zipCode(value: string) {
    this._zipCode = value;
  }

  get agent(): string {
    return this._agent;
  }

  set agent(value: string) {
    this._agent = value;
  }
}

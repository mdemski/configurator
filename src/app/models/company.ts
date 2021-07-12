export class Company {
  private _name: string;
  private _nip: string;
  private _street: string;
  private _address: string;
  private _zipCode: string;
  private _agentOkpol: string;


  constructor(name: string, nip: string, street: string, address: string, zipCode: string, agentOkpol: string) {
    this._name = name;
    this._nip = nip;
    this._street = street;
    this._address = address;
    this._zipCode = zipCode;
    this._agentOkpol = agentOkpol;
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

  get agentOkpol(): string {
    return this._agentOkpol;
  }

  set agentOkpol(value: string) {
    this._agentOkpol = value;
  }
}

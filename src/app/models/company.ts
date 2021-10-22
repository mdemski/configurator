import {Order} from './order';
import {Address} from './address';

export class Company {
  private _name: string;
  private _nip: string;
  private _discount: number;
  private _address: Address;
  private _agentOkpol: string;
  private _salesVolume: number;
  private _salesVolumeLastYear: number;
  private _salesVolumeTwoYears: number;
  private _orders: Order[];
  private _logotype: File;

  // tslint:disable-next-line:max-line-length
  constructor(name: string, nip: string, discount: number, address: Address, agentOkpol: string, salesVolume: number, salesVolumeLastYear: number, salesVolumeTwoYears: number, orders: Order[], logotype: File) {
    this._name = name;
    this._nip = nip;
    this._discount = discount;
    this._address = address;
    this._agentOkpol = agentOkpol;
    this._salesVolume = salesVolume;
    this._salesVolumeLastYear = salesVolumeLastYear;
    this._salesVolumeTwoYears = salesVolumeTwoYears;
    this._orders = orders;
    this._logotype = logotype;
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

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = value;
  }

  get address(): Address {
    return this._address;
  }

  set address(value: Address) {
    this._address = value;
  }

  get agentOkpol(): string {
    return this._agentOkpol;
  }

  set agentOkpol(value: string) {
    this._agentOkpol = value;
  }

  get salesVolume(): number {
    return this._salesVolume;
  }

  set salesVolume(value: number) {
    this._salesVolume = value;
  }

  get salesVolumeLastYear(): number {
    return this._salesVolumeLastYear;
  }

  set salesVolumeLastYear(value: number) {
    this._salesVolumeLastYear = value;
  }

  get salesVolumeTwoYears(): number {
    return this._salesVolumeTwoYears;
  }

  set salesVolumeTwoYears(value: number) {
    this._salesVolumeTwoYears = value;
  }

  get orders(): Order[] {
    return this._orders;
  }

  set orders(value: Order[]) {
    this._orders = value;
  }

  get logotype(): File {
    return this._logotype;
  }

  set logotype(value: File) {
    this._logotype = value;
  }
}

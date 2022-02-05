import {Order} from './order';
import {Address} from './address';
import {Invoice} from './invoice';


export class Company {
  private _companyCode: string;
  private _name: string;
  private _email: string;
  private _nip: string;
  private _basicDiscount: number;
  private _roofWindowsDiscount: number;
  private _skylightsDiscount: number;
  private _flashingsDiscount: number;
  private _accessoriesDiscount: number;
  private _flatRoofWindowsDiscount: number;
  private _verticalWindowsDiscount: number;
  private _tradeCredit: number;
  private _address: Address;
  private _agentOkpol: string;
  private _salesVolume: number;
  private _salesVolumeLastYear: number;
  private _roofWindowsSalesVolume: number;
  private _flashingsSalesVolume: number;
  private _accessoriesSalesVolume: number;
  private _skylightsSalesVolume: number;
  private _flatRoofWindowsSalesVolume: number;
  private _verticalWindowsSalesVolume: number;
  private _orders: Order[];
  private _invoices: Invoice[];
  private _logotype: File;

  // tslint:disable-next-line:max-line-length
  constructor(companyCode: string, name: string, email: string, nip: string, basicDiscount: number, roofWindowsDiscount: number, skylightsDiscount: number, flashingsDiscount: number, accessoriesDiscount: number, flatRoofWindowsDiscount: number, verticalWindowsDiscount: number, tradeCredit: number, address: Address, agentOkpol: string, salesVolume: number, salesVolumeLastYear: number, roofWindowsSalesVolume: number, flashingsSalesVolume: number, accessoriesSalesVolume: number, skylightsSalesVolume: number, flatRoofWindowsSalesVolume: number, verticalWindowsSalesVolume: number, orders: Order[], invoices: Invoice[], logotype: File) {
    this._companyCode = companyCode;
    this._name = name;
    this._email = email;
    this._nip = nip;
    this._basicDiscount = basicDiscount;
    this._roofWindowsDiscount = roofWindowsDiscount;
    this._skylightsDiscount = skylightsDiscount;
    this._flashingsDiscount = flashingsDiscount;
    this._accessoriesDiscount = accessoriesDiscount;
    this._flatRoofWindowsDiscount = flatRoofWindowsDiscount;
    this._verticalWindowsDiscount = verticalWindowsDiscount;
    this._tradeCredit = tradeCredit;
    this._address = address;
    this._agentOkpol = agentOkpol;
    this._salesVolume = salesVolume;
    this._salesVolumeLastYear = salesVolumeLastYear;
    this._roofWindowsSalesVolume = roofWindowsSalesVolume;
    this._flashingsSalesVolume = flashingsSalesVolume;
    this._accessoriesSalesVolume = accessoriesSalesVolume;
    this._skylightsSalesVolume = skylightsSalesVolume;
    this._flatRoofWindowsSalesVolume = flatRoofWindowsSalesVolume;
    this._verticalWindowsSalesVolume = verticalWindowsSalesVolume;
    this._orders = orders;
    this._invoices = invoices;
    this._logotype = logotype;
  }

  get companyCode(): string {
    return this._companyCode;
  }

  set companyCode(value: string) {
    this._companyCode = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get nip(): string {
    return this._nip;
  }

  set nip(value: string) {
    this._nip = value;
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

  get tradeCredit(): number {
    return this._tradeCredit;
  }

  set tradeCredit(value: number) {
    this._tradeCredit = value;
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

  get roofWindowsSalesVolume(): number {
    return this._roofWindowsSalesVolume;
  }

  set roofWindowsSalesVolume(value: number) {
    this._roofWindowsSalesVolume = value;
  }

  get flashingsSalesVolume(): number {
    return this._flashingsSalesVolume;
  }

  set flashingsSalesVolume(value: number) {
    this._flashingsSalesVolume = value;
  }

  get accessoriesSalesVolume(): number {
    return this._accessoriesSalesVolume;
  }

  set accessoriesSalesVolume(value: number) {
    this._accessoriesSalesVolume = value;
  }

  get skylightsSalesVolume(): number {
    return this._skylightsSalesVolume;
  }

  set skylightsSalesVolume(value: number) {
    this._skylightsSalesVolume = value;
  }

  get flatRoofWindowsSalesVolume(): number {
    return this._flatRoofWindowsSalesVolume;
  }

  set flatRoofWindowsSalesVolume(value: number) {
    this._flatRoofWindowsSalesVolume = value;
  }

  get verticalWindowsSalesVolume(): number {
    return this._verticalWindowsSalesVolume;
  }

  set verticalWindowsSalesVolume(value: number) {
    this._verticalWindowsSalesVolume = value;
  }

  get orders(): Order[] {
    return this._orders;
  }

  set orders(value: Order[]) {
    this._orders = value;
  }

  get invoices(): Invoice[] {
    return this._invoices;
  }

  set invoices(value: Invoice[]) {
    this._invoices = value;
  }

  get logotype(): File {
    return this._logotype;
  }

  set logotype(value: File) {
    this._logotype = value;
  }
}

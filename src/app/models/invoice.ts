export class Invoice {
  private _fvNumber: string;
  private _createdAt: Date;
  private _deliveryDate: Date;
  private _totalNetValue: number;
  private _currency: string;
  private _vat: number;
  private _grossAmount: number;
  private _correctionReason: string;
  private _correctionAmount: number;
  private _isPaid: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(fvNumber: string, createdAt: Date, deliveryDate: Date, totalNetValue: number, currency: string, vat: number, grossAmount: number, correctionReason: string, correctionAmount: number, isPaid: boolean) {
    this._fvNumber = fvNumber;
    this._createdAt = createdAt;
    this._deliveryDate = deliveryDate;
    this._totalNetValue = totalNetValue;
    this._currency = currency;
    this._vat = vat;
    this._grossAmount = grossAmount;
    this._correctionReason = correctionReason;
    this._correctionAmount = correctionAmount;
    this._isPaid = isPaid;
  }

  get fvNumber(): string {
    return this._fvNumber;
  }

  set fvNumber(value: string) {
    this._fvNumber = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get deliveryDate(): Date {
    return this._deliveryDate;
  }

  set deliveryDate(value: Date) {
    this._deliveryDate = value;
  }

  get totalNetValue(): number {
    return this._totalNetValue;
  }

  set totalNetValue(value: number) {
    this._totalNetValue = value;
  }

  get currency(): string {
    return this._currency;
  }

  set currency(value: string) {
    this._currency = value;
  }

  get vat(): number {
    return this._vat;
  }

  set vat(value: number) {
    this._vat = value;
  }

  get grossAmount(): number {
    return this._grossAmount;
  }

  set grossAmount(value: number) {
    this._grossAmount = value;
  }

  get correctionReason(): string {
    return this._correctionReason;
  }

  set correctionReason(value: string) {
    this._correctionReason = value;
  }

  get correctionAmount(): number {
    return this._correctionAmount;
  }

  set correctionAmount(value: number) {
    this._correctionAmount = value;
  }

  get isPaid(): boolean {
    return this._isPaid;
  }

  set isPaid(value: boolean) {
    this._isPaid = value;
  }
}

import {Company} from './company';
import {Address} from './address';
import {ComplaintItem} from './complaintItem';
import {User} from './user';

export class Complaint {
  private _erpNumber: string;
  private _registrationDate: Date;
  private _topic;
  private _status: string;
  private _phone: string;
  private _email: string;
  private _documentationCompletionDate: Date;
  private _leadingOperator;
  private _items: ComplaintItem[];
  private _owner: Company | User;
  private _applicant;
  private _defectAddress: Address;
  private _installationDate: Date;
  private _buyingDate: Date;
  private _detectedDate: Date;
  private _startUsingDate: Date;

  // tslint:disable-next-line:max-line-length
  constructor(erpNumber: string, registrationDate: Date, topic, status: string, phone: string, email: string, documentationCompletionDate: Date, leadingOperator, items: ComplaintItem[], owner: Company | User, applicant, defectAddress: Address, installationDate: Date, buyingDate: Date, detectedDate: Date, startUsingDate: Date) {
    this._erpNumber = erpNumber;
    this._registrationDate = registrationDate;
    this._topic = topic;
    this._status = status;
    this._phone = phone;
    this._email = email;
    this._documentationCompletionDate = documentationCompletionDate;
    this._leadingOperator = leadingOperator;
    this._items = items;
    this._owner = owner;
    this._applicant = applicant;
    this._defectAddress = defectAddress;
    this._installationDate = installationDate;
    this._buyingDate = buyingDate;
    this._detectedDate = detectedDate;
    this._startUsingDate = startUsingDate;
  }

  get erpNumber(): string {
    return this._erpNumber;
  }

  set erpNumber(value: string) {
    this._erpNumber = value;
  }

  get registrationDate(): Date {
    return this._registrationDate;
  }

  set registrationDate(value: Date) {
    this._registrationDate = value;
  }

  get topic() {
    return this._topic;
  }

  set topic(value) {
    this._topic = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get documentationCompletionDate(): Date {
    return this._documentationCompletionDate;
  }

  set documentationCompletionDate(value: Date) {
    this._documentationCompletionDate = value;
  }

  get leadingOperator() {
    return this._leadingOperator;
  }

  set leadingOperator(value) {
    this._leadingOperator = value;
  }

  get items(): ComplaintItem[] {
    return this._items;
  }

  set items(value: ComplaintItem[]) {
    this._items = value;
  }

  get owner(): Company | User {
    return this._owner;
  }

  set owner(value: Company | User) {
    this._owner = value;
  }

  get applicant() {
    return this._applicant;
  }

  set applicant(value) {
    this._applicant = value;
  }

  get defectAddress(): Address {
    return this._defectAddress;
  }

  set defectAddress(value: Address) {
    this._defectAddress = value;
  }

  get installationDate(): Date {
    return this._installationDate;
  }

  set installationDate(value: Date) {
    this._installationDate = value;
  }

  get buyingDate(): Date {
    return this._buyingDate;
  }

  set buyingDate(value: Date) {
    this._buyingDate = value;
  }

  get detectedDate(): Date {
    return this._detectedDate;
  }

  set detectedDate(value: Date) {
    this._detectedDate = value;
  }

  get startUsingDate(): Date {
    return this._startUsingDate;
  }

  set startUsingDate(value: Date) {
    this._startUsingDate = value;
  }
}

import {Company} from './company';

export class Task {
  private _erpNumber: string;
  private _registrationDate: Date;
  private _topic;
  private _description;
  private _priority;
  private _status: string;
  private _phone: string;
  private _email: string;
  private _leadingOperator;
  private _nextStepDate: Date;
  private _deadlineDate: Date;
  private _owner: Company;
  private _updatedAt: Date;
  private _isRead: boolean;
  private _crmProject: string;

  // tslint:disable-next-line:max-line-length
  constructor(erpNumber: string, registrationDate: Date, topic, description, priority, status: string, phone: string, email: string, leadingOperator, nextStepDate: Date, deadlineDate: Date, owner: Company, updatedAt: Date, isRead: boolean, crmProject: string) {
    this._erpNumber = erpNumber;
    this._registrationDate = registrationDate;
    this._topic = topic;
    this._description = description;
    this._priority = priority;
    this._status = status;
    this._phone = phone;
    this._email = email;
    this._leadingOperator = leadingOperator;
    this._nextStepDate = nextStepDate;
    this._deadlineDate = deadlineDate;
    this._owner = owner;
    this._updatedAt = updatedAt;
    this._isRead = isRead;
    this._crmProject = crmProject;
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

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  get priority() {
    return this._priority;
  }

  set priority(value) {
    this._priority = value;
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

  get leadingOperator() {
    return this._leadingOperator;
  }

  set leadingOperator(value) {
    this._leadingOperator = value;
  }

  get nextStepDate(): Date {
    return this._nextStepDate;
  }

  set nextStepDate(value: Date) {
    this._nextStepDate = value;
  }

  get deadlineDate(): Date {
    return this._deadlineDate;
  }

  set deadlineDate(value: Date) {
    this._deadlineDate = value;
  }

  get owner(): Company {
    return this._owner;
  }

  set owner(value: Company) {
    this._owner = value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  set isRead(value: boolean) {
    this._isRead = value;
  }

  get crmProject(): string {
    return this._crmProject;
  }

  set crmProject(value: string) {
    this._crmProject = value;
  }
}

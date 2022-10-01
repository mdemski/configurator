export class Advice {
  private _id: string;
  private _title: string;
  private _type: string;
  private _content: { sectionHeader: string, sectionText: string }[];
  private _category: string;
  private _picture: string;
  private _link: string;
  private _added: Date;
  private _short: string;
  private _recipients: string;
  private _active: boolean;
  private _language: string;


  constructor(id: string, title: string, type: string, content: { sectionHeader: string; sectionText: string }[], category: string,
              picture: string, link: string, added: Date, short: string, recipients: string, active: boolean, language: string) {
    this._id = id;
    this._title = title;
    this._type = type;
    this._content = content;
    this._category = category;
    this._picture = picture;
    this._link = link;
    this._added = added;
    this._short = short;
    this._recipients = recipients;
    this._active = active;
    this._language = language;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get content(): { sectionHeader: string; sectionText: string }[] {
    return this._content;
  }

  set content(value: { sectionHeader: string; sectionText: string }[]) {
    this._content = value;
  }

  get category(): string {
    return this._category;
  }

  set category(value: string) {
    this._category = value;
  }

  get picture(): string {
    return this._picture;
  }

  set picture(value: string) {
    this._picture = value;
  }

  get link(): string {
    return this._link;
  }

  set link(value: string) {
    this._link = value;
  }

  get added(): Date {
    return this._added;
  }

  set added(value: Date) {
    this._added = value;
  }

  get short(): string {
    return this._short;
  }

  set short(value: string) {
    this._short = value;
  }

  get recipients(): string {
    return this._recipients;
  }

  set recipients(value: string) {
    this._recipients = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get language(): string {
    return this._language;
  }

  set language(value: string) {
    this._language = value;
  }
}

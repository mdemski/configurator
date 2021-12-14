import {RoofWindowSkylight} from './roof-window-skylight';
import {Flashing} from './flashing';
import {FlatRoofWindow} from './flat-roof-window';
import {VerticalWindow} from './vertical-window';
import {Accessory} from './accessory';

export class ComplaintItem {
  private _id?: string;
  private _product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow;
  private _quantity: number;
  private _complaintType: string; // list rodzajów reklamacji do wyboru (synchronizowany słownik z eNova)
  private _element: string; // list elementów reklamowanego wyrobu do wyboru (synchronizowany słownik z eNova)
  private _localization: string; // list lokalizacji w reklamowanym wyrobie do wyboru (synchronizowany słownik z eNova)
  private _description: string;
  private _dataPlateNumber: string;
  private _attachment: File[];

  // tslint:disable-next-line:max-line-length
  constructor(id: string, product: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow, quantity: number, complaintType: string, element: string, localization: string, description: string, dataPlateNumber: string, attachment: File[]) {
    this._id = id;
    this._product = product;
    this._quantity = quantity;
    this._complaintType = complaintType;
    this._element = element;
    this._localization = localization;
    this._description = description;
    this._dataPlateNumber = dataPlateNumber;
    this._attachment = attachment;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get product(): RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow {
    return this._product;
  }

  set product(value: RoofWindowSkylight | Flashing | Accessory | FlatRoofWindow | VerticalWindow) {
    this._product = value;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
  }

  get complaintType(): string {
    return this._complaintType;
  }

  set complaintType(value: string) {
    this._complaintType = value;
  }

  get element(): string {
    return this._element;
  }

  set element(value: string) {
    this._element = value;
  }

  get localization(): string {
    return this._localization;
  }

  set localization(value: string) {
    this._localization = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get dataPlateNumber(): string {
    return this._dataPlateNumber;
  }

  set dataPlateNumber(value: string) {
    this._dataPlateNumber = value;
  }

  get attachment(): File[] {
    return this._attachment;
  }

  set attachment(value: File[]) {
    this._attachment = value;
  }
}

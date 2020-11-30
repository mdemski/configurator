export class Accessory {
  private _accessoryId: number;
  private _accessoryName: string;
  private _accessoryModel: string;
  private _accessoryWidth: number;
  private _accessoryHeight: number;
  private _accessoryCategory: string;
  private _accessorySubCategory: string;
  private _accessoryType: string; // A-E dopasowanie do stolarki
  private _accessoryMaterialType: string;
  private _accessoryMaterialColor: string;
  private _accessoryMaterialFinish: string; // kolor dodatków takich jak prowadnice
  private _accessoryHorizontalSpacing: number; // czy montowane dwa okna jedno pod drugim? Jeśli tak to y=25cm
  private _accessoryClosureType: string;
  private _accessoryNameplateNumber: string;
  private _accessoryPrice: number;

  // tslint:disable-next-line:max-line-length
  constructor(accessoryId: number, accessoryName: string, accessoryModel: string, accessoryWidth: number, accessoryHeight: number, accessoryCategory: string, accessorySubCategory: string, accessoryType: string, accessoryMaterialType: string, accessoryMaterialColor: string, accessoryMaterialFinish: string, accessoryHorizontalSpacing: number, accessoryClosureType: string, accessoryNameplateNumber: string, accessoryPrice: number) {
    this._accessoryId = accessoryId;
    this._accessoryName = accessoryName;
    this._accessoryModel = accessoryModel;
    this._accessoryWidth = accessoryWidth;
    this._accessoryHeight = accessoryHeight;
    this._accessoryCategory = accessoryCategory;
    this._accessorySubCategory = accessorySubCategory;
    this._accessoryType = accessoryType;
    this._accessoryMaterialType = accessoryMaterialType;
    this._accessoryMaterialColor = accessoryMaterialColor;
    this._accessoryMaterialFinish = accessoryMaterialFinish;
    this._accessoryHorizontalSpacing = accessoryHorizontalSpacing;
    this._accessoryClosureType = accessoryClosureType;
    this._accessoryNameplateNumber = accessoryNameplateNumber;
    this._accessoryPrice = accessoryPrice;
  }


  get accessoryId(): number {
    return this._accessoryId;
  }

  set accessoryId(value: number) {
    this._accessoryId = value;
  }

  get accessoryName(): string {
    return this._accessoryName;
  }

  set accessoryName(value: string) {
    this._accessoryName = value;
  }

  get accessoryModel(): string {
    return this._accessoryModel;
  }

  set accessoryModel(value: string) {
    this._accessoryModel = value;
  }

  get accessoryWidth(): number {
    return this._accessoryWidth;
  }

  set accessoryWidth(value: number) {
    this._accessoryWidth = value;
  }

  get accessoryHeight(): number {
    return this._accessoryHeight;
  }

  set accessoryHeight(value: number) {
    this._accessoryHeight = value;
  }

  get accessoryCategory(): string {
    return this._accessoryCategory;
  }

  set accessoryCategory(value: string) {
    this._accessoryCategory = value;
  }

  get accessorySubCategory(): string {
    return this._accessorySubCategory;
  }

  set accessorySubCategory(value: string) {
    this._accessorySubCategory = value;
  }

  get accessoryType(): string {
    return this._accessoryType;
  }

  set accessoryType(value: string) {
    this._accessoryType = value;
  }

  get accessoryMaterialType(): string {
    return this._accessoryMaterialType;
  }

  set accessoryMaterialType(value: string) {
    this._accessoryMaterialType = value;
  }

  get accessoryMaterialColor(): string {
    return this._accessoryMaterialColor;
  }

  set accessoryMaterialColor(value: string) {
    this._accessoryMaterialColor = value;
  }

  get accessoryMaterialFinish(): string {
    return this._accessoryMaterialFinish;
  }

  set accessoryMaterialFinish(value: string) {
    this._accessoryMaterialFinish = value;
  }

  get accessoryHorizontalSpacing(): number {
    return this._accessoryHorizontalSpacing;
  }

  set accessoryHorizontalSpacing(value: number) {
    this._accessoryHorizontalSpacing = value;
  }

  get accessoryClosureType(): string {
    return this._accessoryClosureType;
  }

  set accessoryClosureType(value: string) {
    this._accessoryClosureType = value;
  }

  get accessoryNameplateNumber(): string {
    return this._accessoryNameplateNumber;
  }

  set accessoryNameplateNumber(value: string) {
    this._accessoryNameplateNumber = value;
  }

  get accessoryPrice(): number {
    return this._accessoryPrice;
  }

  set accessoryPrice(value: number) {
    this._accessoryPrice = value;
  }
}

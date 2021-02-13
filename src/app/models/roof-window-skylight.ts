export class RoofWindowSkylight {
  private _windowId: number;
  private _windowName: string;
  private _windowModel: string;
  private _windowGlazing: string;
  private _windowWidth: number;
  private _windowHeight: number;
  private _windowCategory: string;
  private _windowSubCategory: string;
  private _windowGeometry: string;
  private _windowOpeningType: string;
  private _windowVentilation: string;
  private _windowMaterial: string;
  private _windowMaterialColor: string;
  private _windowMaterialFinish: string;
  private _windowOuterMaterial: string;
  private _windowOuterColor: string;
  private _windowOuterFinish: string;
  private _windowHandleType: string;
  private _windowHandleColor: string;
  private _windowHardware: boolean;
  private _windowMountingAngle: string;
  private _windowExtras: any[];
  private _windowCoats: any[];
  private _windowUrlLink: string;
  private _windowPrice: number;
  private _windowUW: number;
  private _windowUG: number;

  // tslint:disable-next-line:max-line-length
  constructor(windowId: number, windowName: string, windowModel: string, windowGlazing: string, windowWidth: number, windowHeight: number, windowCategory: string, windowSubCategory: string, windowGeometry: string, windowOpeningType: string, windowVentilation: string, windowMaterial: string, windowMaterialColor: string, windowMaterialFinish: string, windowOuterMaterial: string, windowOuterColor: string, windowOuterFinish: string, windowHandleType: string, windowHandleColor: string, windowHardware: boolean, windowMountingAngle: string, windowExtras: [], windowCoats: [], windowUrlLink: string, windowPrice: number, windowUW: number, windowUG: number) {
    this._windowId = windowId;
    this._windowName = windowName;
    this._windowModel = windowModel;
    this._windowGlazing = windowGlazing;
    this._windowWidth = windowWidth;
    this._windowHeight = windowHeight;
    this._windowCategory = windowCategory;
    this._windowSubCategory = windowSubCategory;
    this._windowGeometry = windowGeometry;
    this._windowOpeningType = windowOpeningType;
    this._windowVentilation = windowVentilation;
    this._windowMaterial = windowMaterial;
    this._windowMaterialColor = windowMaterialColor;
    this._windowMaterialFinish = windowMaterialFinish;
    this._windowOuterMaterial = windowOuterMaterial;
    this._windowOuterColor = windowOuterColor;
    this._windowOuterFinish = windowOuterFinish;
    this._windowHandleType = windowHandleType;
    this._windowHandleColor = windowHandleColor;
    this._windowHardware = windowHardware;
    this._windowMountingAngle = windowMountingAngle;
    this._windowExtras = windowExtras;
    this._windowUrlLink = windowUrlLink;
    this._windowPrice = windowPrice;
    this._windowUW = windowUW;
    this._windowUG = windowUG;
    this._windowCoats = windowCoats;
  }


  get windowId(): number {
    return this._windowId;
  }

  set windowId(value: number) {
    this._windowId = value;
  }

  get windowName(): string {
    return this._windowName;
  }

  set windowName(value: string) {
    this._windowName = value;
  }

  get windowModel(): string {
    return this._windowModel;
  }

  set windowModel(value: string) {
    this._windowModel = value;
  }

  get windowGlazing(): string {
    return this._windowGlazing;
  }

  set windowGlazing(value: string) {
    this._windowGlazing = value;
  }

  get windowWidth(): number {
    return this._windowWidth;
  }

  set windowWidth(value: number) {
    this._windowWidth = value;
  }

  get windowHeight(): number {
    return this._windowHeight;
  }

  set windowHeight(value: number) {
    this._windowHeight = value;
  }

  get windowCategory(): string {
    return this._windowCategory;
  }

  set windowCategory(value: string) {
    this._windowCategory = value;
  }

  get windowSubCategory(): string {
    return this._windowSubCategory;
  }

  set windowSubCategory(value: string) {
    this._windowSubCategory = value;
  }

  get windowGeometry(): string {
    return this._windowGeometry;
  }

  set windowGeometry(value: string) {
    this._windowGeometry = value;
  }

  get windowOpeningType(): string {
    return this._windowOpeningType;
  }

  set windowOpeningType(value: string) {
    this._windowOpeningType = value;
  }

  get windowVentilation(): string {
    return this._windowVentilation;
  }

  set windowVentilation(value: string) {
    this._windowVentilation = value;
  }

  get windowMaterial(): string {
    return this._windowMaterial;
  }

  set windowMaterial(value: string) {
    this._windowMaterial = value;
  }

  get windowMaterialColor(): string {
    return this._windowMaterialColor;
  }

  set windowMaterialColor(value: string) {
    this._windowMaterialColor = value;
  }

  get windowMaterialFinish(): string {
    return this._windowMaterialFinish;
  }

  set windowMaterialFinish(value: string) {
    this._windowMaterialFinish = value;
  }

  get windowOuterMaterial(): string {
    return this._windowOuterMaterial;
  }

  set windowOuterMaterial(value: string) {
    this._windowOuterMaterial = value;
  }

  get windowOuterColor(): string {
    return this._windowOuterColor;
  }

  set windowOuterColor(value: string) {
    this._windowOuterColor = value;
  }

  get windowOuterFinish(): string {
    return this._windowOuterFinish;
  }

  set windowOuterFinish(value: string) {
    this._windowOuterFinish = value;
  }

  get windowHandleType(): string {
    return this._windowHandleType;
  }

  set windowHandleType(value: string) {
    this._windowHandleType = value;
  }

  get windowHandleColor(): string {
    return this._windowHandleColor;
  }

  set windowHandleColor(value: string) {
    this._windowHandleColor = value;
  }

  get windowHardware(): boolean {
    return this._windowHardware;
  }

  set windowHardware(value: boolean) {
    this._windowHardware = value;
  }

  get windowMountingAngle(): string {
    return this._windowMountingAngle;
  }

  set windowMountingAngle(value: string) {
    this._windowMountingAngle = value;
  }

  get windowExtras(): any[] {
    return this._windowExtras;
  }

  set windowExtras(value: any[]) {
    this._windowExtras = value;
  }

  get windowCoats(): any[] {
    return this._windowCoats;
  }

  set windowCoats(value: any[]) {
    this._windowCoats = value;
  }

  get windowUrlLink(): string {
    return this._windowUrlLink;
  }

  set windowUrlLink(value: string) {
    this._windowUrlLink = value;
  }

  get windowPrice(): number {
    return this._windowPrice;
  }

  set windowPrice(value: number) {
    this._windowPrice = value;
  }

  get windowUW(): number {
    return this._windowUW;
  }

  set windowUW(value: number) {
    this._windowUW = value;
  }

  get windowUG(): number {
    return this._windowUG;
  }

  set windowUG(value: number) {
    this._windowUG = value;
  }
}

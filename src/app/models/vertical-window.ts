export class VerticalWindow {
  private _kod: string;
  private _productName: string;
  private _verticalSystem: string;
  private _verticalConstructionType: string;
  private _verticalQuantity: number;
  private _verticalWidth: number;
  private _verticalHeight: number;
  private _verticalColorCombination: string;
  private _verticalNumberOfGlasses: number;
  private _verticalSashCombination: string; // nazewnictwo od lewej góry do prawego dołu wraz z okuciami
  private _verticalGlassType: string;
  private _verticalWindowSurface: number;
  private _verticalExtras: [string]; // hamulec okienny, kontaktrony, szare uszczelki, okucia antywyważeniowe RC1/RC2, nawiewnik okienny, roleta zewnętrzna

  // tslint:disable-next-line:max-line-length
  constructor(kod: string, productName: string, verticalSystem: string, verticalConstructionType: string, verticalQuantity: number, verticalWidth: number, verticalHeight: number, verticalColorCombination: string, verticalNumberOfGlasses: number, verticalSashCombination: string, verticalGlassType: string, verticalWindowSurface: number, verticalExtras: [string]) {
    this._kod = kod;
    this._productName = productName;
    this._verticalSystem = verticalSystem;
    this._verticalConstructionType = verticalConstructionType;
    this._verticalQuantity = verticalQuantity;
    this._verticalWidth = verticalWidth;
    this._verticalHeight = verticalHeight;
    this._verticalColorCombination = verticalColorCombination;
    this._verticalNumberOfGlasses = verticalNumberOfGlasses;
    this._verticalSashCombination = verticalSashCombination;
    this._verticalGlassType = verticalGlassType;
    this._verticalWindowSurface = verticalWindowSurface;
    this._verticalExtras = verticalExtras;
  }

  get kod(): string {
    return this._kod;
  }

  set kod(value: string) {
    this._kod = value;
  }

  get productName(): string {
    return this._productName;
  }

  set productName(value: string) {
    this._productName = value;
  }

  get verticalSystem(): string {
    return this._verticalSystem;
  }

  set verticalSystem(value: string) {
    this._verticalSystem = value;
  }

  get verticalConstructionType(): string {
    return this._verticalConstructionType;
  }

  set verticalConstructionType(value: string) {
    this._verticalConstructionType = value;
  }

  get verticalQuantity(): number {
    return this._verticalQuantity;
  }

  set verticalQuantity(value: number) {
    this._verticalQuantity = value;
  }

  get verticalWidth(): number {
    return this._verticalWidth;
  }

  set verticalWidth(value: number) {
    this._verticalWidth = value;
  }

  get verticalHeight(): number {
    return this._verticalHeight;
  }

  set verticalHeight(value: number) {
    this._verticalHeight = value;
  }

  get verticalColorCombination(): string {
    return this._verticalColorCombination;
  }

  set verticalColorCombination(value: string) {
    this._verticalColorCombination = value;
  }

  get verticalNumberOfGlasses(): number {
    return this._verticalNumberOfGlasses;
  }

  set verticalNumberOfGlasses(value: number) {
    this._verticalNumberOfGlasses = value;
  }

  get verticalSashCombination(): string {
    return this._verticalSashCombination;
  }

  set verticalSashCombination(value: string) {
    this._verticalSashCombination = value;
  }

  get verticalGlassType(): string {
    return this._verticalGlassType;
  }

  set verticalGlassType(value: string) {
    this._verticalGlassType = value;
  }

  get verticalWindowSurface(): number {
    return this._verticalWindowSurface;
  }

  set verticalWindowSurface(value: number) {
    this._verticalWindowSurface = value;
  }

  get verticalExtras(): [string] {
    return this._verticalExtras;
  }

  set verticalExtras(value: [string]) {
    this._verticalExtras = value;
  }
}

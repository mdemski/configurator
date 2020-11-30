export class Flashing {
  private _flashingId: number;
  private _flashingName: string;
  private _flashingModel: string;
  private _flashingWidth: number;
  private _flashingHeight: number;
  private _flashingCategory: string;
  private _flashingSubCategory: string;
  private _flashingType: string;
  private _flashingMaterial: string;
  private _flashingMaterialColor: string;
  private _flashingMaterialFinish: string;
  private _flashingApron: string;
  private _flashingTileHeight: number;
  private _flashingCombination: boolean;
  private _flashingNumberOfConnections: number;
  private _flashingCombinationDirection: string;
  private _flashingHorizontalSpacing: number;
  private _flashingVerticalSpacing: number;
  private _flashingCombinationWidths: [number];
  private _flashingCombinationHeights: [number];
  private _flashingPrice: number;


  // tslint:disable-next-line:max-line-length
  constructor(flashingId: number, flashingName: string, flashingModel: string, flashingWidth: number, flashingHeight: number, flashingCategory: string, flashingSubCategory: string, flashingType: string, flashingMaterial: string, flashingMaterialColor: string, flashingMaterialFinish: string, flashingApron: string, flashingTileHeight: number, flashingCombination: boolean, flashingNumberOfConnections: number, flashingCombinationDirection: string, flashingHorizontalSpacing: number, flashingVerticalSpacing: number, flashingCombinationWidths: [number], flashingCombinationHeights: [number], flashingPrice: number) {
    this._flashingId = flashingId;
    this._flashingName = flashingName;
    this._flashingModel = flashingModel;
    this._flashingWidth = flashingWidth;
    this._flashingHeight = flashingHeight;
    this._flashingCategory = flashingCategory;
    this._flashingSubCategory = flashingSubCategory;
    this._flashingType = flashingType;
    this._flashingMaterial = flashingMaterial;
    this._flashingMaterialColor = flashingMaterialColor;
    this._flashingMaterialFinish = flashingMaterialFinish;
    this._flashingApron = flashingApron;
    this._flashingTileHeight = flashingTileHeight;
    this._flashingCombination = flashingCombination;
    this._flashingNumberOfConnections = flashingNumberOfConnections;
    this._flashingCombinationDirection = flashingCombinationDirection;
    this._flashingHorizontalSpacing = flashingHorizontalSpacing;
    this._flashingVerticalSpacing = flashingVerticalSpacing;
    this._flashingCombinationWidths = flashingCombinationWidths;
    this._flashingCombinationHeights = flashingCombinationHeights;
    this._flashingPrice = flashingPrice;
  }


  get flashingId(): number {
    return this._flashingId;
  }

  set flashingId(value: number) {
    this._flashingId = value;
  }

  get flashingName(): string {
    return this._flashingName;
  }

  set flashingName(value: string) {
    this._flashingName = value;
  }

  get flashingModel(): string {
    return this._flashingModel;
  }

  set flashingModel(value: string) {
    this._flashingModel = value;
  }

  get flashingWidth(): number {
    return this._flashingWidth;
  }

  set flashingWidth(value: number) {
    this._flashingWidth = value;
  }

  get flashingHeight(): number {
    return this._flashingHeight;
  }

  set flashingHeight(value: number) {
    this._flashingHeight = value;
  }

  get flashingCategory(): string {
    return this._flashingCategory;
  }

  set flashingCategory(value: string) {
    this._flashingCategory = value;
  }

  get flashingSubCategory(): string {
    return this._flashingSubCategory;
  }

  set flashingSubCategory(value: string) {
    this._flashingSubCategory = value;
  }

  get flashingType(): string {
    return this._flashingType;
  }

  set flashingType(value: string) {
    this._flashingType = value;
  }

  get flashingMaterial(): string {
    return this._flashingMaterial;
  }

  set flashingMaterial(value: string) {
    this._flashingMaterial = value;
  }

  get flashingMaterialColor(): string {
    return this._flashingMaterialColor;
  }

  set flashingMaterialColor(value: string) {
    this._flashingMaterialColor = value;
  }

  get flashingMaterialFinish(): string {
    return this._flashingMaterialFinish;
  }

  set flashingMaterialFinish(value: string) {
    this._flashingMaterialFinish = value;
  }

  get flashingApron(): string {
    return this._flashingApron;
  }

  set flashingApron(value: string) {
    this._flashingApron = value;
  }

  get flashingTileHeight(): number {
    return this._flashingTileHeight;
  }

  set flashingTileHeight(value: number) {
    this._flashingTileHeight = value;
  }

  get flashingCombination(): boolean {
    return this._flashingCombination;
  }

  set flashingCombination(value: boolean) {
    this._flashingCombination = value;
  }

  get flashingNumberOfConnections(): number {
    return this._flashingNumberOfConnections;
  }

  set flashingNumberOfConnections(value: number) {
    this._flashingNumberOfConnections = value;
  }

  get flashingCombinationDirection(): string {
    return this._flashingCombinationDirection;
  }

  set flashingCombinationDirection(value: string) {
    this._flashingCombinationDirection = value;
  }

  get flashingHorizontalSpacing(): number {
    return this._flashingHorizontalSpacing;
  }

  set flashingHorizontalSpacing(value: number) {
    this._flashingHorizontalSpacing = value;
  }

  get flashingVerticalSpacing(): number {
    return this._flashingVerticalSpacing;
  }

  set flashingVerticalSpacing(value: number) {
    this._flashingVerticalSpacing = value;
  }

  get flashingCombinationWidths(): [number] {
    return this._flashingCombinationWidths;
  }

  set flashingCombinationWidths(value: [number]) {
    this._flashingCombinationWidths = value;
  }

  get flashingCombinationHeights(): [number] {
    return this._flashingCombinationHeights;
  }

  set flashingCombinationHeights(value: [number]) {
    this._flashingCombinationHeights = value;
  }

  get flashingPrice(): number {
    return this._flashingPrice;
  }

  set flashingPrice(value: number) {
    this._flashingPrice = value;
  }
}

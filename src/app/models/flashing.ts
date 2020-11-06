export class Flashing {
  flashingName: string;
  flashingModel: string;
  flashingWidth: number;
  flashingHeight: number;
  flashingCategory: string;
  flashingSubCategory: string;
  flashingType: string;
  flashingMaterial: string;
  flashingMaterialColor: string;
  flashingMaterialFinish: string;
  flashingApron: string;
  flashingTileHeight: number;
  flashingCombination: boolean;
  flashingNumberOfConnections: number;
  flashingCombinationDirection: string;
  flashingHorizontalSpacing: number;
  flashingVerticalSpacing: number;
  flashingCombinationWidths: [number];
  flashingCombinationHeights: [number];


  // tslint:disable-next-line:max-line-length
  constructor(flashingName: string, flashingModel: string, flashingWidth: number, flashingHeight: number, flashingCategory: string, flashingSubCategory: string, flashingType: string, flashingMaterial: string, flashingMaterialColor: string, flashingMaterialFinish: string, flashingApron: string, flashingTileHeight: number, flashingCombination: boolean, flashingNumberOfConnections: number, flashingCombinationDirection: string, flashingHorizontalSpacing: number, flashingVerticalSpacing: number, flashingCombinationWidths: [number], flashingCombinationHeights: [number]) {
    this.flashingName = flashingName;
    this.flashingModel = flashingModel;
    this.flashingWidth = flashingWidth;
    this.flashingHeight = flashingHeight;
    this.flashingCategory = flashingCategory;
    this.flashingSubCategory = flashingSubCategory;
    this.flashingType = flashingType;
    this.flashingMaterial = flashingMaterial;
    this.flashingMaterialColor = flashingMaterialColor;
    this.flashingMaterialFinish = flashingMaterialFinish;
    this.flashingApron = flashingApron;
    this.flashingTileHeight = flashingTileHeight;
    this.flashingCombination = flashingCombination;
    this.flashingNumberOfConnections = flashingNumberOfConnections;
    this.flashingCombinationDirection = flashingCombinationDirection;
    this.flashingHorizontalSpacing = flashingHorizontalSpacing;
    this.flashingVerticalSpacing = flashingVerticalSpacing;
    this.flashingCombinationWidths = flashingCombinationWidths;
    this.flashingCombinationHeights = flashingCombinationHeights;
  }
}

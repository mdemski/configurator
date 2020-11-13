export class RoofWindowSkylight {
  windowId: number;
  windowName: string;
  windowModel: string;
  windowGlazing: string;
  windowWidth: number;
  windowHeight: number;
  windowCategory: string;
  windowSubCategory: string;
  windowGeometry: string;
  windowOpeningType: string;
  windowVentilation: string;
  windowMaterial: string;
  windowMaterialColor: string;
  windowMaterialFinish: string;
  windowOuterMaterial: string;
  windowOuterColor: string;
  windowOuterFinish: string;
  windowHandleType: string;
  windowHandleColor: string;
  windowHardware: boolean;
  windowMountingAngle: string;
  windowExtras: [];
  windowUrlLink: string;
  windowPrice: number;

  // tslint:disable-next-line:max-line-length
  constructor(windowId: number, windowName: string, windowModel: string, windowGlazing: string, windowWidth: number, windowHeight: number, windowCategory: string, windowSubCategory: string, windowGeometry: string, windowOpeningType: string, windowVentilation: string, windowMaterial: string, windowMaterialColor: string, windowMaterialFinish: string, windowOuterMaterial: string, windowOuterColor: string, windowOuterFinish: string, windowHandleType: string, windowHandleColor: string, windowHardware: boolean, windowMountingAngle: string, windowExtras: [], windowUrlLink: string, windowPrice: number) {
    this.windowId = windowId;
    this.windowName = windowName;
    this.windowModel = windowModel;
    this.windowGlazing = windowGlazing;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.windowCategory = windowCategory;
    this.windowSubCategory = windowSubCategory;
    this.windowGeometry = windowGeometry;
    this.windowOpeningType = windowOpeningType;
    this.windowVentilation = windowVentilation;
    this.windowMaterial = windowMaterial;
    this.windowMaterialColor = windowMaterialColor;
    this.windowMaterialFinish = windowMaterialFinish;
    this.windowOuterMaterial = windowOuterMaterial;
    this.windowOuterColor = windowOuterColor;
    this.windowOuterFinish = windowOuterFinish;
    this.windowHandleType = windowHandleType;
    this.windowHandleColor = windowHandleColor;
    this.windowHardware = windowHardware;
    this.windowMountingAngle = windowMountingAngle;
    this.windowExtras = windowExtras;
    this.windowUrlLink = windowUrlLink;
    this.windowPrice = windowPrice;
  }
}

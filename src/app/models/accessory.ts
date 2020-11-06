export class Accessory {
  accessoryName: string;
  accessoryModel: string;
  accessoryWidth: number;
  accessoryHeight: number;
  accessoryCategory: string;
  accessorySubCategory: string;
  accessoryType: string; // A-E dopasowanie do sotlarki
  accessoryMaterialType: string;
  accessoryMaterialColor: string;
  accessoryMaterialFinish: string; // kolor dodatków takich jak prowadnice
  accessoryHorizontalSpacing: number; // czy montowane dwa okna jedno pod drugim? Jeśli tak to y=25cm
  accessoryClosureType: string;
  accessoryNameplateNumber: string;

  // tslint:disable-next-line:max-line-length
  constructor(accessoryName: string, accessoryModel: string, accessoryWidth: number, accessoryHeight: number, accessoryCategory: string, accessorySubCategory: string, accessoryType: string, accessoryMaterialType: string, accessoryMaterialColor: string, accessoryMaterialFinish: string, accessoryHorizontalSpacing: number, accessoryClosureType: string, accessoryNameplateNumber: string) {
    this.accessoryName = accessoryName;
    this.accessoryModel = accessoryModel;
    this.accessoryWidth = accessoryWidth;
    this.accessoryHeight = accessoryHeight;
    this.accessoryCategory = accessoryCategory;
    this.accessorySubCategory = accessorySubCategory;
    this.accessoryType = accessoryType;
    this.accessoryMaterialType = accessoryMaterialType;
    this.accessoryMaterialColor = accessoryMaterialColor;
    this.accessoryMaterialFinish = accessoryMaterialFinish;
    this.accessoryHorizontalSpacing = accessoryHorizontalSpacing;
    this.accessoryClosureType = accessoryClosureType;
    this.accessoryNameplateNumber = accessoryNameplateNumber;
  }
}

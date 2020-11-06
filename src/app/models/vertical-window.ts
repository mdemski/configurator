export class VerticalWindow {
  verticalName: string;
  verticalSystem: string;
  verticalConstructionType: string;
  verticalQuantity: number;
  verticalWidth: number;
  verticalHeight: number;
  verticalColorCombination: string;
  verticalNumberOfGlasses: number;
  verticalSashCombination: string; // nazewnictwo od lewej góry do prawego dołu wraz z okuciami
  verticalGlassType: string;
  verticalWindowSurface: number;
  verticalExtras: [string]; // hamulec okienny, kontaktrony, szare uszczelki, okucia antywyważeniowe RC1/RC2, nawiewnik okienny, roleta zewnętrzna

  // tslint:disable-next-line:max-line-length
  constructor(verticalName: string, verticalSystem: string, verticalConstructionType: string, verticalQuantity: number, verticalWidth: number, verticalHeight: number, verticalColorCombination: string, verticalNumberOfGlasses: number, verticalSashCombination: string, verticalGlassType: string, verticalWindowSurface: number, verticalExtras: [string]) {
    this.verticalName = verticalName;
    this.verticalSystem = verticalSystem;
    this.verticalConstructionType = verticalConstructionType;
    this.verticalQuantity = verticalQuantity;
    this.verticalWidth = verticalWidth;
    this.verticalHeight = verticalHeight;
    this.verticalColorCombination = verticalColorCombination;
    this.verticalNumberOfGlasses = verticalNumberOfGlasses;
    this.verticalSashCombination = verticalSashCombination;
    this.verticalGlassType = verticalGlassType;
    this.verticalWindowSurface = verticalWindowSurface;
    this.verticalExtras = verticalExtras;
  }
}

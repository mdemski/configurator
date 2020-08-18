export class RoofWindow {
  category: string;
  model: string;
  glazing: string;
  height: number;
  width: number;
  innerColor: string;
  outerColor: string;
  ventilation: string;

  constructor(category: string, model: string, glazing: string, height: number, width: number, innerColor: string, outerColor: string, ventilation: string) {
    this.category = category;
    this.model = model;
    this.glazing = glazing;
    this.height = height;
    this.width = width;
    this.innerColor = innerColor;
    this.outerColor = outerColor;
    this.ventilation = ventilation;
  }
}

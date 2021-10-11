import {FlatRoofWindow} from '../../models/flat-roof-window';

export class GetFlatRoofWindows {
  static readonly type = '[FlatRoofWindow] Get FlatRoofWindows';
}

export class SetChosenFlatRoofWindow {
  static readonly type = '[FlatRoofWindow] Set Chosen Flat Roof Window';

  constructor(public flatRoof: FlatRoofWindow) {
  }
}

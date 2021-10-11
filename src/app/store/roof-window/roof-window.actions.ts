import {RoofWindowSkylight} from '../../models/roof-window-skylight';

export class GetRoofWindows {
  static readonly type = '[RoofWindow] Get Roof Windows';
}

export class SetChosenRoofWindow {
  static readonly type = '[RoofWindow] Set Chosen Roof Window';

  constructor(public roofWindow: RoofWindowSkylight) {
  }
}

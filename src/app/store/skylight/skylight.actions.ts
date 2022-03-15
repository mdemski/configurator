import {RoofWindowSkylight} from '../../models/roof-window-skylight';

export class GetSkylights {
  static readonly type = '[Skylight] Get Skylights';
}

export class SetChosenSkylight {
  static readonly type = '[Skylight] Set Chosen Skylight';

  constructor(public skylight: RoofWindowSkylight) {
  }
}

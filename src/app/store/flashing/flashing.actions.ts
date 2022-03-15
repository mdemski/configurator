import {Flashing} from '../../models/flashing';

export class GetFlashings {
  static readonly type = '[Flashing] Get Flashings';
}

export class SetChosenFlashing {
  static readonly type = '[Flashing] Set Chosen Flashing';

  constructor(public flashing: Flashing) {
  }
}

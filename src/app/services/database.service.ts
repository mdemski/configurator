import {Injectable} from '@angular/core';
import {RoofWindow} from '../models/roof-window';

@Injectable()
export class DatabaseService {
  // windows
  windows: RoofWindow[];

  getAllRoofWindowsToShopList() {
    return this.windows = [
      new RoofWindow('Okna obrotowe', 'ISO', 'I22', 78, 118, 'naturalny', 'RAL7022', 'NEO-AIR'),
      new RoofWindow('Okna obrotowe', 'ISO', 'I22', 78, 118, 'biały', 'RAL7022', 'NEO-AIR'),
      new RoofWindow('Okna obrotowe', 'IGOV', 'I22', 78, 118, 'biały', 'RAL7022', 'NEO-AIR'),
      new RoofWindow('Okna obrotowe', 'IGOV', 'I22', 78, 118, 'biały', 'RAL7022', 'NEO-AIR'),
      new RoofWindow('Okna obrotowe', 'IGOV', 'I22', 78, 118, 'biały', 'RAL7022', 'NEO-AIR'),
      new RoofWindow('Okna obrotowe', 'IGOV', 'I22', 78, 118, 'biały', 'RAL7022', 'NEO-AIR'),
    ];
  }

  getWindowById(id: number) {
    return this.windows[id];
  }
}

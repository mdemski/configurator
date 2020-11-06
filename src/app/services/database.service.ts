import {Injectable} from '@angular/core';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Observable, of, Subject} from 'rxjs';

@Injectable()
export class DatabaseService {
  // windows
  windows: RoofWindowSkylight[];
  setGroupFilter$ = new Subject<any>();
  getGroupFilter = this.setGroupFilter$.asObservable();

  // TODO do oprogramowania pobieranie danych z eNova/pliku
  getAllRoofWindowsToShopList() {
    return this.windows = [
      new RoofWindowSkylight(1,'ISO I22 78x118', 'ISO', 'I22', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IS', 'obrotowe', 'NEO-AIR', 'drewno', 'bezbarwny', 'przeźroczysty', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL7048', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2018/06/1_ISO.jpg'),
      new RoofWindowSkylight(2,'IGOV I22 78x118', 'IGOV', 'I22', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IG', 'obrotowe', 'NEO-AIR', 'PVC', 'biały', 'gładki', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL9003', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2018/06/IGO-E2-1.jpg'),
      new RoofWindowSkylight(3,'ISO E2 78x118', 'ISO', 'E2', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IS', 'obrotowe', 'NEO-AIR', 'drewno', 'bezbarwny', 'przeźroczysty', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL7048', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2014/10/okno-obrotowe-drewniane.png'),
      new RoofWindowSkylight(4,'IGOV E2 78x118', 'IGOV', 'E2', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IG', 'obrotowe', 'NEO-AIR', 'PVC', 'biały', 'gładki', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL9003', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2018/06/IGO-E2.jpg'),
      new RoofWindowSkylight(5,'ISO I22 78x118', 'ISO', 'I22', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IS', 'obrotowe', 'NEO-AIR', 'drewno', 'bezbarwny', 'przeźroczysty', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL7048', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2018/06/1_ISO.jpg'),
      new RoofWindowSkylight(6,'IGOV I22 78x118', 'IGOV', 'I22', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IG', 'obrotowe', 'NEO-AIR', 'PVC', 'biały', 'gładki', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL9003', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2018/06/IGO-E2-1.jpg'),
      new RoofWindowSkylight(7,'ISO E2 78x118', 'ISO', 'E2', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IS', 'obrotowe', 'NEO-AIR', 'drewno', 'bezbarwny', 'przeźroczysty', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL7048', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2014/10/okno-obrotowe-drewniane.png'),
      new RoofWindowSkylight(8,'IGOV E2 78x118', 'IGOV', 'E2', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IG', 'obrotowe', 'NEO-AIR', 'PVC', 'biały', 'gładki', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL9003', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2018/06/IGO-E2.jpg')
    ];
  }

  getWindowById(id: number) {
    return this.windows[--id];
  }

  fetchRoofWindows(): Observable<any> {
    const windows = this.getAllRoofWindowsToShopList();
    return of(windows);
  }
}

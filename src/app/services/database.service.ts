import {Injectable} from '@angular/core';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Observable, of, Subject} from 'rxjs';
import {Accessory} from '../models/accessory';
import {Company} from '../models/company';

@Injectable()
export class DatabaseService {
  // windows
  windows: RoofWindowSkylight[] = [];
  accessories: Accessory[] = [];
  mostRecentProducts: any = [];
  availableSellers: any = [];
  setGroupFilter$ = new Subject<any>();
  getGroupFilter = this.setGroupFilter$.asObservable();

  // TODO do oprogramowania pobieranie danych z eNova/pliku
  getAllRoofWindowsToShopList() {
    return this.windows = [
      new RoofWindowSkylight(1, 'ISO I22 78x118', 'ISO', 'I22', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IS', 'obrotowe', 'NEO-AIR', 'drewno', 'bezbarwny', 'przeźroczysty', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL7048', false, null, null, 'assets/img/products/ISO-I22.png', 1267),
      new RoofWindowSkylight(2, 'IGOV N22 78x118', 'IGOV', 'N22', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IG', 'obrotowe', 'NEO-AIR', 'PVC', 'biały', 'gładki', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL9003', false, null, null, 'assets/img/products/IGOV-N22.png', 1460),
      new RoofWindowSkylight(3, 'ISO E2 78x118', 'ISO', 'E2', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IS', 'obrotowe', 'NEO-AIR', 'drewno', 'bezbarwny', 'przeźroczysty', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL7048', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2014/10/okno-obrotowe-drewniane.png', 977),
      new RoofWindowSkylight(4, 'IGOV E2 78x118', 'IGOV', 'E2', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IG', 'obrotowe', 'NEO-AIR', 'PVC', 'biały', 'gładki', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL9003', false, null, null, 'assets/img/products/IGOV-E2.png', 1230),
      new RoofWindowSkylight(5, 'ISO I22 78x118', 'ISO', 'I22', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IS', 'obrotowe', 'NEO-AIR', 'drewno', 'bezbarwny', 'przeźroczysty', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL7048', false, null, null, 'assets/img/products/ISO-I22.png', 1267),
      new RoofWindowSkylight(6, 'IGOV N22 78x118', 'IGOV', 'N22', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IG', 'obrotowe', 'NEO-AIR', 'PVC', 'biały', 'gładki', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL9003', false, null, null, 'assets/img/products/IGOV-N22.png', 1460),
      new RoofWindowSkylight(7, 'ISO E2 78x118', 'ISO', 'E2', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IS', 'obrotowe', 'NEO-AIR', 'drewno', 'bezbarwny', 'przeźroczysty', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL7048', false, null, null, 'https://www.okpol.pl/wp-content/uploads/2014/10/okno-obrotowe-drewniane.png', 977),
      new RoofWindowSkylight(8, 'IGOV E2 78x118', 'IGOV', 'E2', 78, 118, 'Okna dachowe', 'Okna obrotowe',
        'IG', 'obrotowe', 'NEO-AIR', 'PVC', 'biały', 'gładki', 'aluminium', 'RAL7022',
        'gładki', 'Extra Secure', 'RAL9003', false, null, null, 'assets/img/products/IGOV-E2.png', 1230)
    ];
  }

  // TODO do oprogramowania pobieranie danych z eNova/pliku
  getAllAccessoriesToShopList() {
    return this.accessories = [
      new Accessory(9, 'Decomatic D33Z 78x118', 'D33', 78, 118, 'Akcesoria', 'Rolety wewnętrzne', 'A', 'zaciemniający', 'S001', 'srebrny', null, 'manulana', null, 217),
      new Accessory(10, 'Decomatic D33T 78x118', 'D33', 78, 118, 'Akcesoria', 'Rolety wewnętrzne', 'A', 'transparentny', 'A368', 'srebrny', null, 'manulana', null, 157),
      new Accessory(11, 'Multistop D37Z 78x118', 'D37', 78, 118, 'Akcesoria', 'Rolety wewnętrzne', 'A', 'zaciemniający', 'S001', 'srebrny', null, 'manulana', null, 375),
      new Accessory(12, 'Multistop D37T 78x118', 'D37', 78, 118, 'Akcesoria', 'Rolety wewnętrzne', 'A', 'transparentny', 'A368', 'srebrny', null, 'manulana', null, 312)
    ];
  }

  getWindowById(id: number) {
    return this.windows[--id];
  }

  getAccessoryById(id: number) {
    return this.accessories[id];
  }

  fetchRoofWindows(): Observable<any> {
    const windows = this.getAllRoofWindowsToShopList();
    return of(windows);
  }

  fetchAccessories(): Observable<any> {
    const accessories = this.getAllAccessoriesToShopList();
    return of(accessories);
  }

  // Musi zwracać listę 3 produktów z których 1 jest oknem, 2 to kołnierz, 3 akcesorium
  getMostRecentProductsHomePage() {
    this.mostRecentProducts.push(this.windows[0]);
    this.mostRecentProducts.push(this.windows[1]);
    this.mostRecentProducts.push(this.accessories[2]);
    return this.mostRecentProducts;
  }

  // Zwraca TYLKO listę wszystkich firm które są w programi.
  getAllSellers() {
    this.availableSellers.push(new Company('Felek', '7771901580', 'Krucza', '74a', '50-102', 'Janek'));
    return this.availableSellers;
  }

  saveEmailToDatabase(newsletterEmail: string) {
    // Wysłanie maila do bazy danych eNova
  }
}

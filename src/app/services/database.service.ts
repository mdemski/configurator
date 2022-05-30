import {Injectable} from '@angular/core';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Observable, of, Subject} from 'rxjs';
import {Accessory} from '../models/accessory';
import {Company} from '../models/company';
import {RoofWindowValuesSetterService} from './roof-window-values-setter.service';
import {Flashing} from '../models/flashing';
import {SingleConfiguration} from '../models/single-configuration';
import {HttpClient} from '@angular/common/http';
import {FlashingValueSetterService} from './flashing-value-setter.service';
import {Address} from '../models/address';
import {Invoice} from '../models/invoice';
import {RandomStringGeneratorService} from './random-string-generator.service';
import {AccessoryValuesSetterService} from './accessory-values-setter.service';

@Injectable()
export class DatabaseService {

  constructor(private windowValuesSetter: RoofWindowValuesSetterService,
              private flashingValueSetter: FlashingValueSetterService,
              private accessoryValueSetter: AccessoryValuesSetterService,
              private randomString: RandomStringGeneratorService,
              private http: HttpClient) {
    // this.accessories = this.getAllAccessoriesToShopList();
  }

  // windows
  windows: RoofWindowSkylight[] = [];
  flashings: Flashing[] = [];
  accessories: Accessory[] = [];
  mostRecentProducts: any = [];
  availableSellers: any = [];
  setGroupFilter$ = new Subject<any>();
  getGroupFilter = this.setGroupFilter$.asObservable();
  temporarySingleConfiguration: SingleConfiguration;

  // flashings
  // tslint:disable-next-line:max-line-length
  temporaryFlashing = new Flashing('1K-1-U-UO------A7022P-055098-OKPK01', 'UN/O 055x098 Kołnierz uniwersalny /A7022P/UO/OKPK01', 'Kołnierz U 55x98 UO', 'I-KOLNIERZ', 'NPL-KOLNIERZ', 'Nowy', 'U', 55, 98, 'KołnierzUszczelniający',
    'KolnierzUszczelniający', 'Kołnierz:U', 'KołnierzUszczelniający:K-1', 'KołnierzUszczelniający', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'U', 0, 'UO', 5, 0, 0,
    270, ['78x118', '78x140'], ['assets/img/products/flashings.jpg'], 'PL', false, null, []);

  // TODO do oprogramowania pobieranie danych z eNova/pliku + filtrowanie danych według grupaAsortymentowa
  getAllRoofWindowsToShopList(): RoofWindowSkylight[] {
    return this.windows = [
      new RoofWindowSkylight('1O-ISO-V-E02-KL00-A7022P-078118-OKPO01', 'ISO E02 78x118', 'ISO', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:ISOV', 'Okno:E02', 'dwuszybowy',
        78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IS1', 'OknoDachowe:ISO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'DrewnoSosna',
        'Drewno:Bezbarwne', 'OknoDachowe:IS', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
        'Okno:RAL7048', null, 4, [], ['zewnetrznaHartowana'], ['assets/img/products/ISO-I22.png'], [], 997, 1.2, 1.0, 2000, 'Okno:RAL7048', 'Okno:RAL7048', null, 0, 'PL'),
      new RoofWindowSkylight('1O-ISO-V-I22-KL00-A7022P-078118-OKPO01', 'ISO I22 78x118', 'ISO', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:ISOV', 'Okno:I22', 'trzyszybowy',
        78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IS1', 'OknoDachowe:ISO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'DrewnoSosna',
        'Drewno:Bezbarwne', 'OknoDachowe:IS', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
        'Okno:RAL7048', null, 4, [], ['zewnetrznaHartowana'], ['assets/img/products/ISO-I22.png'], [], 1450, 1.0, 0.7, 2000, 'Okno:RAL7048', 'Okno:RAL7048', null, 0, 'PL'),
      new RoofWindowSkylight('1O-IGO-V-N22-WSWS-A7022P-078118-OKPO01', 'IGO N22 78x118', 'IGO', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:IGOV', 'Okno:N22', 'trzyszybowy',
        78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IG2', 'OknoDachowe:IGO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'PVC',
        'PVC:9016', 'OknoDachowe:IG', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
        'Okno:RAL9016', null, 4, [], ['zewnetrznaHartowana'], ['assets/img/products/IGOV-N22.png'], [], 1650, 0.78, 0.5, 2000, 'Okno:RAL9016', 'Okno:RAL9016', null, 0, 'PL'),
      new RoofWindowSkylight('1O-IGO-V-E02-WSWS-A7022P-078118-OKPO01', 'IGO E02 78x118', 'IGO', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:IGOV', 'Okno:E02', 'dwuszybowy',
        78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IG2', 'OknoDachowe:IGO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'PVC',
        'PVC:9016', 'OknoDachowe:IG', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
        'Okno:RAL9016', null, 4, [], ['zewnetrznaHartowana'], ['assets/img/products/IGOV-E2.png'], [], 1050, 1.1, 1.0, 2000, 'Okno:RAL9016', 'Okno:RAL9016', null, 0, 'PL')
    ];
  }

  getAllFlashingsToShopList(): Flashing[] {
    return this.flashings = [
      new Flashing('1K-1-U-UO------A7022P-078118-OKPK01', 'UN/O 055x098 Kołnierz uniwersalny /A7022P/UO/OKPK01', 'Kołnierz U 55x98 UO', 'I-KOLNIERZ', 'NPL-KOLNIERZ', 'Nowy', 'U', 55, 98, 'KołnierzUszczelniający',
        'KolnierzUszczelniający', 'Kołnierz:U', 'KołnierzUszczelniający:K-1', 'KołnierzUszczelniający', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'U', 0, 'UO', 5, 0, 0,
        270, ['78x118', '78x140'], ['assets/img/products/U.png'], 'PL', false, null, []),
      new Flashing('1K-1-U-UO------A7022P-055098-OKPK01', 'UN/O 055x098 Kołnierz uniwersalny /A7022P/UO/OKPK01', 'Kołnierz U 55x98 UO', 'I-KOLNIERZ', 'NPL-KOLNIERZ', 'Nowy', 'U', 55, 98, 'KołnierzUszczelniający',
        'KolnierzUszczelniający', 'Kołnierz:U', 'KołnierzUszczelniający:K-1', 'KołnierzUszczelniający', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'U', 0, 'UO', 5, 0, 0,
        270, ['78x118', '78x140'], ['assets/img/products/U.png'], 'PL', false, null, []),
      new Flashing('1K-1-U-UO------A7022P-078140-OKPK01', 'UN/O 055x098 Kołnierz uniwersalny /A7022P/UO/OKPK01', 'Kołnierz U 55x98 UO', 'I-KOLNIERZ', 'NPL-KOLNIERZ', 'Nowy', 'U', 55, 98, 'KołnierzUszczelniający',
        'KolnierzUszczelniający', 'Kołnierz:U', 'KołnierzUszczelniający:K-1', 'KołnierzUszczelniający', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'U', 0, 'UO', 5, 0, 0,
        270, ['78x118', '78x140'], ['assets/img/products/U.png'], 'PL', false, null, [])
    ];
  }

  // TODO do oprogramowania pobieranie danych z eNova/pliku + filtrowanie danych według grupaAsortymentowa
  getAllAccessoriesToShopList(): Accessory[] {
    return this.accessories = [
      new Accessory('1A-D37--T-A372-078118-AA-OKPA01', 'D37T 078x118 A372 [AA] Roleta Multistop, tkanina transparentna, srebrne prowadnice', 'Multistop D37 78x118', 'I-Akcesorium', 'NPL-Akcesorium', 'Nowy', 'Roleta:D37', 78, 118, 'Akcesorium', 'Akcesorium:Wewnętrzne',
        'Roleta:D37', 'AkcesoriumRoletaW:D37', 'Akcesorium:Roleta', 'Rolety:A', 'Rolety:A', 'Transparentna', 'RoletaD_T:A372', 'Roleta:Ral7048', null, null, null, 'Srebrny', 0, 'Roleta:Manualne', '', 358, ['assets/img/products/D37.png'], [], 'PL', ''),
      new Accessory('1A-D37W--T-A372-078118-AA-OKPA01', 'D37WT 078x118 A372 [AA] Roleta Multistop, tkanina transparentna, białe prowadnice', 'Multistop D37W 78x118', 'I-Akcesorium', 'NPL-Akcesorium', 'Nowy', 'Roleta:D37W', 78, 118, 'Akcesorium', 'Akcesorium:Wewnętrzne',
        'Roleta:D37W', 'AkcesoriumRoletaW:D37W', 'Akcesorium:Roleta', 'Rolety:A', 'Rolety:A', 'Transparentna', 'RoletaD_T:A372', 'Roleta:Ral9016', null, null, null, 'Biały', 0, 'Roleta:Manualne', '', 358, ['assets/img/products/D37.png'], [], 'PL', ''),
      new Accessory('1A-D37--Z-S003-078118-AA-OKPA01', 'D37T 078x118 A372 [AA] Roleta Multistop, tkanina zaciemniająca, srebrne prowadnice', 'Multistop D37 78x118', 'I-Akcesorium', 'NPL-Akcesorium', 'Nowy', 'Roleta:D37', 78, 118, 'Akcesorium', 'Akcesorium:Wewnętrzne',
        'Roleta:D37', 'AkcesoriumRoletaW:D37', 'Akcesorium:Roleta', 'Rolety:A', 'Rolety:A', 'Zaciemniająca', 'RoletaD_Z:S003', 'Roleta:Ral7048', null, null, null, 'Srebrny', 0, 'Roleta:Manualne', '', 358, ['assets/img/products/D37.png'], [], 'PL', ''),
      new Accessory('1A-D37W--Z-S003-078118-AA-OKPA01', 'D37WT 078x118 A372 [AA] Roleta Multistop, tkanina zaciemniająca, białe prowadnice', 'Multistop D37W 78x118', 'I-Akcesorium', 'NPL-Akcesorium', 'Nowy', 'Roleta:D37W', 78, 118, 'Akcesorium', 'Akcesorium:Wewnętrzne',
        'Roleta:D37W', 'AkcesoriumRoletaW:D37W', 'Akcesorium:Roleta', 'Rolety:A', 'Rolety:A', 'Zaciemniająca', 'RoletaD_Z:S003', 'Roleta:Ral9016', null, null, null, 'Biały', 0, 'Roleta:Manualne', '', 358, ['assets/img/products/D37.png'], [], 'PL', ''),
      new Accessory('1A-ARZE1-A7022P-078118-OKPA01', 'ARZE1 78x118 Roleta zewnętrzna elektryczna sterowana pilotem, RAL7022 półmat', 'Roleta ARZE1 78 x 118', 'I-ROLETAZ', 'NPL-ROLETAZ', '1. Nowy', 'AkcesoriumRoletaZ:ARZE1', 78, 118, 'Akcesorium', 'Akcesorium:Zewnętrzne', 'ARZE', 'AkcesoriumRoletaZ:ARZE1', 'AkcesoriumRoletaZ:Roleta', null, null, null, null, null, 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', null, null, 'ElektrycznePilot', null, 9999, ['https://www.okpol.pl/wp-content/uploads/2014/11/ARZM_ARZE_.jpg'], [], 'PL', '')
    ];
  }

  fetchRoofWindows(): Observable<any> {
    const windows = this.getAllRoofWindowsToShopList();
    for (const window of windows) {
      window.productName = this.windowValuesSetter.getModelName(window);
      window.windowUG = this.windowValuesSetter.getUwAndUgValues(window).windowUG;
      window.windowUW = this.windowValuesSetter.getUwAndUgValues(window).windowUW;
      window.numberOfGlasses = this.windowValuesSetter.getNumberOfGlasses(window);
      window.uszczelki = window.uszczelki + 2;
    }
    return of(windows);
  }

  fetchAccessories(): Observable<any> {
    const accessories = this.getAllAccessoriesToShopList();
    for (const accessory of accessories) {
      accessory.productName = this.accessoryValueSetter.getAccessoryName(accessory.model, accessory.szerokosc, accessory.wysokosc,
        accessory.typTkaniny, accessory.kolorTkaniny, accessory.roletyKolorOsprzetu);
      accessory.frameMarching = this.accessoryValueSetter.matchingsOption(accessory.dopasowanieRoletySzerokosc, accessory.dopasowanieRoletyDlugosc);
    }
    return of(accessories);
  }

  fetchFlashings() {
    const flashings = this.getAllFlashingsToShopList();
    for (const flashing of flashings) {
      this.flashingValueSetter.setTileHeight(flashing);
      flashing.roofing = this.flashingValueSetter.setRoofing(flashing.geometria, flashing.flashingTileHeight);
    }
    return of(flashings);
  }

  getWindowByCode(kod: string) {
    let tempWindow: RoofWindowSkylight;
    tempWindow = this.getAllRoofWindowsToShopList().filter(window => window.kod === kod)[0];
    tempWindow.productName = this.windowValuesSetter.getModelName(tempWindow);
    tempWindow.windowUG = this.windowValuesSetter.getUwAndUgValues(tempWindow).windowUG;
    tempWindow.windowUW = this.windowValuesSetter.getUwAndUgValues(tempWindow).windowUW;
    tempWindow.numberOfGlasses = this.windowValuesSetter.getNumberOfGlasses(tempWindow);
    tempWindow.uszczelki = tempWindow.uszczelki + 2;
    return of(tempWindow);
  }

  getFlashingByCode(flashingCode: string) {
    let flashing: Flashing;
    flashing = this.getAllFlashingsToShopList().filter(flashingPro => flashingPro.kod === flashingCode)[0];
    this.flashingValueSetter.setModelNameFromErpData(flashing);
    this.flashingValueSetter.setTileHeight(flashing);
    return of(flashing);
  }

  getAccessoryById(id: number) {
    return this.getAllAccessoriesToShopList()[--id];
  }

  fetchSkylights() {
    // TODO uzupełnić w późniejszym czasie
    return of([]);
  }

  getSkylightById(id: number) {
    // TODO uzupełnić w późniejszym czasie
    return null;
  }

  fetchFlatRoofWindows() {
    // TODO uzupełnić w późniejszym czasie
    return of([]);
  }

  getFlatRoofWindowById(id: number) {
    // TODO uzupełnić w późniejszym czasie
    return null;
  }

  // Musi zwracać listę 3 produktów z których 1 jest oknem, 2 to kołnierz, 3 akcesorium
  getMostRecentProductsHomePage() {
    this.mostRecentProducts = [];
    this.mostRecentProducts.push(this.windows[0]);
    this.mostRecentProducts.push(this.windows[1]);
    this.mostRecentProducts.push(this.accessories[2]);
    return this.mostRecentProducts;
  }

  // Zwraca TYLKO listę wszystkich firm które są w programi.
  getAllSellers() {
    this.availableSellers.push(new Company('', 'Felek', 'm.demski@okpol.pl', '11122233344', 0.02, 0.38, 0.38, 0.38, 0.38, 0.38, 0.63,
      50000, new Address('Lolek', 'Bolek', '123456789', 'Felkowa', '3/1', '10-150', 'Lewin', 'Polzka'),
      'DTHXX', 50, 100, 10, 20, 30, 40, 50, 0, [], [
        new Invoice('122/01/2021', new Date('2021-01-21'), new Date('2021-01-20'), 12345678, 'PLN', 23568, 14254652, 'cd', 0, true),
        new Invoice('122/01/2021', new Date('2021-01-21'), new Date('2021-01-20'), 12345678, 'PLN', 23568, 14254652, 'cd', 0, false),
        new Invoice('122/01/2021', new Date('2021-01-21'), new Date('2021-01-20'), 12345678, 'PLN', 23568, 14254652, 'cd', 0, true),
        new Invoice('122/01/2021', new Date('2021-01-21'), new Date('2021-01-20'), 12345678, 'PLN', 23568, 14254652, 'cd', 0, false),
        new Invoice('122/01/2021', new Date('2021-01-21'), new Date('2021-01-20'), 12345678, 'PLN', 23568, 14254652, 'cd', 0, true),
        new Invoice('122/01/2021', new Date('2021-01-21'), new Date('2021-01-20'), 12345678, 'PLN', 23568, 14254652, 'cd', 0, true),
      ], null));
    return this.availableSellers;
  }

  saveEmailToDatabase(newsletterEmail: string) {
    // Wysłanie maila do bazy danych eNova
  }

  order(product: any, quantity: number) {
    // TODO logika związana z wysłaniem całego koszyka jako zamówienie do eNova
  }

  private getSingleConfiguration() {
    return {
      id: 1,
      name: 'Pierwsza testowa',
      windows: [{
        id: 1,
        quantity: 1,
        window: this.getAllRoofWindowsToShopList()[0],
        windowFormName: this.randomString.randomString(12),
        windowFormData: null
      },
        {
          id: 2,
          quantity: 1,
          window: this.getAllRoofWindowsToShopList()[1],
          windowFormName: this.randomString.randomString(12),
          windowFormData: null
        },
        {
          id: 3,
          quantity: 1,
          window: this.getAllRoofWindowsToShopList()[2],
          windowFormName: this.randomString.randomString(12),
          windowFormData: null
        }],
      flashings: [{
        id: 1,
        quantity: 1,
        flashing: this.temporaryFlashing,
        flashingFormName: this.randomString.randomString(12),
        flashingFormData: null
      },
        {
          id: 2,
          quantity: 1,
          flashing: this.temporaryFlashing,
          flashingFormName: this.randomString.randomString(12),
          flashingFormData: null
        }
      ],
      accessories: [{
        id: 1,
        quantity: 1,
        accessory: this.accessories[0],
        accessoryFormName: this.randomString.randomString(12),
        accessoryFormData: null
      },
        {
          id: 2,
          quantity: 2,
          accessory: this.accessories[2],
          accessoryFormName: this.randomString.randomString(12),
          accessoryFormData: null
        }]
    };
  }
}

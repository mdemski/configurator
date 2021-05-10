import {Injectable} from '@angular/core';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Observable, of, Subject} from 'rxjs';
import {Accessory} from '../models/accessory';
import {Company} from '../models/company';
import {PropertyValueTranslatorService} from './property-value-translator.service';
import {WindowDynamicValuesSetterService} from './window-dynamic-values-setter.service';
import {Flashing} from '../models/flashing';
import {SingleConfiguration} from '../models/single-configuration';
import {ConfigurationModel} from '../models/configuration-model';
import {HttpClient} from '@angular/common/http';
import {ErpNameTranslatorService} from './erp-name-translator.service';

@Injectable()
export class DatabaseService {

  constructor(private valueTranslator: PropertyValueTranslatorService,
              private windowValuesSetter: WindowDynamicValuesSetterService,
              private erpName: ErpNameTranslatorService,
              private http: HttpClient) {
    this.accessories = this.getAllAccessoriesToShopList();
    this.temporarySingleConfiguration = this.getSingleConfiguration();
  }

  // windows
  windows: RoofWindowSkylight[] = [];
  accessories: Accessory[] = [];
  mostRecentProducts: any = [];
  availableSellers: any = [];
  setGroupFilter$ = new Subject<any>();
  getGroupFilter = this.setGroupFilter$.asObservable();
  temporarySingleConfiguration: SingleConfiguration;

  // flashings
  temporaryFlashing = new Flashing('1K-1-U-UO------A7022P-055098-OKPK01', 'UN/O 055x098 Kołnierz uniwersalny /A7022P/UO/OKPK01', 'Kołnierz U 55x98 UO', 'I-KOLNIERZ', 'NPL-KOLNIERZ', 'Nowy', 'U', 55, 98, 'KołnierzUszczelniający',
    'KolnierzUszczelniający', 'Kołnierz:U', 'KołnierzUszczelniający:K-1', 'KołnierzUszczelniający', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'U', 0, 'UO', 5, false, 1, null,
    0, 0, [], [], 270, ['78x118', '78x140'], ['assets/img/products/flashings.jpg'], 'PL');

  // TODO do oprogramowania pobieranie danych z eNova/pliku + filtrowanie danych według grupaAsortymentowa
  getAllRoofWindowsToShopList(): RoofWindowSkylight[] {
    return this.windows = [
      new RoofWindowSkylight('1O-ISO-V-E02-KL00-A7022P-078118-OKPO01', 'ISO E02 78x118', 'ISO', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:ISOV', 'Okno:E02', 'dwuszybowy',
        78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IS1', 'OknoDachowe:ISO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'DrewnoSosna',
        'Drewno:Bezbarwne', 'OknoDachowe:IS', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
        'Okno:RAL7048', null, 4, [], [], ['assets/img/products/ISO-I22.png'], [], 997, 1.2, 1.0, 2000, 'Okno:RAL7048', 'Okno:RAL7048', null, 0, 'PL'),
      new RoofWindowSkylight('1O-ISO-V-I22-KL00-A7022P-078118-OKPO01', 'ISO I22 78x118', 'ISO', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:ISOV', 'Okno:I22', 'trzyszybowy',
        78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IS1', 'OknoDachowe:ISO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'DrewnoSosna',
        'Drewno:Bezbarwne', 'OknoDachowe:IS', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
        'Okno:RAL7048', null, 4, [], [], ['assets/img/products/ISO-I22.png'], [], 1450, 1.0, 0.7, 2000, 'Okno:RAL7048', 'Okno:RAL7048', null, 0, 'PL'),
      new RoofWindowSkylight('1O-IGO-V-N22-WSWS-A7022P-078118-OKPO01', 'IGO N22 78x118', 'IGO', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:IGOV', 'Okno:N22', 'trzyszybowy',
        78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IG2', 'OknoDachowe:IGO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'PVC',
        'PVC:9016', 'OknoDachowe:IG', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
        'Okno:RAL9016', null, 4, [], [], ['assets/img/products/IGOV-N22.png'], [], 1650, 0.78, 0.5, 2000, 'Okno:RAL9016', 'Okno:RAL9016', null, 0, 'PL'),
      new RoofWindowSkylight('1O-IGO-V-E02-WSWS-A7022P-078118-OKPO01', 'IGO E02 78x118', 'IGO', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:IGOV', 'Okno:E02', 'dwuszybowy',
        78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IG2', 'OknoDachowe:IGO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'PVC',
        'PVC:9016', 'OknoDachowe:IG', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
        'Okno:RAL9016', null, 4, [], [], ['assets/img/products/IGOV-E2.png'], [], 1050, 1.1, 1.0, 2000, 'Okno:RAL9016', 'Okno:RAL9016', null, 0, 'PL')
    ];
  }

  // TODO do oprogramowania pobieranie danych z eNova/pliku + filtrowanie danych według grupaAsortymentowa
  getAllAccessoriesToShopList() {
    return this.accessories = [
      new Accessory('1A-D37--T-A372-078118-AA', 'D37T 078x118 A372 [AA] Roleta Multistop, tkanina transparentna, srebrne prowadnice', 'Multistop D37 78x118', 'I-Akcesorium', 'NPL-Akcesorium', 'Nowy', 'Roleta:D37', 78, 118, 'Akcesorium', 'Akcesorium:Wewnętrzne',
        'Roleta:D37', 'AkcesoriumRoletaW:D37', 'Akcesorium:Roleta', 'A', 'A', 'Transparentna', 'RoletaD_T:A372', 'Roleta:Ral7048', 'D37:Srebrny', 0, 'Roleta:Manualne', '', 358, ['assets/img/products/D37.png'], [], 'PL'),
      new Accessory('1A-D37W--T-A372-078118-AA', 'D37WT 078x118 A372 [AA] Roleta Multistop, tkanina transparentna, białe prowadnice', 'Multistop D37W 78x118', 'I-Akcesorium', 'NPL-Akcesorium', 'Nowy', 'Roleta:D37W', 78, 118, 'Akcesorium', 'Akcesorium:Wewnętrzne',
        'Roleta:D37W', 'AkcesoriumRoletaW:D37W', 'Akcesorium:Roleta', 'A', 'A', 'Transparentna', 'RoletaD_T:A372', 'Roleta:Ral9016', 'D37:Biały', 0, 'Roleta:Manualne', '', 358, ['assets/img/products/D37.png'], [], 'PL'),
      new Accessory('1A-D37--Z-S003-078118-AA', 'D37T 078x118 A372 [AA] Roleta Multistop, tkanina zaciemniająca, srebrne prowadnice', 'Multistop D37 78x118', 'I-Akcesorium', 'NPL-Akcesorium', 'Nowy', 'Roleta:D37', 78, 118, 'Akcesorium', 'Akcesorium:Wewnętrzne',
        'Roleta:D37', 'AkcesoriumRoletaW:D37', 'Akcesorium:Roleta', 'A', 'A', 'Zaciemniająca', 'RoletaD_Z:S003', 'Roleta:Ral7048', 'D37:Srebrny', 0, 'Roleta:Manualne', '', 358, ['assets/img/products/D37.png'], [], 'PL'),
      new Accessory('1A-D37W--Z-S003-078118-AA', 'D37WT 078x118 A372 [AA] Roleta Multistop, tkanina zaciemniająca, białe prowadnice', 'Multistop D37W 78x118', 'I-Akcesorium', 'NPL-Akcesorium', 'Nowy', 'Roleta:D37W', 78, 118, 'Akcesorium', 'Akcesorium:Wewnętrzne',
        'Roleta:D37W', 'AkcesoriumRoletaW:D37W', 'Akcesorium:Roleta', 'A', 'A', 'Zaciemniająca', 'RoletaD_Z:S003', 'Roleta:Ral9016', 'D37:Biały', 0, 'Roleta:Manualne', '', 358, ['assets/img/products/D37.png'], [], 'PL')
    ];
  }

  fetchRoofWindows(): Observable<any> {
    const windows = this.getAllRoofWindowsToShopList();
    for (const window of windows) {
      this.windowValuesSetter.setModelName(window);
      this.windowValuesSetter.setUwAndUgValues(window);
      this.windowValuesSetter.setNumberOfGlasses(window);
      window.uszczelki = window.uszczelki + 2;
      this.erpName.translateNamesFromERPToApp(window);
    }
    return of(windows);
  }

  fetchAccessories(): Observable<any> {
    const accessories = this.getAllAccessoriesToShopList();
    return of(accessories);
  }

  getWindowByCode(kod: string) {
    let tempWindow: RoofWindowSkylight;
    tempWindow = this.getAllRoofWindowsToShopList().filter(window => window.kod === kod)[0];
    this.windowValuesSetter.setModelName(tempWindow);
    this.windowValuesSetter.setUwAndUgValues(tempWindow);
    this.windowValuesSetter.setNumberOfGlasses(tempWindow);
    tempWindow.uszczelki = tempWindow.uszczelki + 2;
    // this.erpName.translateNamesFromERPToApp(tempWindow);
    return of(tempWindow);
  }

  getAccessoryById(id: number) {
    return this.getAllAccessoriesToShopList()[--id];
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

  addToCart(product: any, quantity: number) {
    // TODO logika związana z dodaniem przedmiotu do koszyka czy osobny service dla koszyka
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
        window: this.getAllRoofWindowsToShopList()[0]
      },
        {
          id: 2,
          quantity: 1,
          window: this.getAllRoofWindowsToShopList()[1]
        },
        {
          id: 3,
          quantity: 1,
          window: this.getAllRoofWindowsToShopList()[2]
        }],
      flashings: [{
        id: 1,
        quantity: 1,
        flashing: this.temporaryFlashing
      },
        {
          id: 2,
          quantity: 1,
          flashing: this.temporaryFlashing
        }
      ],
      accessories: [{
        id: 1,
        quantity: 1,
        accessory: this.accessories[0]
      },
        {
          id: 2,
          quantity: 2,
          accessory: this.accessories[2]
        }]
    };
  }

  // TODO usunąć tymczasową konfigurację do testów aplikacji - przetestować zapisywanie po zalogowaniu
  populateDataToFirebase() {
    const temporaryConfigurationsForWork: ConfigurationModel[] = [{
      user: '178.73.35.155',
      userConfigurations: [{
        id: 1,
        name: 'Pierwsza testowa',
        windows: [{
          id: 1,
          quantity: 1,
          window: this.getAllRoofWindowsToShopList()[0]
        },
          {
            id: 2,
            quantity: 1,
            window: this.getAllRoofWindowsToShopList()[1]
          },
          {
            id: 3,
            quantity: 1,
            window: this.getAllRoofWindowsToShopList()[2]
          }],
        flashings: [{
          id: 1,
          quantity: 1,
          flashing: this.temporaryFlashing
        },
          {
            id: 2,
            quantity: 1,
            flashing: this.temporaryFlashing
          }
        ],
        accessories: [{
          id: 1,
          quantity: 1,
          accessory: this.accessories[0]
        },
          {
            id: 2,
            quantity: 2,
            accessory: this.accessories[2]
          }]
      },
        {
          id: 3,
          name: 'Trzecia bo druga usunięta',
          windows: [{
            id: 1,
            quantity: 1,
            window: this.getAllRoofWindowsToShopList()[1]
          }],
          flashings: null,
          accessories: null
        }]
    },
      {
        user: '192.168.0.2',
        userConfigurations: [{
          id: 1,
          name: 'Pierwsza testowa',
          windows: [{
            id: 1,
            quantity: 1,
            window: this.getAllRoofWindowsToShopList()[0]
          },
            {
              id: 2,
              quantity: 1,
              window: this.getAllRoofWindowsToShopList()[0]
            }],
          flashings: [{
            id: 1,
            quantity: 1,
            flashing: this.temporaryFlashing
          },
            {
              id: 2,
              quantity: 1,
              flashing: this.temporaryFlashing
            }
          ],
          accessories: [
            {
              id: 1,
              quantity: 2,
              accessory: this.accessories[2]
            }]
        }]
      }];
    return this.http.put('https://window-configurator.firebaseio.com/allConfigurations.json', temporaryConfigurationsForWork).subscribe();
  }
}

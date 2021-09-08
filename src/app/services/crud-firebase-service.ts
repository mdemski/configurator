import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DatabaseService} from './database.service';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {VerticalWindow} from '../models/vertical-window';
import {FlatRoofWindow} from '../models/flat-roof-window';
import {SingleConfiguration} from '../models/single-configuration';
import {HighestIdGetterService} from './highest-id-getter.service';
import {catchError, map} from 'rxjs/operators';
import {WindowConfig} from '../models/window-config';
import {FlashingConfig} from '../models/flashing-config';
import {AccessoryConfig} from '../models/accessory-config';
import {VerticalConfig} from '../models/vertical-config';
import {FlatConfig} from '../models/flat-config';

@Injectable({
  providedIn: 'root'
})
export class CrudFirebaseService {

  constructor(private http: HttpClient, private db: DatabaseService, private hd: HighestIdGetterService) {
  }

  // TODO poprawić na notację obiektową ponieważ jest to wydajniejsze - pytanie jak dodawać kolejne konfiguracje?
  // Even more..if your key is also dynamic you can define using the Object class with:
  // Object.defineProperty(data, key, withValue(value));
  // where data is your object, key is the variable to store the key name and value is the variable to store the value.

  baseUri = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  temporaryConfigurations: Observable<any[]>;

  readAllConfigurationsFromMongoDB(): Observable<SingleConfiguration[]> {
    return this.http.get(this.baseUri).pipe(map((data: SingleConfiguration[]) => {
      return data;
    }));
  }

  readAllUserConfigurations(user: string): Observable<SingleConfiguration[]> {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .filter(configuration => configuration.user === user)));
  }

  readConfigurationById(configId: string): Observable<SingleConfiguration> {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === configId)));
  }

  readConfigurationByName(configName: string): Observable<SingleConfiguration> {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.name === configName)));
  }

  readWindowConfigurationsFromConfigurationById(configId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === configId).products.windows));
  }

  readFlashingConfigurationsFromConfigurationById(configId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === configId).products.flashings));
  }

  readAccessoryConfigurationsFromConfigurationById(configId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === configId).products.accessories));
  }

  readVerticalConfigurationsFromConfigurationById(configId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === configId).products.verticals));
  }

  readFlatConfigurationsFromConfigurationById(configId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === configId).products.flats));
  }

  readWindowByIdFromConfigurationById(configId: string, windowId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === configId).products),
      map(products => products.windows.find(window => window.id === Number(windowId))));
  }

  readFlashingByIdFromConfigurationById(configId: string, flashingId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === configId).products),
      map(products => products.flashings.find(flashing => flashing.id === Number(flashingId))));
  }

  readAccessoryByIdFromConfigurationById(configId: string, accessoryId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === configId).products),
      map(products => products.accessories.find(accessory => accessory.id === Number(accessoryId))));
  }

  readVerticalByIdFromConfigurationById(configId: string, verticalId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === configId).products),
      map(products => products.verticals.find(vertical => vertical.id === Number(verticalId))));
  }

  readFlatByIdFromConfigurationById(configId: string, flatId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === configId).products),
      map(products => products.flats.find(flat => flat.id === Number(flatId))));
  }

  readConfigurationByFormName(formName: string) {
    return this.http.get(`${this.baseUri}`).pipe(map((allConfigurations: SingleConfiguration[]) => {
      for (const config of allConfigurations) {
        if (config.products.windows) {
          for (const windowConfig of config.products.windows) {
            if (windowConfig.windowFormName === formName) {
              return windowConfig;
            }
          }
        }
        if (config.products.flashings) {
          for (const flashingConfig of config.products.flashings) {
            if (flashingConfig.flashingFormName === formName) {
              return flashingConfig;
            }
          }
        }
        if (config.products.accessories) {
          for (const accessoryConfig of config.products.accessories) {
            if (accessoryConfig.accessoryFormName === formName) {
              return accessoryConfig;
            }
          }
        }
        if (config.products.verticals) {
          for (const verticalConfig of config.products.verticals) {
            if (verticalConfig.verticalFormName === formName) {
              return verticalConfig;
            }
          }
        }
        if (config.products.flats) {
          for (const flatConfig of config.products.flats) {
            if (flatConfig.flatFormName === formName) {
              return flatConfig;
            }
          }
        }
      }
    }));
  }

  createConfigurationForUser(user: string, configuration: SingleConfiguration) {
    const url = `${this.baseUri}/create`;
    const configurationToCreate: SingleConfiguration = {
      globalId: configuration.globalId,
      created: configuration.created,
      lastUpdate: configuration.lastUpdate,
      user,
      userId: configuration.userId,
      name: configuration.name,
      active: configuration.active,
      products: {
        windows: configuration.products.windows,
        flashings: configuration.products.flashings,
        accessories: configuration.products.accessories,
        verticals: configuration.products.verticals,
        flats: configuration.products.flats
      }
    };
    return this.http.post(url, configurationToCreate)
      .pipe(catchError(err => err));
  }

  // 6 dodawanie okna do konfiguracji
  createWindowConfigurationIntoConfigurationById(configId: string,
                                                 windowConfiguration: RoofWindowSkylight,
                                                 formName: string, formData: any) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      const windowConfig: WindowConfig = {
        id: this.hd.getHighestIdForProduct(configuration).windowId,
        quantity: 1,
        window: Object.assign({}, windowConfiguration),
        windowFormName: formName,
        windowFormData: formData
      };
      configuration.lastUpdate = new Date();
      configuration.products.windows.push(windowConfig);
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Window added successfully'), err => console.log(err));
    }));
  }

  // 7 dodawanie kołnierza do konfiguracji
  createFlashingConfigurationIntoConfigurationById(configId: string,
                                                   flashingConfiguration: Flashing,
                                                   formName: string, formData: any) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      const flashingConfig: FlashingConfig = {
        id: this.hd.getHighestIdForProduct(configuration).flashingId,
        quantity: 1,
        flashing: Object.assign({}, flashingConfiguration),
        flashingFormName: formName,
        flashingFormData: formData
      };
      configuration.lastUpdate = new Date();
      configuration.products.flashings.push(flashingConfig);
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flashing added successfully'), err => console.log(err));
    }));
  }

  // 8 dodawanie akcesorium do konfiguracji
  createAccessoryConfigurationIntoConfigurationById(configId: string,
                                                    accessoryConfiguration: Accessory,
                                                    formName: string, formData: any) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      const accessoryConfig: AccessoryConfig = {
        id: this.hd.getHighestIdForProduct(configuration).accessoryId,
        quantity: 1,
        accessory: Object.assign({}, accessoryConfiguration),
        accessoryFormName: formName,
        accessoryFormData: formData
      };
      configuration.lastUpdate = new Date();
      configuration.products.accessories.push(accessoryConfig);
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Accessory added successfully'), err => console.log(err));
    }));
  }

  createVerticalConfigurationIntoConfigurationById(configId: string,
                                                   verticalConfiguration: VerticalWindow,
                                                   formName: string, formData: any) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      const verticalConfig: VerticalConfig = {
        id: this.hd.getHighestIdForProduct(configuration).verticalId,
        quantity: 1,
        vertical: Object.assign({}, verticalConfiguration),
        verticalFormName: formName,
        verticalFormData: formData
      };
      configuration.lastUpdate = new Date();
      configuration.products.verticals.push(verticalConfig);
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Vertical added successfully'), err => console.log(err));
    }));
  }

  createFlatConfigurationIntoConfigurationById(configId: string,
                                               flatConfiguration: FlatRoofWindow,
                                               formName: string, formData: any) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      const flatConfig: FlatConfig = {
        id: this.hd.getHighestIdForProduct(configuration).flatId,
        quantity: 1,
        flat: Object.assign({}, flatConfiguration),
        flatFormName: formName,
        flatFormData: formData
      };
      configuration.lastUpdate = new Date();
      configuration.products.flats.push(flatConfig);
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flat added successfully'), err => console.log(err));
    }));
  }

  updateNameConfigurationById(configId: string, configName: string) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      this.http.put(url, {name: configName, lastUpdate: new Date()}, {headers: this.headers})
        .subscribe(() => console.log('Name changed successfully'), err => console.log(err));
    }));
  }

  updateWindowQuantity(configId: string, windowId: number, quantity: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.windows) {
        for (const window of configuration.products.windows) {
          if (window.id === Number(windowId)) {
            window.quantity = Number(quantity);
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Window quantity changed successfully'), err => console.log(err));
    }));
  }

  updateFlashingQuantity(configId: string, flashingId: number, quantity: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.flashings) {
        for (const flashing of configuration.products.flashings) {
          if (flashing.id === Number(flashingId)) {
            flashing.quantity = Number(quantity);
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flashing quantity changed successfully'), err => console.log(err));
    }));
  }

  updateAccessoryQuantity(configId: string, accessoryId: number, quantity: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.accessories) {
        for (const accessory of configuration.products.accessories) {
          if (accessory.id === Number(accessoryId)) {
            accessory.quantity = Number(quantity);
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Accessory quantity changed successfully'), err => console.log(err));
    }));
  }

  updateVerticalQuantity(configId: string, verticalId: number, quantity: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.verticals) {
        for (const vertical of configuration.products.verticals) {
          if (vertical.id === Number(verticalId)) {
            vertical.quantity = Number(quantity);
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Vertical quantity changed successfully'), err => console.log(err));
    }));
  }

  updateFlatQuantity(configId: string, flatId: number, quantity: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.flats) {
        for (const flat of configuration.products.flats) {
          if (flat.id === Number(flatId)) {
            flat.quantity = Number(quantity);
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flat quantity changed successfully'), err => console.log(err));
    }));
  }

  // 10 aktualizowanie okna w konfiguracji
  updateWindowConfigurationIntoConfigurationById(configId: string, windowId: number, windowConfiguration: RoofWindowSkylight) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.windows) {
        configuration.lastUpdate = new Date();
        for (const window of configuration.products.windows) {
          if (window.id === Number(windowId)) {
            window.window = windowConfiguration;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Window changed successfully'), err => console.log(err));
    }));
  }

  // 11 aktualizowanie kołnierza w konfiguracji
  updateFlashingConfigurationIntoConfigurationById(configId: string, flashingId: number, flashingConfiguration: Flashing) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.flashings) {
        configuration.lastUpdate = new Date();
        for (const flashing of configuration.products.flashings) {
          if (flashing.id === Number(flashingId)) {
            flashing.flashing = flashingConfiguration;
          }
        }
        this.http.put(url, configuration, {headers: this.headers})
          .subscribe(() => console.log('Flashing changed successfully'), err => console.log(err));
      }
    }));
  }

  // 12 aktualizowanie akcesorium w konfiguracji
  updateAccessoryConfigurationIntoConfigurationById(configId: string, accessoryId: number, accessoryConfiguration: Accessory) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.accessories) {
        configuration.lastUpdate = new Date();
        for (const accessory of configuration.products.accessories) {
          if (accessory.id === Number(accessoryId)) {
            accessory.accessory = accessoryConfiguration;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Accessory changed successfully'), err => console.log(err));
    }));
  }

  updateVerticalConfigurationIntoConfigurationById(configId: string, verticalId: number, verticalConfiguration: VerticalWindow) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.verticals) {
        for (const vertical of configuration.products.verticals) {
          if (vertical.id === Number(verticalId)) {
            vertical.vertical = verticalConfiguration;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Vertical changed successfully'), err => console.log(err));
    }));
  }

  updateFlatConfigurationIntoConfigurationById(configId: string, flatId: number, flatConfiguration: FlatRoofWindow) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.flats) {
        for (const flat of configuration.products.flats) {
          if (flat.id === Number(flatId)) {
            flat.flat = flatConfiguration;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flat changed successfully'), err => console.log(err));
    }));
  }

  updateWindowFormDataByFormName(configId: string, windowFormName: string, windowFormData: {}) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.windows) {
        for (const window of configuration.products.windows) {
          if (window.windowFormName === windowFormName) {
            window.windowFormData = windowFormData;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Window form data changed successfully'), err => console.log(err));
    }));
  }

  updateFlashingFormDataByFormName(configId: string, flashingFormName: string, flashingFormData: {}) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.flashings) {
        for (const flashing of configuration.products.flashings) {
          if (flashing.flashingFormName === flashingFormName) {
            flashing.flashingFormData = flashingFormData;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flashing form data changed successfully'), err => console.log(err));
    }));
  }

  updateAccessoryFormDataByFormName(configId: string, accessoryFormName: string, accessoryFormData: {}) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.accessories) {
        for (const accessory of configuration.products.accessories) {
          if (accessory.accessoryFormName === accessoryFormName) {
            accessory.accessoryFormData = accessoryFormData;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Accessory form data changed successfully'), err => console.log(err));
    }));
  }

  updateVerticalFormDataByFormName(configId: string, verticalFormName: string, verticalFormData: {}) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.verticals) {
        for (const vertical of configuration.products.verticals) {
          if (vertical.verticalFormName === verticalFormName) {
            vertical.verticalFormData = verticalFormData;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Vertical form data changed successfully'), err => console.log(err));
    }));
  }

  updateFlatFormDataByFormName(configId: string, flatFormName: string, flatFormData: {}) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.flats) {
        for (const flat of configuration.products.flats) {
          if (flat.flatFormName === flatFormName) {
            flat.flatFormData = flatFormData;
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flat form data changed successfully'), err => console.log(err));
    }));
  }

  // 1 usuwanie całej konfiguracji
  deleteConfigurationById(configId: string) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      this.http.put(url, {active: false, lastUpdate: new Date()}, {headers: this.headers})
        .subscribe(() => console.log('Delete ' + configId + ' successfully'), err => console.log(err));
    }));
  }

  // 2 usuwanie okna z konfiguracji
  deleteWindowConfigurationFromConfigurationById(configId: string, windowId: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.windows) {
        for (const window of configuration.products.windows) {
          if (window.id === Number(windowId)) {
            const index = configuration.products.windows.indexOf(window);
            if (index > -1) {
              configuration.products.windows.splice(index);
            }
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Window delete successfully'), err => console.log(err));
    }));
  }

  // 3 usuwanie kołnierza z konfiguracji
  deleteFlashingConfigurationFromConfigurationById(configId: string, flashingId: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.flashings) {
        for (const flashing of configuration.products.flashings) {
          if (flashing.id === Number(flashingId)) {
            const index = configuration.products.flashings.indexOf(flashing);
            if (index > -1) {
              configuration.products.flashings.splice(index);
            }
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flashing delete successfully'), err => console.log(err));
    }));
  }

  // 4 usuwanie acesorium z konfiguracji
  deleteAccessoryConfigurationFromConfigurationById(configId: string, accessoryId: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.accessories) {
        for (const accessory of configuration.products.accessories) {
          if (accessory.id === Number(accessoryId)) {
            const index = configuration.products.accessories.indexOf(accessory);
            if (index > -1) {
              configuration.products.accessories.splice(index);
            }
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Accessory delete successfully'), err => console.log(err));
    }));
  }

  deleteVerticalConfigurationFromConfigurationById(configId: string, verticalId: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.verticals) {
        for (const vertical of configuration.products.verticals) {
          if (vertical.id === Number(verticalId)) {
            const index = configuration.products.verticals.indexOf(vertical);
            if (index > -1) {
              configuration.products.verticals.splice(index);
            }
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Vertical delete successfully'), err => console.log(err));
    }));
  }

  deleteFlatConfigurationFromConfigurationById(configId: string, flatId: number) {
    return this.readConfigurationById(configId).pipe(map((configuration: SingleConfiguration) => {
      // @ts-ignore
      const url = `${this.baseUri}/update/${configuration._id}`;
      if (configuration.products.flats) {
        for (const flat of configuration.products.flats) {
          if (flat.id === Number(flatId)) {
            const index = configuration.products.flats.indexOf(flat);
            if (index > -1) {
              configuration.products.flats.splice(index);
            }
          }
        }
      }
      this.http.put(url, configuration, {headers: this.headers})
        .subscribe(() => console.log('Flat delete successfully'), err => console.log(err));
    }));
  }
}

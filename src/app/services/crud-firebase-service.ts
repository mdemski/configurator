import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DatabaseService} from './database.service';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {VerticalWindow} from '../models/vertical-window';
import {FlatRoofWindow} from '../models/flat-roof-window';
import {SingleConfiguration} from '../models/single-configuration';
import {HighestIdGetterService} from './highest-id-getter.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {WindowConfig} from '../models/window-config';
import {FlashingConfig} from '../models/flashing-config';
import {AccessoryConfig} from '../models/accessory-config';
import {VerticalConfig} from '../models/vertical-config';
import {FlatConfig} from '../models/flat-config';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CrudFirebaseService {

  constructor(private http: HttpClient, private db: DatabaseService, private hd: HighestIdGetterService,
              private firestore: AngularFirestore) {
  }

  // TODO poprawić na notację obiektową ponieważ jest to wydajniejsze - pytanie jak dodawać kolejne konfiguracje?
  // Even more..if your key is also dynamic you can define using the Object class with:
  // Object.defineProperty(data, key, withValue(value));
  // where data is your object, key is the variable to store the key name and value is the variable to store the value.

  temporaryConfigurations: Observable<any[]>;
  configurationData = new BehaviorSubject({});
  configurationDataChange$ = this.configurationData.asObservable();

  readAllConfigurationsFromFirebase(): Observable<any[]> {
    return this.firestore.collection('allConfigurations').valueChanges();
  }

  readAllUserConfigurations(user: string): Observable<any[]> {
    return this.firestore.collection('allConfigurations', ref => ref.where('user', '==', user)).valueChanges();
  }

  readConfigurationById(configId: string): Observable<any> {
    return this.firestore.collection('allConfigurations', ref => ref.where('globalId', '==', configId)).valueChanges();
  }

  readWindowConfigurationsFromConfigurationById(configId: string) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          return configuration.products.windows;
        }));
  }

  readFlashingConfigurationsFromConfigurationById(configId: string) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          return configuration.products.flashings;
        }));
  }

  readAccessoryConfigurationsFromConfigurationById(configId: string) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          return configuration.products.accessories;
        }));
  }

  readVerticalConfigurationsFromConfigurationById(configId: string) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          return configuration.products.verticals;
        }));
  }

  readFlatConfigurationsFromConfigurationById(configId: string) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          return configuration.products.flats;
        }));
  }

  readWindowByIdFromConfigurationById(configId: string, windowId: number) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          for (const window of configuration.products.windows) {
            if (window.id === windowId) {
              return window;
            }
          }
        }));
  }

  readFlashingByIdFromConfigurationById(configId: string, flashingId: number) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          for (const flashing of configuration.products.flashings) {
            if (flashing.id === flashingId) {
              return flashing;
            }
          }
        }));
  }

  readAccessoryByIdFromConfigurationById(configId: string, accessoryId: number) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          for (const accessory of configuration.products.accessories) {
            if (accessory.id === accessoryId) {
              return accessory;
            }
          }
        }));
  }

  readVerticalByIdFromConfigurationById(configId: string, verticalId: number) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          for (const vertical of configuration.products.verticals) {
            if (vertical.id === verticalId) {
              return vertical;
            }
          }
        }));
  }

  readFlatByIdFromConfigurationById(configId: string, flatId: number) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          for (const flat of configuration.products.flats) {
            if (flat.id === flatId) {
              return flat;
            }
          }
        }));
  }

  readWindowConfigurationByFormName(formName: string) {
    return this.firestore.collection('allConfigurations').valueChanges().pipe(map((allConfigurations: SingleConfiguration[]) => {
      for (const config of allConfigurations) {
        for (const windowConfig of config.products.windows) {
          if (windowConfig.windowFormName === formName) {
            return windowConfig;
          }
        }
        for (const flashingConfig of config.products.flashings) {
          if (flashingConfig.flashingFormName === formName) {
            return flashingConfig;
          }
        }
        for (const accessoryConfig of config.products.accessories) {
          if (accessoryConfig.accessoryFormName === formName) {
            return accessoryConfig;
          }
        }
        for (const verticalConfig of config.products.verticals) {
          if (verticalConfig.verticalFormName === formName) {
            return verticalConfig;
          }
        }
        for (const flatConfig of config.products.flats) {
          if (flatConfig.flatFormName === formName) {
            return flatConfig;
          }
        }
      }
    }));
  }

  private getConfigurationObject(configId: string) {
    return this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(map(configurationObject => {
        return configurationObject;
      }));
  }

  createConfigurationForUser(user: string, configuration: SingleConfiguration) {
    const globalId = String('configuration-' + this.hd.getHighestIdFormFireStore());
    configuration.globalId = globalId;
    configuration.userId = this.hd.getHighestIdForUser();
    this.firestore.collection('allConfigurations').doc(globalId).set(configuration)
      .then(() => {
        console.log('Document written with ID:', globalId);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }

  // 6 dodawanie okna do konfiguracji
  createWindowConfigurationIntoConfigurationById(configId: string,
                                                 windowConfiguration: RoofWindowSkylight,
                                                 formName: string, formData: any) {
    const windowConfig: WindowConfig = {
      id: firebase.firestore.length + 1,
      quantity: 2,
      window: Object.assign({}, windowConfiguration),
      windowFormName: formName,
      windowFormData: formData
    };
    return this.firestore.doc('allConfigurations/' + configId).valueChanges().subscribe((config: SingleConfiguration) => {
      console.log(config.products.windows.push(windowConfig));
    });
  }

  // 7 dodawanie kołnierza do konfiguracji
  createFlashingConfigurationIntoConfigurationById(configId: string,
                                                   flashingConfiguration: Flashing,
                                                   formName: string, formData: any) {
    this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          const flashingConfig: FlashingConfig = {
            id: this.hd.getHighestIdForProduct(configuration).flashingId,
            flashing: flashingConfiguration,
            quantity: 1,
            flashingFormName: formName,
            flashingFormData: formData
          };
          configuration.products.flashings.push(flashingConfig);
        }));
  }

  // 8 dodawanie akcesorium do konfiguracji
  createAccessoryConfigurationIntoConfigurationById(configId: string,
                                                    accessoryConfiguration: Accessory,
                                                    formName: string, formData: any) {
    this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          const accessoryConfig: AccessoryConfig = {
            id: this.hd.getHighestIdForProduct(configuration).accessoryId,
            accessory: accessoryConfiguration,
            quantity: 1,
            accessoryFormName: formName,
            accessoryFormData: formData
          };
          configuration.products.accessories.push(accessoryConfig);
        }));
  }

  createVerticalConfigurationIntoConfigurationById(configId: string,
                                                   verticalConfiguration: VerticalWindow,
                                                   formName: string, formData: any) {
    this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          const verticalConfig: VerticalConfig = {
            id: this.hd.getHighestIdForProduct(configuration).verticalId,
            vertical: verticalConfiguration,
            quantity: 1,
            verticalFormName: formName,
            verticalFormData: formData
          };
          configuration.products.verticals.push(verticalConfig);
        }));
  }

  createFlatConfigurationIntoConfigurationById(configId: string,
                                               flatConfiguration: FlatRoofWindow,
                                               formName: string, formData: any) {
    this.firestore.doc('allConfigurations/' + configId).valueChanges()
      .pipe(
        map((configuration: SingleConfiguration) => {
          const flatRoofWindowConfig: FlatConfig = {
            id: this.hd.getHighestIdForProduct(configuration).verticalId,
            flat: flatConfiguration,
            quantity: 1,
            flatFormName: formName,
            flatFormData: formData
          };
          configuration.products.flats.push(flatRoofWindowConfig);
        }));
  }

  updateNameConfigurationById(user: string, configId: string, configName: string) {
    return this.firestore.doc('allConfigurations/' + configId).update({
      name: configName
    });
  }

  updateWindowQuantity(user: string, configurationId: number, windowId: number, quantity: number) {

  }

  updateFlashingQuantity(user: string, configurationId: number,
                         flashingId: number, quantity: number) {

  }

  updateAccessoryQuantity(user: string, configurationId: number,
                          accessoryId: number, quantity: number) {

  }

  // 10 aktualizowanie okna w konfiguracji
  updateWindowConfigurationIntoConfigurationById(user: string, configurationId: string,
                                                 windowId: number, windowConfiguration: RoofWindowSkylight) {

  }

  // 11 aktualizowanie kołnierza w konfiguracji
  updateFlashingConfigurationIntoConfigurationById(user: string, configurationId: number,
                                                   flashingId: number, flashingConfiguration: Flashing) {

  }

  // 12 aktualizowanie akcesorium w konfiguracji
  updateAccessoryConfigurationIntoConfigurationById(user: string, configurationId: number,
                                                    accessoryId: number, accessoryConfiguration: Accessory) {
  }

  updateWindowConfigurationByFormName(configurationId: string, windowFormName: string, windowFormData: {}) {

  }

  // 1 usuwanie całej konfiguracji
  deleteConfigurationById(user: string, configurationId: string) {

  }

  // 2 usuwanie okna z konfiguracji
  deleteWindowConfigurationFromConfigurationById(user: string, configurationId: string, windowId: number) {

  }

  // 3 usuwanie kołnierza z konfiguracji
  deleteFlashingConfigurationFromConfigurationById(user: string, configurationId: string, flashingId: number) {

  }

  // 4 usuwanie acesorium z konfiguracji
  deleteAccessoryConfigurationFromConfigurationById(user: string, configurationId: string, accessoryId: number) {

  }
}

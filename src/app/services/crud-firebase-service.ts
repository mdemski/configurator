import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {HttpClient} from '@angular/common/http';
import {DatabaseService} from './database.service';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {SingleConfiguration} from '../models/single-configuration';
import {HighestIdGetterService} from './highest-id-getter.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';

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

  updateWindowConfigurationByFormName(user: string, configurationId: number, windowFormName: string, windowFormData: {}) {

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
  createWindowConfigurationIntoConfigurationById(user: string, configurationId: number, windowConfiguration: RoofWindowSkylight, formName: string, formData: any) {

  }

  // 7 dodawanie kołnierza do konfiguracji
  createFlashingConfigurationIntoConfigurationById(user: string, configurationId: number, flashingConfiguration: Flashing, formName: string, formData: any) {

  }

  // 8 dodawanie akcesorium do konfiguracji
  createAccessoryConfigurationIntoConfigurationById(user: string, configurationId: number, accessoryConfiguration: Accessory, formName: string, formData: any) {

  }

  updateNameConfigurationById(user: string, configurationId: number, configName: string) {

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
  updateWindowConfigurationIntoConfigurationById(user: string, configurationId: number,
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

  // 1 usuwanie całej konfiguracji
  deleteConfigurationById(user: string, configurationId: number) {

  }

  // 2 usuwanie okna z konfiguracji
  deleteWindowConfigurationFromConfigurationById(user: string, configurationId: number, windowId: number) {

  }

  // 3 usuwanie kołnierza z konfiguracji
  deleteFlashingConfigurationFromConfigurationById(user: string, configurationId: number, flashingId: number) {

  }

  // 4 usuwanie acesorium z konfiguracji
  deleteAccessoryConfigurationFromConfigurationById(user: string, configurationId: number, accessoryId: number) {

  }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {HttpClient} from '@angular/common/http';
import {DatabaseService} from './database.service';
import {map} from 'rxjs/operators';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';
import {SingleConfiguration} from '../models/single-configuration';
import {ConfigurationModel} from '../models/configuration-model';
import {HighestIdGetterService} from './highest-id-getter.service';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class CrudFirebaseService {

  constructor(private http: HttpClient, private db: DatabaseService, private hd: HighestIdGetterService,
              private firebase: AngularFireDatabase) {
  }

  // TODO poprawić na notację obiektową ponieważ jest to wydajniejsze - pytanie jak dodawać kolejne konfiguracje?
  // Even more..if your key is also dynamic you can define using the Object class with:
  // Object.defineProperty(data, key, withValue(value));
  // where data is your object, key is the variable to store the key name and value is the variable to store the value.

  temporaryConfigurations: Observable<any[]>;
  configurationData = new BehaviorSubject({});
  configurationDataChange$ = this.configurationData.asObservable();

  readAllConfigurationsFromFirebase(): Observable<ConfigurationModel[]> {
    // this.firebase.list('/allConfigurations', ref => ref.orderByChild('user').equalTo('192.168.0.2')).valueChanges().subscribe(data => console.log(data[0].user));
    return this.firebase.list('allConfigurations').valueChanges() as Observable<ConfigurationModel[]>;
  }

  readAllUserConfigurations(user: string): Observable<SingleConfiguration[]> {
    // return this.firebase.list('/allConfigurations', ref => ref.orderByChild('user').equalTo(user)).snapshotChanges().pipe(map((data: ConfigurationModel) => data.userConfigurations));
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      const configurations = [];
      for (const userConfigurations of allConfigurations) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            configurations.push(config);
          }
        }
      }
      return configurations;
    }));
  }

  readConfigurationById(user: string, configId: number): Observable<SingleConfiguration> {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      let configurationById = null;
      for (const userConfigurations of allConfigurations) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === Number(configId)) {
              configurationById = config;
            }
          }
        }
      }
      return configurationById;
    }));
  }

  readWindowsFromConfigurationById(user: string, configId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      let windowConfigurations = [];
      for (const userConfigurations of allConfigurations) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === Number(configId)) {
              if (config.windows !== undefined) {
                windowConfigurations = config.windows;
              }
            }
          }
        }
      }
      return windowConfigurations;
    }));
  }

  readFlashingsFromConfigurationById(user: string, configId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      let flashingConfigurations = [];
      for (const userConfigurations of allConfigurations) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === Number(configId)) {
              if (config.flashings !== undefined) {
                flashingConfigurations = config.flashings;
              }
            }
          }
        }
      }
      return flashingConfigurations;
    }));
  }

  readAccessoriesFromConfigurationById(user: string, configId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      let accessoryConfigurations = [];
      for (const userConfigurations of allConfigurations) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === Number(configId)) {
              if (config.accessories !== undefined) {
                accessoryConfigurations = config.accessories;
              }
            }
          }
        }
      }
      return accessoryConfigurations;
    }));
  }

  readWindowByIdFromConfigurationById(user: string, configId: number, windowId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      let windowById = null;
      for (const userConfigurations of allConfigurations) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === Number(configId)) {
              for (const window of config.windows) {
                if (window.id === Number(windowId)) {
                  windowById = window;
                }
              }
            }
          }
        }
      }
      return windowById;
    }));
  }

  readFlashingByIdFromConfigurationById(user: string, configId: number, flashingId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      let flashingById = null;
      for (const userConfigurations of allConfigurations) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === Number(configId)) {
              if (config.flashings !== undefined) {
                for (const flashing of config.flashings) {
                  if (flashing.id === Number(flashingId)) {
                    flashingById = flashing;
                  }
                }
              }
            }
          }
        }
      }
      return flashingById;
    }));
  }

  readAccessoryByIdFromConfigurationById(user: string, configId: number, accessoryId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      let accessoryById = null;
      for (const userConfigurations of allConfigurations) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === Number(configId)) {
              if (config.accessories !== undefined) {
                for (const accessory of config.accessories) {
                  if (accessory.id === Number(accessoryId)) {
                    accessoryById = accessory;
                  }
                }
              }
            }
          }
        }
      }
      return accessoryById;
    }));
  }

  readWindowConfigurationByFormName(formName: string) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => {
      let windowConfiguration = null;
      for (const configurations of allConfigurations) {
        for (const config of configurations.userConfigurations) {
          if (config) {
            if (config.windows !== undefined) {
              for (const windowConfig of config.windows) {
                if (windowConfig.windowFormName === formName) {
                  windowConfiguration = windowConfig;
                }
              }
            }
          }
        }
      }
      return windowConfiguration;
    }));
  }

  updateWindowConfigurationByFormName(user: string, configurationId: number, windowFormName: string, windowFormData: {}) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.windows.length; i++) {
        if (configurationWithId.windows[i].windowFormName === windowFormName) {
          configurationWithId.windows[i] = {
            id: configurationWithId.windows[i].id,
            quantity: configurationWithId.windows[i].quantity,
            window: configurationWithId.windows[i].window,
            windowFormName,
            windowFormData
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/' + smallArrayIndex + '/windows/' + i + '.json', configurationWithId.windows[i]).subscribe();
        }
      }
    });
  }

  createConfigurationForUser(user: string, configuration: SingleConfiguration) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      let configNotAdded = true;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < allConfigurations.length; i++) {
        if (allConfigurations[i].user === user) {
          allConfigurations[i].userConfigurations.push(configuration);
          this.http.put('https://window-configurator.firebaseio.com/allConfigurations/'
            + i + '/userConfigurations.json', allConfigurations[i].userConfigurations).subscribe();
          configNotAdded = false;
        }
      }
      if (configNotAdded) {
        const newConfigForUser: ConfigurationModel = {
          user,
          userConfigurations: [configuration]
        };
        allConfigurations.push(newConfigForUser);
        this.http.put('https://window-configurator.firebaseio.com/allConfigurations.json', allConfigurations).subscribe();
      }
    });
  }

  getIndexAndConfiguration(user: string, configurations: any[], configurationId: number) {
    let arrayIndex = 0;
    let smallArrayIndex = 0;
    let configurationWithId = null;
    for (let i = 0; i < configurations.length; i++) {
      if (configurations[i].user === user) {
        arrayIndex = i;
        for (let j = 0; j < configurations[i].userConfigurations.length; j++) {
          if (configurations[i].userConfigurations[j]) {
            if (configurations[i].userConfigurations[j].id === Number(configurationId)) {
              smallArrayIndex = j;
              configurationWithId = configurations[i].userConfigurations[j];
            }
          }
        }
      }
    }
    return {arrayIndex, configurationWithId, smallArrayIndex};
  }

  // 6 dodawanie okna do konfiguracji
  createWindowConfigurationIntoConfigurationById(user: string, configurationId: number, windowConfiguration: RoofWindowSkylight, formName: string, formData: any) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      if (configurationWithId === null) {
        this.createConfigurationForUser(user, {
          id: 1,
          name: 'Configuration name',
          windows: [{
            id: 1,
            quantity: 1,
            window: windowConfiguration,
            windowFormName: formName,
            windowFormData: formData
          }],
          flashings: null,
          accessories: null
        });
      } else {
        const nextArrayNumber = configurationWithId.windows === undefined ? 0 : configurationWithId.windows.length;
        const newWindow = {
          [nextArrayNumber]: {
            id: this.hd.getHighestId(1, configurationWithId.windows),
            quantity: 1,
            window: windowConfiguration,
            windowFormName: formName,
            windowFormData: formData
          }
        };
        this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
          + '/userConfigurations/' + smallArrayIndex + '/windows.json', newWindow).subscribe();
      }
    });
  }

  // 7 dodawanie kołnierza do konfiguracji
  createFlashingConfigurationIntoConfigurationById(user: string, configurationId: number, flashingConfiguration: Flashing, formName: string, formData: any) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      if (configurationWithId === null) {
        this.createConfigurationForUser(user, {
          id: 1,
          name: 'Configuration name',
          windows: null,
          flashings: [{
            id: 1,
            quantity: 1,
            flashing: flashingConfiguration,
            flashingFormName: formName,
            flashingFormData: formData
          }],
          accessories: null
        });
      } else {
        const nextArrayNumber = configurationWithId.flashings === undefined ? 0 : configurationWithId.flashings.length;
        const newFlashing = {
          [nextArrayNumber]: {
            id: this.hd.getHighestId(1, configurationWithId.flashings),
            quantity: 1,
            flashing: flashingConfiguration,
            flashingFormName: formName,
            flashingFormData: formData
          }
        };
        this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
          + '/userConfigurations/' + smallArrayIndex + '/flashings.json', newFlashing).subscribe();
      }
    });
  }

  // 8 dodawanie akcesorium do konfiguracji
  createAccessoryConfigurationIntoConfigurationById(user: string, configurationId: number, accessoryConfiguration: Accessory, formName: string, formData: any) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      if (configurationWithId === null) {
        this.createConfigurationForUser(user, {
          // @ts-ignore
          id: 1,
          name: 'Configuration name',
          windows: null,
          flashings: null,
          accessories: [{
            id: 1,
            quantity: 1,
            accessory: accessoryConfiguration,
            accessoryFormName: formName,
            accessoryFormData: formData
          }],
        });
      } else {
        const nextArrayNumber = configurationWithId.accessories === undefined ? 0 : configurationWithId.accessories.length;
        const newAccessory = {
          [nextArrayNumber]: {
            id: this.hd.getHighestId(1, configurationWithId.accessories),
            quantity: 1,
            accessory: accessoryConfiguration,
            accessoryFormName: formName,
            accessoryFormData: formData
          }
        };
        this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
          + '/userConfigurations/' + smallArrayIndex + '/accessories.json', newAccessory).subscribe();
      }
    });
  }

  updateNameConfigurationById(user: string, configurationId: number, configName: string) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      configurationWithId.name = configName;
      this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
        + '/userConfigurations/' + smallArrayIndex + '.json', configurationWithId).subscribe();
    });
  }

  updateWindowQuantity(user: string, configurationId: number, windowId: number, quantity: number) {
    if (quantity === 0 || quantity === undefined) {
      quantity = 1;
    }
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.windows.length; i++) {
        if (configurationWithId.windows[i].id === Number(windowId)) {
          configurationWithId.windows[i] = {
            id: configurationWithId.windows[i].id,
            quantity,
            window: configurationWithId.windows[i].window,
            windowFormName: configurationWithId.windows[i].windowFormName,
            windowFormData: configurationWithId.windows[i].windowFormData
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/' + smallArrayIndex + '/windows/' + i + '.json', configurationWithId.windows[i]).subscribe();
        }
      }
    });
  }

  updateFlashingQuantity(user: string, configurationId: number,
                         flashingId: number, quantity: number) {
    if (quantity === 0 || quantity === undefined) {
      quantity = 1;
    }
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.flashings.length; i++) {
        if (configurationWithId.flashings[i].id === Number(flashingId)) {
          configurationWithId.flashings[i] = {
            id: configurationWithId.flashings[i].id,
            quantity,
            flashing: configurationWithId.flashings[i].flashing,
            flashingFormName: configurationWithId.windows[i].flashingFormName,
            flashingFormData: configurationWithId.windows[i].flashingFormData
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/' + smallArrayIndex + '/flashings/' + i + '.json', configurationWithId.flashings[i]).subscribe();
        }
      }
    });
  }

  updateAccessoryQuantity(user: string, configurationId: number,
                          accessoryId: number, quantity: number) {
    if (quantity === 0 || quantity === undefined) {
      quantity = 1;
    }
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.accessories.length; i++) {
        if (configurationWithId.accessories[i].id === Number(accessoryId)) {
          configurationWithId.accessories[i] = {
            id: configurationWithId.accessories[i].id,
            quantity,
            accessory: configurationWithId.accessories[i].accessory,
            accessoryFormName: configurationWithId.windows[i].accessoryFormName,
            accessoryFormData: configurationWithId.windows[i].accessoryFormData
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/' + smallArrayIndex + '/accessories/' + i + '.json', configurationWithId.accessories[i]).subscribe();
        }
      }
    });
  }

  // 10 aktualizowanie okna w konfiguracji
  updateWindowConfigurationIntoConfigurationById(user: string, configurationId: number,
                                                 windowId: number, windowConfiguration: RoofWindowSkylight) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.windows.length; i++) {
        if (configurationWithId.windows[i].id === Number(windowId)) {
          configurationWithId.windows[i] = {
            id: configurationWithId.windows[i].id,
            quantity: configurationWithId.windows[i].quantity,
            window: windowConfiguration,
            windowFormName: configurationWithId.windows[i].windowFormName,
            windowFormData: configurationWithId.windows[i].windowFormData
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/' + smallArrayIndex + '/windows/' + i + '.json', configurationWithId.windows[i]).subscribe();
        }
      }
    });
  }

  // 11 aktualizowanie kołnierza w konfiguracji
  updateFlashingConfigurationIntoConfigurationById(user: string, configurationId: number,
                                                   flashingId: number, flashingConfiguration: Flashing) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.flashings.length; i++) {
        if (configurationWithId.flashings[i].id === Number(flashingId)) {
          configurationWithId.flashings[i] = {
            id: configurationWithId.flashings[i].id,
            quantity: configurationWithId.flashings[i].quantity,
            flashing: flashingConfiguration,
            flashingFormName: configurationWithId.windows[i].flashingFormName,
            flashingFormData: configurationWithId.windows[i].flashingFormData
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/' + smallArrayIndex + '/flashings/' + i + '.json', configurationWithId.flashings[i]).subscribe();
        }
      }
    });
  }

  // 12 aktualizowanie akcesorium w konfiguracji
  updateAccessoryConfigurationIntoConfigurationById(user: string, configurationId: number,
                                                    accessoryId: number, accessoryConfiguration: Accessory) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.accessories.length; i++) {
        if (configurationWithId.accessories[i].id === Number(accessoryId)) {
          configurationWithId.accessories[i] = {
            id: configurationWithId.accessories[i].id,
            quantity: configurationWithId.accessories[i].quantity,
            accessory: accessoryConfiguration,
            accessoryFormName: configurationWithId.windows[i].accessoryFormName,
            accessoryFormData: configurationWithId.windows[i].accessoryFormData
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/' + smallArrayIndex + '/accessories/' + i + '.json', configurationWithId.accessories[i]).subscribe();
        }
      }
    });
  }

  // 1 usuwanie całej konfiguracji
  deleteConfigurationById(user: string, configurationId: number) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigurations => {
      const arrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allConfigurations, configurationId).smallArrayIndex;
      for (const configurations of allConfigurations) {
        console.log('Długość tablicy to:' + configurations.userConfigurations.filter(x => x !== null).length);
        if (configurations.user === user && configurationWithId.id === configurationId) {
          this.http.delete('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex +
            '/userConfigurations/' + smallArrayIndex + '.json').subscribe();
        }
        // if (configurations.userConfigurations.length === 1) {
        //   this.http.delete('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex + '.json').subscribe();
        // }
      }
    });
  }

  // 2 usuwanie okna z konfiguracji
  deleteWindowConfigurationFromConfigurationById(user: string, configurationId: number, windowId: number) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      let windowIndex = -1;
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.windows.length; i++) {
        if (configurationWithId.windows[i].id === Number(windowId)) {
          windowIndex = i;
        }
      }
      configurationWithId.windows.splice(windowIndex, 1);
      if (configurationWithId.windows.length === 0) {
        configurationWithId.windows = [];
      }
      if (configurationWithId.accessories.length === undefined &&
        configurationWithId.flashings === undefined &&
        configurationWithId.windows === 0) {
        this.deleteConfigurationById(user, configurationId);
      }
      this.http.put('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
        + '/userConfigurations/' + smallArrayIndex + '/windows.json', configurationWithId.windows).subscribe();
    });
  }

  // 3 usuwanie kołnierza z konfiguracji
  deleteFlashingConfigurationFromConfigurationById(user: string, configurationId: number, flashingId: number) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      let flashingndex = -1;
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.flashings.length; i++) {
        if (configurationWithId.flashings[i].id === Number(flashingId)) {
          flashingndex = i;
        }
      }
      configurationWithId.flashings.splice(flashingndex, 1);
      if (configurationWithId.flashings.length === 0) {
        configurationWithId.flashings = [];
      }
      if (configurationWithId.accessories.length === undefined &&
        configurationWithId.flashings === 0 &&
        configurationWithId.windows === undefined) {
        this.deleteConfigurationById(user, configurationId);
      }
      this.http.put('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
        + '/userConfigurations/' + smallArrayIndex + '/flashings.json', configurationWithId.flashings).subscribe();
    });
  }

  // 4 usuwanie acesorium z konfiguracji
  deleteAccessoryConfigurationFromConfigurationById(user: string, configurationId: number, accessoryId: number) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      let accessoryIndex = -1;
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      const smallArrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).smallArrayIndex;
      for (let i = 0; i < configurationWithId.accessories.length; i++) {
        if (configurationWithId.accessories[i].id === Number(accessoryId)) {
          accessoryIndex = i;
        }
      }
      configurationWithId.accessories.splice(accessoryIndex, 1);
      if (configurationWithId.accessories.length === 0) {
        configurationWithId.accessories = [];
      }
      if (configurationWithId.accessories.length === 0 &&
        configurationWithId.flashings === undefined &&
        configurationWithId.windows === undefined) {
        this.deleteConfigurationById(user, configurationId);
      }
      this.http.put('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
        + '/userConfigurations/' + smallArrayIndex + '/accessories.json', configurationWithId.accessories).subscribe();
    });
  }
}

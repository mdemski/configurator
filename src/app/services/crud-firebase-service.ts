import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ConfigurationRoofWindowModel} from '../models/configurationRoofWindowModel';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {HttpClient} from '@angular/common/http';
import {DatabaseService} from './database.service';
import {map} from 'rxjs/operators';
import {Flashing} from '../models/flashing';
import {Accessory} from '../models/accessory';

@Injectable({
  providedIn: 'root'
})
export class CrudFirebaseService {

  constructor(private http: HttpClient, private db: DatabaseService) {
  }

  // TODO poprawić na notację obiektową ponieważ jest to wydajniejsze - pytanie jak dodawać kolejne konfiguracje?
  // Even more..if your key is also dynamic you can define using the Object class with:
  // Object.defineProperty(data, key, withValue(value));
  // where data is your object, key is the variable to store the key name and value is the variable to store the value.

  temporaryConfigurations: Observable<any[]>;
  configurationData = new BehaviorSubject({});
  configurationDataChange$ = this.configurationData.asObservable();

  readAllConfigurationsFromFirebase() {
    return this.http.get('https://window-configurator.firebaseio.com/allConfigurations.json');
  }

  readAllUserConfigurations(user: string) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigs => {
      const configurations = [];
      // @ts-ignore
      for (const userConfigurations of allConfigs) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            configurations.push(config);
          }
        }
      }
      return configurations;
    }));
  }

  readConfigurationById(user: string, configId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigs => {
      // @ts-ignore
      for (const userConfigurations of allConfigs) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === configId) {
              return config;
            }
          }
        }
      }
    }));
  }

  readWindowsFromConfigurationById(user: string, configId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigs => {
      // @ts-ignore
      for (const userConfigurations of allConfigs) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === configId) {
              return config.windows;
            }
          }
        }
      }
    }));
  }

  readFlashingsFromConfigurationById(user: string, configId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigs => {
      // @ts-ignore
      for (const userConfigurations of allConfigs) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === configId) {
              if (config.flashings !== undefined) {
                return config.flashings;
              } else {
                return [];
              }
            }
          }
        }
      }
    }));
  }

  readAccessoriesFromConfigurationById(user: string, configId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigs => {
      // @ts-ignore
      for (const userConfigurations of allConfigs) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === configId) {
              if (config.accessories !== undefined) {
                return config.accessories;
              } else {
                return [];
              }
            }
          }
        }
      }
    }));
  }

  readWindowByIdFromConfigurationById(user: string, configId: number, windowId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigs => {
      // @ts-ignore
      for (const userConfigurations of allConfigs) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === configId) {
              for (const window of config.windows) {
                if (window.id === windowId) {
                  return window;
                }
              }
            }
          }
        }
      }
    }));
  }

  readFlashingByIdFromConfigurationById(user: string, configId: number, flashingId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigs => {
      // @ts-ignore
      for (const userConfigurations of allConfigs) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === configId) {
              if (config.flashings !== undefined) {
                for (const flashing of config.flashings) {
                  if (flashing.id === flashingId) {
                    return flashing;
                  }
                }
              } else {
                return null;
              }
            }
          }
        }
      }
    }));
  }

  readAccessoryByIdFromConfigurationById(user: string, configId: number, accessoryId: number) {
    return this.readAllConfigurationsFromFirebase().pipe(map(allConfigs => {
      // @ts-ignore
      for (const userConfigurations of allConfigs) {
        if (user === userConfigurations.user) {
          for (const config of userConfigurations.userConfigurations) {
            if (config.id === configId) {
              if (config.accessories !== undefined) {
                for (const accessory of config.accessories) {
                  if (accessory.id === accessoryId) {
                    return accessory;
                  }
                }
              } else {
                return null;
              }
            }
          }
        }
      }
    }));
  }

  createConfigurationForUser(user: string, configuration: ConfigurationRoofWindowModel) {
    this.readAllConfigurationsFromFirebase().subscribe(allConfigs => {
      let configNotAdded = true;
      // @ts-ignore
      for (let i = 0; i < allConfigs.length; i++) {
        if (allConfigs[i].user === user) {
          allConfigs[i].userConfigurations.push(configuration);
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations.json', allConfigs).subscribe();
          configNotAdded = false;
        }
      }
      if (configNotAdded) {
        const newConfigForUser = {
          user,
          userConfigurations: [configuration]
        };
        // @ts-ignore
        allConfigs.push(newConfigForUser);
        this.http.put('https://window-configurator.firebaseio.com/allConfigurations.json', allConfigs).subscribe();
      }
    });
  }

  getIndexAndConfiguration(user: string, configurations: any[], configurationId: number) {
    let arrayIndex = 0;
    let configurationWithId = null;
    for (let i = 0; i < configurations.length; i++) {
      if (configurations[i].user === user && configurations[i].userConfigurations[0].id === configurationId) {
        arrayIndex = i;
        configurationWithId = configurations[i].userConfigurations[0];
      }
    }
    return {arrayIndex, configurationWithId};
  }

  // 6 dodawanie okna do konfiguracji
  createWindowConfigurationIntoConfigurationById(user: string, configurationId: number, windowConfiguration: RoofWindowSkylight) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      // @ts-ignore
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      // @ts-ignore
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      if (configurationWithId === null) {
        this.createConfigurationForUser(user, {
          // @ts-ignore
          id: 1,
          windows: [{
            id: 1,
            quantity: 1,
            window: windowConfiguration
          }],
          flashings: null,
          accessories: null
        });
      } else {
        const nextArrayNumber = configurationWithId.windows === null ? 0 : configurationWithId.windows.length;
        const newWindow = {
          [nextArrayNumber]: {
            id: nextArrayNumber + 1,
            quantity: 1,
            window: windowConfiguration
          }
        };
        this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
          + '/userConfigurations/0/windows.json', newWindow).subscribe();
      }
    });
  }

  // 7 dodawanie kołnierza do konfiguracji
  createFlashingConfigurationIntoConfigurationById(user: string, configurationId: number, flashingConfiguration: Flashing) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      // @ts-ignore
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      // @ts-ignore
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      const nextArrayNumber = configurationWithId.flashings === undefined ? 0 : configurationWithId.flashings.length;
      const newFlashing = {
        [nextArrayNumber]: {
          id: nextArrayNumber + 1,
          quantity: 1,
          flashing: flashingConfiguration
        }
      };
      this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
        + '/userConfigurations/0/flashings.json', newFlashing).subscribe();
    });
  }

  // 8 dodawanie akcesorium do konfiguracji
  createAccessoryConfigurationIntoConfigurationById(user: string, configurationId: number, accessoryConfiguration: Accessory) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      // @ts-ignore
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      // @ts-ignore
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      const nextArrayNumber = configurationWithId.accessories === undefined ? 0 : configurationWithId.accessories.length;
      const newAccessory = {
        [nextArrayNumber]: {
          id: nextArrayNumber + 1,
          quantity: 1,
          accessory: accessoryConfiguration
        }
      };
      this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
        + '/userConfigurations/0/accessories.json', newAccessory).subscribe();
    });
  }

  // 10 aktualizowanie okna do konfiguracji
  updateWindowConfigurationIntoConfigurationById(user: string, configurationId: number,
                                                 windowId: number, windowConfiguration: RoofWindowSkylight) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      // @ts-ignore
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      // @ts-ignore
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      for (let i = 0; i < configurationWithId.windows.length; i++) {
        if (configurationWithId.windows[i].id === windowId) {
          configurationWithId.windows[i] = {
            id: configurationWithId.windows[i].id,
            quantity: configurationWithId.windows[i].quantity,
            window: windowConfiguration
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/0/windows/' + i + '.json', configurationWithId.windows[i]).subscribe();
        }
      }
    });
  }

  // 11 aktualizowanie okna do konfiguracji
  updateFlashingConfigurationIntoConfigurationById(user: string, configurationId: number,
                                                   flashingId: number, flashingConfiguration: Flashing) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      // @ts-ignore
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      // @ts-ignore
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      for (let i = 0; i < configurationWithId.flashings.length; i++) {
        if (configurationWithId.flashings[i].id === flashingId) {
          configurationWithId.flashings[i] = {
            id: configurationWithId.flashings[i].id,
            quantity: configurationWithId.flashings[i].quantity,
            flashing: flashingConfiguration
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/0/flashings/' + i + '.json', configurationWithId.flashings[i]).subscribe();
        }
      }
    });
  }

  // 12 aktualizowanie akcesorium do konfiguracji
  updateAccessoryConfigurationIntoConfigurationById(user: string, configurationId: number,
                                                    accessoryId: number, accessoryConfiguration: Accessory) {
    this.readAllConfigurationsFromFirebase().subscribe(allUserConfigurations => {
      // @ts-ignore
      const arrayIndex = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).arrayIndex;
      // @ts-ignore
      const configurationWithId = this.getIndexAndConfiguration(user, allUserConfigurations, configurationId).configurationWithId;
      for (let i = 0; i < configurationWithId.accessories.length; i++) {
        if (configurationWithId.accessories[i].id === accessoryId) {
          configurationWithId.accessories[i] = {
            id: configurationWithId.accessories[i].id,
            quantity: configurationWithId.accessories[i].quantity,
            accessory: accessoryConfiguration
          };
          this.http.patch('https://window-configurator.firebaseio.com/allConfigurations/' + arrayIndex
            + '/userConfigurations/0/accessories/' + i + '.json', configurationWithId.accessories[i]).subscribe();
        }
      }
    });
  }

  // TODO usunąć tymczasową konfigurację do testów aplikacji - przetestować zapisywanie po zalogowaniu
  populateDataToFirebase() {
    const temporaryConfigurationsForWork: ConfigurationRoofWindowModel[] = [{
      user: '178.73.35.155',
      userConfigurations: [{
        id: 1,
        windows: [{
          id: 1,
          quantity: 1,
          window: this.db.getAllRoofWindowsToShopList()[0]
        },
          {
            id: 2,
            quantity: 1,
            window: this.db.getAllRoofWindowsToShopList()[1]
          },
          {
            id: 3,
            quantity: 1,
            window: this.db.getAllRoofWindowsToShopList()[2]
          }],
        flashings: [{
          id: 1,
          quantity: 1,
          flashing: this.db.temporaryFlashing
        },
          {
            id: 2,
            quantity: 1,
            flashing: this.db.temporaryFlashing
          }
        ],
        accessories: [{
          id: 1,
          quantity: 1,
          accessory: this.db.accessories[0]
        },
          {
            id: 2,
            quantity: 2,
            accessory: this.db.accessories[2]
          }]
      }]
    },
      {
        user: '192.168.0.2',
        userConfigurations: [{
          id: 1,
          windows: [{
            id: 1,
            quantity: 1,
            window: this.db.getAllRoofWindowsToShopList()[0]
          },
            {
              id: 2,
              quantity: 1,
              window: this.db.getAllRoofWindowsToShopList()[0]
            }],
          flashings: [{
            id: 1,
            quantity: 1,
            flashing: this.db.temporaryFlashing
          },
            {
              id: 2,
              quantity: 1,
              flashing: this.db.temporaryFlashing
            }
          ],
          accessories: [
            {
              id: 1,
              quantity: 2,
              accessory: this.db.accessories[2]
            }]
        }]
      },
      {
        user: '178.73.35.155',
        userConfigurations: [{
          id: 2,
          windows: [{
            id: 1,
            quantity: 1,
            window: this.db.getAllRoofWindowsToShopList()[1]
          }],
          flashings: null,
          accessories: null
        }]
      }];
    return this.http.put('https://window-configurator.firebaseio.com/allConfigurations.json', temporaryConfigurationsForWork).subscribe();
  }
}

// addWindowToConfigurationsArray(user: string, configuredWindow: RoofWindowSkylight, configurationId: number) {
//   this.readAllConfigurationsFromFirebase().pipe(map(allConfigurations => allConfigurations)).subscribe(allConfigurations => {
//     console.log(allConfigurations);
//     let tempUser = '1';
//     let tempWindowConfigurations = [{
//       id: 0,
//       quantity: 0,
//       window: null
//     }];
//     let tempFlashingConfigurations = [{
//       id: 0,
//       quantity: 0,
//       flashing: null
//     }];
//     let tempAccessoryConfigurations = [{
//       id: 0,
//       quantity: 0,
//       accessory: null
//     }];
//     let tempUsersConfigurations: ConfigurationRoofWindowModel = {
//       user: '',
//       userConfigurations: [{
//         id: 0,
//         windows: null,
//         flashings: null,
//         accessories: null
//       }]
//     };
//     for (const configs of allConfigurations[0]) {
//       if (configs.user === user) {
//         tempUser = configs.user;
//         tempUsersConfigurations = configs;
//         for (const config of configs.userConfigurations) {
//           tempWindowConfigurations = config.windows;
//           tempFlashingConfigurations = config.flashings;
//           tempAccessoryConfigurations = config.accessories;
//         }
//       }
//     }
//     if (tempUser !== '') {
//       tempUsersConfigurations.user = user;
//       tempUsersConfigurations.userConfigurations = [{
//         id: 1,
//         windows: [{
//           id: 1,
//           quantity: 1,
//           window: configuredWindow
//         }],
//         flashings: null,
//         accessories: null
//       }];
//     } else {
//       tempUsersConfigurations[configurationId] = {
//         id: configurationId,
//         windows: tempWindowConfigurations.push({
//           id: tempWindowConfigurations.length + 1,
//           quantity: 1,
//           window: configuredWindow
//         }),
//         flashings: tempFlashingConfigurations,
//         accessories: tempAccessoryConfigurations
//       };
//     }
//     // Wydobycie tych danych: var retrievedObject = localStorage.getItem('testObject');
//     // console.log('retrievedObject: ', JSON.parse(retrievedObject));
//   });
// }

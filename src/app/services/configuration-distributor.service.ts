import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ConfigurationRoofWindowModel} from '../models/configurationRoofWindowModel';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {HttpClient} from '@angular/common/http';
import {DatabaseService} from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDistributorService {

  constructor(private http: HttpClient, private db: DatabaseService) {
  }

  // TODO poprawić na notację obiektową ponieważ jest to wydajniejsze - pytanie jak dodawać kolejne konfiguracje?
  // Even more..if your key is also dynamic you can define using the Object class with:
  // Object.defineProperty(data, key, withValue(value));
  // where data is your object, key is the variable to store the key name and value is the variable to store the value.

  temporaryConfigurations: Observable<any[]>;
  configurationData = new BehaviorSubject({});
  configurationDataChange$ = this.configurationData.asObservable();

  private getAllConfigurationsFromFirebase() {
    const firebaseConfigurations = [];
    // TODO pobrać listę konfiguracji
    return firebaseConfigurations;
  }

  populateDataToFirebase(userConfigurations) {
    return this.http.post('https://window-configurator.firebaseio.com/allConfigurations.json', userConfigurations).subscribe();
  }

  addWindowToConfigurationsArray(user: string, configuredWindow: RoofWindowSkylight, configurationId: number) {
    const allConfigurations: ConfigurationRoofWindowModel[] = this.getAllConfigurationsFromFirebase();
    let tempUser = '1';
    let tempWindowConfigurations = [{
      id: 0,
      quantity: 0,
      window: null
    }];
    let tempFlashingConfigurations = [{
      id: 0,
      quantity: 0,
      flashing: null
    }];
    let tempAccessoryConfigurations = [{
      id: 0,
      quantity: 0,
      accessory: null
    }];
    let tempUsersConfigurations: ConfigurationRoofWindowModel = {
      user: '',
      userConfigurations: [{
        id: 0,
        windows: null,
        flashings: null,
        accessories: null
      }]
    };
    for (const configs of allConfigurations) {
      if (configs.user === user) {
        tempUser = configs.user;
        tempUsersConfigurations = configs;
        for (const config of configs.userConfigurations) {
          tempWindowConfigurations = config.windows;
          tempFlashingConfigurations = config.flashings;
          tempAccessoryConfigurations = config.accessories;
        }
      }
    }
    if (tempUser !== '') {
      tempUsersConfigurations.user = user;
      tempUsersConfigurations.userConfigurations = [{
        id: 1,
        windows: [{
          id: 1,
          quantity: 1,
          window: configuredWindow
        }],
        flashings: null,
        accessories: null
      }];
    } else {
      tempUsersConfigurations[configurationId] = {
        id: configurationId,
        windows: tempWindowConfigurations.push({
          id: tempWindowConfigurations.length + 1,
          quantity: 1,
          window: configuredWindow
        }),
        flashings: tempFlashingConfigurations,
        accessories: tempAccessoryConfigurations
      };
    }
    // TODO usunąć tymczasową konfigurację do testów aplikacji - przetestować zapisywanie po zalogowaniu
    const temporaryConfigurationsForWork: ConfigurationRoofWindowModel[] = [{
      user: '192.168.0.1',
      userConfigurations: [{
        id: 1,
        windows: [{
          id: 1,
          quantity: 1,
          window: configuredWindow
        },
          {
            id: 2,
            quantity: 1,
            window: configuredWindow
          },
          {
            id: 3,
            quantity: 1,
            window: configuredWindow
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
        window: configuredWindow
      },
        {
          id: 2,
          quantity: 1,
          window: configuredWindow
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
        user: '192.168.0.1',
        userConfigurations: [{
          id: 2,
          windows: [{
            id: 1,
            quantity: 1,
            window: configuredWindow
          }],
          flashings: null,
          accessories: null
        }]
      }];
    localStorage.clear();
    this.populateDataToFirebase(temporaryConfigurationsForWork);
    localStorage.setItem('configurations', JSON.stringify(temporaryConfigurationsForWork));
    // Wydobycie tych danych: var retrievedObject = localStorage.getItem('testObject');
    // console.log('retrievedObject: ', JSON.parse(retrievedObject));
  }

  addNewConfiguration() {
    // TODO przygotować metodę dodawania nowej konfiguracji
  }

  removeWindowToConfigurationsArray(user: string, configId: number) {
    // TODO pobrać wszystkie konfiguracje, odfiltorwać użytkownika i numer, usunąć tą konretną, zapisać ponownie wszystkie pozostałe do localStorage
  }
}

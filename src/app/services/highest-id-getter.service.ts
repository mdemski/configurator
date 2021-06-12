import {Injectable} from '@angular/core';
import {SingleConfiguration} from '../models/single-configuration';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HighestIdGetterService {
  highestId: number;
  private configurationGlobalId$ = new BehaviorSubject(1);
  private configurationUserId$ = new BehaviorSubject(1);

  constructor(private firestore: AngularFirestore,
              private auth: AuthService) {
    this.highestId = 0;
    this.auth.returnUser().subscribe(user => {
      this.firestore.collection('allConfigurations').valueChanges().pipe().subscribe((allConfigurations: SingleConfiguration[]) => {
        let userIdNumber = 1;
        this.configurationGlobalId$.next(allConfigurations.length + 1);
        allConfigurations.forEach(config => {
          if (config.user === user) {
            userIdNumber++;
          }
        });
        this.configurationUserId$.next(userIdNumber);
      });
    });
  }

  getHighestIdForProduct(configuration: SingleConfiguration) {
    const productObjectId = {
      windowId: 1,
      flashingId: 1,
      accessoryId: 1,
      verticalId: 1,
      flatId: 1,
    };
    if (configuration.products.windows.length === 0) {
      productObjectId.windowId = 1;
    } else {
      for (const window of configuration.products.windows) {
        if (window.id > productObjectId.windowId) {
          productObjectId.windowId = window.id;
        }
      }
      productObjectId.windowId++;
    }
    if (configuration.products.flashings === null) {
      productObjectId.flashingId = 1;
    } else {
      for (const flashing of configuration.products.flashings) {
        if (flashing.id > productObjectId.flashingId) {
          productObjectId.flashingId = flashing.id;
        }
      }
      productObjectId.flashingId++;
    }
    if (configuration.products.accessories === null) {
      productObjectId.accessoryId = 1;
    } else {
      for (const accessory of configuration.products.accessories) {
        if (accessory.id > productObjectId.accessoryId) {
          productObjectId.accessoryId = accessory.id;
        }
      }
      productObjectId.accessoryId++;
    }
    if (configuration.products.verticals === null) {
      productObjectId.verticalId = 1;
    } else {
      for (const vertical of configuration.products.verticals) {
        if (vertical.id > productObjectId.verticalId) {
          productObjectId.verticalId = vertical.id;
        }
      }
      productObjectId.verticalId++;
    }
    if (configuration.products.flats === null) {
      productObjectId.flatId = 1;
    } else {
      for (const flat of configuration.products.flats) {
        if (flat.id > productObjectId.flatId) {
          productObjectId.flatId = flat.id;
        }
      }
      productObjectId.flatId++;
    }
    return productObjectId;
  }

  getHighestIdFormFireStore() {
    let configurationId = 1;
    this.configurationGlobalId$.subscribe(id => configurationId = id);
    this.configurationGlobalId$.next(configurationId + 1);
    return configurationId;
  }

  getHighestIdForUser() {
    let userId = 1;
    this.configurationUserId$.subscribe(id => userId = id);
    this.configurationUserId$.next(userId + 1);
    return userId;
  }
}

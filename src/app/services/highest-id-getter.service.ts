import {Injectable} from '@angular/core';
import {SingleConfiguration} from '../models/single-configuration';
import {CrudFirebaseService} from './crud-firebase-service';

@Injectable({
  providedIn: 'root'
})
export class HighestIdGetterService {
  highestId: number;

  constructor(private crud: CrudFirebaseService) {
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

  getHighestGlobalIdFormMongoDB() {
    let configurationId = 1;
    this.crud.readAllConfigurationsFromMongoDB().subscribe((configurations: SingleConfiguration[]) => {
      for (const config of configurations) {
        const globalId = Number(config.globalId.split('-')[1]);
        if (globalId > configurationId) {
          configurationId = globalId;
        }
      }
      configurationId++;
    });
    return String('configuration-' + configurationId);
  }

  getHighestIdForUser(user: string) {
    let userId = 1;
    this.crud.readAllUserConfigurations(user).subscribe((configurations: SingleConfiguration[]) => {
      for (const config of configurations) {
        if (config.userId > userId) {
          userId = config.userId;
        }
      }
      userId++;
    });
    return userId;
  }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ConfigurationModel} from '../models/configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationDistributorService {

  // TODO poprawić na notację obiektową ponieważ jest to wydajniejsze - pytanie jak dodawać kolejne konfiguracje?
  // Even more..if your key is also dynamic you can define using the Object class with:
  // Object.defineProperty(data, key, withValue(value));
  // where data is your object, key is the variable to store the key name and value is the variable to store the value.

  configurations: ConfigurationModel[] = [];
  configurationData = new BehaviorSubject([]);
  configurationDataChange$ = this.configurationData.asObservable();

  constructor() {
  }

  populateData(windowConfiguration, flashingConfiguration, accessoryConfiguration) {
    this.configurations.push({
      window: windowConfiguration,
      flashing: flashingConfiguration,
      accessory: accessoryConfiguration,
    });
    this.configurationData.next(this.configurations);
  }

}

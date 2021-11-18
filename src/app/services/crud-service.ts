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
import {User} from '../models/user';
import {Address} from '../models/address';
import {Company} from '../models/company';
import {Cart} from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient, private db: DatabaseService, private hd: HighestIdGetterService) {
  }

  // TODO poprawić na notację obiektową ponieważ jest to wydajniejsze - pytanie jak dodawać kolejne konfiguracje?
  // Even more..if your key is also dynamic you can define using the Object class with:
  // Object.defineProperty(data, key, withValue(value));
  // where data is your object, key is the variable to store the key name and value is the variable to store the value.

  baseUri = 'http://localhost:4000/api';
  usersBaseUri = 'http://localhost:4000/api/users';
  addressesBaseUri = 'http://localhost:4000/api/addresses';
  cartsBaseUri = 'http://localhost:4000/api/carts';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  temporaryConfigurations: Observable<any[]>;

  private urlToUpdateSetter(globalConfiguration: SingleConfiguration) {
    return `${this.baseUri}/update/${globalConfiguration._id}`;
  }

  getCountryList() {
    return this.http.get('https://countriesnow.space/api/v0.1/countries').pipe(map((object: { error: boolean, msg: string, data: [{ country: string, cities: [] }] }) => {
      return object.data.map(response => response.country);
    }));
  }

  // Zawieszone ze względu na koszty zapytanie 5USD/1k zapytań
  // getGeoLocation(street: string, localNumber: string, zipCode: string, city: string, country: string) {
  //   const requestURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
  //     + localNumber + '+' + street + ',+' + zipCode + '+' + city + ',+' + country
  //     + '&key=' + environment.firebaseConfig.apiKey;
  //   return this.http.get(requestURL);
  // }

  loadCurrentCurrencyRate() {
    // TODO poprawić adres który ma być odpytany z eNova
    return this.http.get('URL do zapytania do eNova').pipe(map(rate => {
      return rate;
    }));
  }

  readAllCompaniesFromERP(): Observable<Company[]> {
    // TODO poprawić adres który ma być odpytany z eNova
    return this.http.get('URL do zapytania do eNova').pipe(map((companies: Company[]) => {
      return companies;
    }));
  }

  readAllUsersFromMongoDB(): Observable<User[]> {
    return this.http.get(this.usersBaseUri).pipe(map((users: User[]) => {
      return users;
    }));
  }

  readUserByMongoId(mongoId: string): Observable<User> {
    const url = this.usersBaseUri + '/' + mongoId;
    return this.http.get(url).pipe(map((user: User) => user));
  }

  readUserByUUID(uuid: string): Observable<User> {
    const url = this.usersBaseUri + '/uuid/' + uuid;
    return this.http.get(url).pipe(map((user: User) => user));
  }

  readUserByEmail(email: string): Observable<User> {
    const url = this.usersBaseUri + '/email/' + email;
    return this.http.get(url).pipe(map((user: User) => user));
  }

  readUserByUsername(username: string): Observable<User> {
    const url = this.usersBaseUri + '/username/' + username;
    return this.http.get(url).pipe(map((user: User) => user));
  }

  readAllAddressesFromMongoDB(): Observable<Address[]> {
    return this.http.get(this.addressesBaseUri).pipe(map((addresses: Address[]) => {
      return addresses;
    }));
  }

  readAddressByMongoId(mongoId: string): Observable<Address> {
    return this.http.get(this.addressesBaseUri).pipe(map((addresses: Address[]) => addresses
      .find(address => address.id === mongoId)));
  }

  readAllCartsFromMongoDB(): Observable<Cart[]> {
    return this.http.get(this.cartsBaseUri).pipe(map((carts: Cart[]) => {
      return carts;
    }));
  }

  readCartByMongoId(mongoId: string): Observable<Cart> {
    return this.http.get(this.cartsBaseUri).pipe(map((carts: Cart[]) => carts.find(cart => cart.id === mongoId)));
  }

  readAllConfigurationsFromMongoDB(): Observable<SingleConfiguration[]> {
    return this.http.get(this.baseUri).pipe(map((data: SingleConfiguration[]) => {
      return data;
    }));
  }

  readAllUserConfigurations(user: string): Observable<SingleConfiguration[]> {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .filter(configuration => configuration.user === user)));
  }

  readConfigurationByMongoId(mongoId: string): Observable<SingleConfiguration> {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration._id === mongoId)));
  }

  readConfigurationByGlobalId(globalId: string): Observable<SingleConfiguration> {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === globalId)));
  }

  readConfigurationByName(configName: string): Observable<SingleConfiguration> {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.name === configName)));
  }

  readWindowConfigurationsFromConfigurationByGlobalId(globalId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === globalId).products.windows));
  }

  readFlashingConfigurationsFromConfigurationByGlobalId(globalId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === globalId).products.flashings));
  }

  readAccessoryConfigurationsFromConfigurationByGlobalId(globalId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === globalId).products.accessories));
  }

  readVerticalConfigurationsFromConfigurationByGlobalId(globalId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === globalId).products.verticals));
  }

  readFlatConfigurationsFromConfigurationByGlobalId(globalId: string) {
    return this.http.get(this.baseUri).pipe(map((configurations: SingleConfiguration[]) => configurations
      .find(configuration => configuration.globalId === globalId).products.flats));
  }

  readWindowByIdFromConfigurationByGlobalId(globalId: string, windowId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === globalId).products),
      map(products => products.windows.find(window => window.id === Number(windowId))));
  }

  readFlashingByIdFromConfigurationByGlobalId(globalId: string, flashingId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === globalId).products),
      map(products => products.flashings.find(flashing => flashing.id === Number(flashingId))));
  }

  readAccessoryByIdFromConfigurationByGlobalId(globalId: string, accessoryId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === globalId).products),
      map(products => products.accessories.find(accessory => accessory.id === Number(accessoryId))));
  }

  readVerticalByIdFromConfigurationByGlobalId(globalId: string, verticalId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === globalId).products),
      map(products => products.verticals.find(vertical => vertical.id === Number(verticalId))));
  }

  readFlatByIdFromConfigurationByGlobalId(globalId: string, flatId: number) {
    return this.http.get(this.baseUri).pipe(
      map((configurations: SingleConfiguration[]) => configurations
        .find(configuration => configuration.globalId === globalId).products),
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
          const flashingConfigs = [];
          for (const flashingConfig of config.products.flashings) {
            if (flashingConfig.flashingFormName === formName) {
              flashingConfigs.push(flashingConfig);
            }
          }
          return flashingConfigs;
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

  createCompany(registerCompany: Company) {
    // TODO przygotować odpowiednią metodę komunikacyjną z eNova
    return this.http.post('urlToEnova', registerCompany);
  }

  createAddress(address: Address) {
    const url = `${this.addressesBaseUri}/add`;
    // return this.getGeoLocation(address.street, address.localNumber, address.zipCode, address.city, address.country)
    //   .pipe(map(geoLocationObject => {
    //   console.log(geoLocationObject);
    //   const localization = {
    //     // @ts-ignore
    //     coordinateA: geoLocationObject.results[0].geometry.location.lat,
    //     // @ts-ignore
    //     coordinateB: geoLocationObject.results[0].geometry.location.lng
    //   };
    const addressToCreate: Address = new Address(address.firstName, address.lastName, address.phoneNumber, address.street,
      address.localNumber, address.zipCode, address.city, address.country);
    return this.http.post(url, addressToCreate).pipe(catchError(err => err));
    // }));
  }

  createUser(user: User) {
    const url = `${this.usersBaseUri}/register`;
    const userToCreate: User = new User('', user.email, user.password, user.rePassword, user.username, user.role, false, user.uuid,
      0, user.companyNip, '', '', user.activationLink, new Date(), new Date());
    return this.http.post(url, userToCreate).pipe(catchError(err => err));
  }

  createCart(cart: Cart) {
    const url = `${this.cartsBaseUri}/create`;
    const cartToCreate = new Cart('', cart.cartItems, cart.timestamp, cart.totalAmount, cart.totalAmountAfterDiscount, cart.currency);
    return this.http.post(url, cartToCreate).pipe(catchError(err => err));
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
    return this.http.post(url, configurationToCreate).pipe(catchError(err => err));
  }

  // 6 dodawanie okna do konfiguracji
  createWindowConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                   windowConfiguration: RoofWindowSkylight,
                                                   formName: string, formData: any, configLink: string) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    const windowConfig: WindowConfig = {
      id: this.hd.getHighestIdForProduct(globalConfiguration).windowId,
      quantity: 1,
      window: Object.assign({}, windowConfiguration),
      windowFormName: formName,
      windowFormData: formData,
      configLink
    };
    globalConfiguration.products.windows.push(windowConfig);
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 7 dodawanie kołnierza do konfiguracji
  createFlashingConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                     flashingConfiguration: Flashing,
                                                     formName: string, formData: any, configLink: string) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    const flashingConfig: FlashingConfig = {
      id: this.hd.getHighestIdForProduct(globalConfiguration).flashingId,
      quantity: 1,
      flashing: Object.assign({}, flashingConfiguration),
      flashingFormName: formName,
      flashingFormData: formData,
      configLink
    };
    globalConfiguration.lastUpdate = new Date();
    globalConfiguration.products.flashings.push(flashingConfig);
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 7a dodawanie tablicy kołnierzy do konfiguracji
  createFlashingsArrayConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                           flashingsConfigurationArray: FlashingConfig[]) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    for (const flashingConfig of flashingsConfigurationArray) {
      flashingConfig.id = this.hd.getHighestIdForProduct(globalConfiguration).flashingId;
      globalConfiguration.products.flashings.push(flashingConfig);
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 8 dodawanie akcesorium do konfiguracji
  createAccessoryConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                      accessoryConfiguration: Accessory,
                                                      formName: string, formData: any, configLink: string) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    const accessoryConfig: AccessoryConfig = {
      id: this.hd.getHighestIdForProduct(globalConfiguration).accessoryId,
      quantity: 1,
      accessory: Object.assign({}, accessoryConfiguration),
      accessoryFormName: formName,
      accessoryFormData: formData,
      configLink
    };
    globalConfiguration.lastUpdate = new Date();
    globalConfiguration.products.accessories.push(accessoryConfig);
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  createVerticalConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                     verticalConfiguration: VerticalWindow,
                                                     formName: string, formData: any, configLink: string) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    const verticalConfig: VerticalConfig = {
      id: this.hd.getHighestIdForProduct(globalConfiguration).verticalId,
      quantity: 1,
      vertical: Object.assign({}, verticalConfiguration),
      verticalFormName: formName,
      verticalFormData: formData,
      configLink
    };
    globalConfiguration.lastUpdate = new Date();
    globalConfiguration.products.verticals.push(verticalConfig);
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  createFlatConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                 flatConfiguration: FlatRoofWindow,
                                                 formName: string, formData: any, configLink: string) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    const flatConfig: FlatConfig = {
      id: this.hd.getHighestIdForProduct(globalConfiguration).flatId,
      quantity: 1,
      flat: Object.assign({}, flatConfiguration),
      flatFormName: formName,
      flatFormData: formData,
      configLink
    };
    globalConfiguration.lastUpdate = new Date();
    globalConfiguration.products.flats.push(flatConfig);
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateAddressByMongoId(address: Address) {
    const url = `${this.addressesBaseUri}/update/${address._id}`;
    this.http.put(url, address, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateUserByMongoId(user: User) {
    const url = `${this.usersBaseUri}/update/${user._id}`;
    return this.http.put(url, user, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateUserAddressByMongoId(user: User, addressData: Address | null, companyData: Company | null) {
    const url = `${this.usersBaseUri}/update/${user._id}`;
    if (addressData) {
      user.mainAddressId = addressData._id;
    }
    if (companyData) {
      user.companyNip = companyData.nip;
      user.discount = companyData.discount;
      user.mainAddressId = companyData.address.id;
    }
    this.http.post(`${this.usersBaseUri}/send-mail`, companyData.email).subscribe(console.log);
    return this.http.put(url, user, {headers: this.headers}).pipe(catchError(err => err));
  }

  setAddressToSendForUser(user: User, addressToSend: Address) {
    const url = `${this.usersBaseUri}/update/${user._id}`;
    if (addressToSend) {
      user.addressToSendId = addressToSend.id;
    }
    this.http.put(url, user, {headers: this.headers}).pipe(catchError(err => err));
  }

  setDiscountForIndividualUser(user: User, discount: number, adminPassword: string | null, code: string | null) {
    const url = `${this.usersBaseUri}/update/${user._id}`;
    if (adminPassword) {
      user.discount = discount;
    }
    // TODO dorobić obsługę listy kodów rabatowych
    // @ts-ignore
    this.discountList.forEach((discountObject: { code: string, value: number }) => {
      if (discountObject.code === code) {
        user.discount = discount;
      }
    });
    this.http.put(url, user, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateCart(cart: Cart) {
    const url = `${this.cartsBaseUri}/update/${cart._id}`;
    return this.http.put(url, cart, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateNameConfigurationByMongoId(mongoId: string, configName: string) {
    const url = `${this.baseUri}/update/${mongoId}`;
    return this.http.put(url, {name: configName, lastUpdate: new Date()}, {headers: this.headers});
  }

  updateWindowQuantity(globalConfiguration: SingleConfiguration, windowId: number, quantity: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.windows) {
      for (const window of globalConfiguration.products.windows) {
        if (window.id === Number(windowId)) {
          window.quantity = Number(quantity);
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateFlashingQuantity(globalConfiguration: SingleConfiguration, flashingId: number, quantity: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flashings) {
      for (const flashing of globalConfiguration.products.flashings) {
        if (flashing.id === Number(flashingId)) {
          flashing.quantity = Number(quantity);
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateAccessoryQuantity(globalConfiguration: SingleConfiguration, accessoryId: number, quantity: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.accessories) {
      for (const accessory of globalConfiguration.products.accessories) {
        if (accessory.id === Number(accessoryId)) {
          accessory.quantity = Number(quantity);
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateVerticalQuantity(globalConfiguration: SingleConfiguration, verticalId: number, quantity: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.verticals) {
      for (const vertical of globalConfiguration.products.verticals) {
        if (vertical.id === Number(verticalId)) {
          vertical.quantity = Number(quantity);
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateFlatQuantity(globalConfiguration: SingleConfiguration, flatId: number, quantity: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flats) {
      for (const flat of globalConfiguration.products.flats) {
        if (flat.id === Number(flatId)) {
          flat.quantity = Number(quantity);
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 10 aktualizowanie okna w konfiguracji
  updateWindowConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                   windowId: number, windowConfiguration: RoofWindowSkylight) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.windows) {
      for (const window of globalConfiguration.products.windows) {
        if (window.id === Number(windowId)) {
          window.window = windowConfiguration;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 11 aktualizowanie kołnierza w konfiguracji
  updateFlashingConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                     flashingId: number, flashingConfiguration: Flashing) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flashings) {
      for (const flashing of globalConfiguration.products.flashings) {
        if (flashing.id === Number(flashingId)) {
          flashing.flashing = flashingConfiguration;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 11a aktualizowanie tablicy kołnierzy kombi w konfiguracji
  // tslint:disable-next-line:max-line-length
  updateFlashingsArrayConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration, flashingConfigurationArray: FlashingConfig[]) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flashings) {
      for (let i = 0; i < globalConfiguration.products.flashings.length; i++) {
        flashingConfigurationArray.forEach(flashingConfig => {
          if (globalConfiguration.products.flashings[i].id === flashingConfig.id) {
            globalConfiguration.products.flashings[i] = flashingConfig;
          }
        });
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 12 aktualizowanie akcesorium w konfiguracji
  updateAccessoryConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                      accessoryId: number, accessoryConfiguration: Accessory) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.accessories) {
      for (const accessory of globalConfiguration.products.accessories) {
        if (accessory.id === Number(accessoryId)) {
          accessory.accessory = accessoryConfiguration;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateVerticalConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                     verticalId: number, verticalConfiguration: VerticalWindow) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.verticals) {
      for (const vertical of globalConfiguration.products.verticals) {
        if (vertical.id === Number(verticalId)) {
          vertical.vertical = verticalConfiguration;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateFlatConfigurationIntoGlobalConfiguration(globalConfiguration: SingleConfiguration,
                                                 flatId: number, flatConfiguration: FlatRoofWindow) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flats) {
      for (const flat of globalConfiguration.products.flats) {
        if (flat.id === Number(flatId)) {
          flat.flat = flatConfiguration;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateWindowFormDataByFormName(globalConfiguration: SingleConfiguration, windowFormName: string, windowFormData: {}) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.windows) {
      for (const window of globalConfiguration.products.windows) {
        if (window.windowFormName === windowFormName) {
          window.windowFormData = windowFormData;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateFlashingFormDataByFormName(globalConfiguration: SingleConfiguration, flashingFormName: string, flashingFormData: {}) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flashings) {
      for (const flashing of globalConfiguration.products.flashings) {
        if (flashing.flashingFormName === flashingFormName) {
          flashing.flashingFormData = flashingFormData;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateAccessoryFormDataByFormName(globalConfiguration: SingleConfiguration, accessoryFormName: string, accessoryFormData: {}) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.accessories) {
      for (const accessory of globalConfiguration.products.accessories) {
        if (accessory.accessoryFormName === accessoryFormName) {
          accessory.accessoryFormData = accessoryFormData;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateVerticalFormDataByFormName(globalConfiguration: SingleConfiguration, verticalFormName: string, verticalFormData: {}) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.verticals) {
      for (const vertical of globalConfiguration.products.verticals) {
        if (vertical.verticalFormName === verticalFormName) {
          vertical.verticalFormData = verticalFormData;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  updateFlatFormDataByFormName(globalConfiguration: SingleConfiguration, flatFormName: string, flatFormData: {}) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flats) {
      for (const flat of globalConfiguration.products.flats) {
        if (flat.flatFormName === flatFormName) {
          flat.flatFormData = flatFormData;
        }
      }
    }
    globalConfiguration.lastUpdate = new Date();
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  deleteAddress(address: Address) {
    const url = `${this.addressesBaseUri}/delete/${address._id}`;
    return this.http.delete(url, {headers: this.headers}).pipe(catchError(err => err));
  }

  deleteUser(user: User) {
    const url = `${this.usersBaseUri}/delete/${user._id}`;
    user.activated = false;
    return this.http.put(url, user, {headers: this.headers}).pipe(catchError(err => err));
  }

  deleteCart(cart: Cart) {
    const url = `${this.cartsBaseUri}/delete/${cart._id}`;
    cart = null;
    return this.http.put(url, cart, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 1 usuwanie całej konfiguracji
  deleteConfiguration(globalConfiguration: SingleConfiguration) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    globalConfiguration.lastUpdate = new Date();
    globalConfiguration.active = false;
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 2 usuwanie okna z konfiguracji
  deleteWindowConfigurationFromConfigurationById(globalConfiguration: SingleConfiguration, windowId: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.windows) {
      for (const window of globalConfiguration.products.windows) {
        if (window.id === Number(windowId)) {
          const index = globalConfiguration.products.windows.indexOf(window);
          if (index > -1) {
            globalConfiguration.products.windows.splice(index);
          }
        }
      }
    }
    globalConfiguration.active = false;
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 3 usuwanie kołnierza z konfiguracji
  deleteFlashingConfigurationFromConfigurationById(globalConfiguration: SingleConfiguration, flashingId: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flashings) {
      for (const flashing of globalConfiguration.products.flashings) {
        if (flashing.id === Number(flashingId)) {
          const index = globalConfiguration.products.flashings.indexOf(flashing);
          if (index > -1) {
            globalConfiguration.products.flashings.splice(index);
          }
        }
      }
    }
    globalConfiguration.active = false;
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  // 4 usuwanie acesorium z konfiguracji
  deleteAccessoryConfigurationFromConfigurationById(globalConfiguration: SingleConfiguration, accessoryId: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.accessories) {
      for (const accessory of globalConfiguration.products.accessories) {
        if (accessory.id === Number(accessoryId)) {
          const index = globalConfiguration.products.accessories.indexOf(accessory);
          if (index > -1) {
            globalConfiguration.products.accessories.splice(index);
          }
        }
      }
    }
    globalConfiguration.active = false;
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  deleteVerticalConfigurationFromConfigurationById(globalConfiguration: SingleConfiguration, verticalId: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.verticals) {
      for (const vertical of globalConfiguration.products.verticals) {
        if (vertical.id === Number(verticalId)) {
          const index = globalConfiguration.products.verticals.indexOf(vertical);
          if (index > -1) {
            globalConfiguration.products.verticals.splice(index);
          }
        }
      }
    }
    globalConfiguration.active = false;
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }

  deleteFlatConfigurationFromConfigurationById(globalConfiguration: SingleConfiguration, flatId: number) {
    const url = this.urlToUpdateSetter(globalConfiguration);
    if (globalConfiguration.products.flats) {
      for (const flat of globalConfiguration.products.flats) {
        if (flat.id === Number(flatId)) {
          const index = globalConfiguration.products.flats.indexOf(flat);
          if (index > -1) {
            globalConfiguration.products.flats.splice(index);
          }
        }
      }
    }
    globalConfiguration.active = false;
    return this.http.put(url, globalConfiguration, {headers: this.headers}).pipe(catchError(err => err));
  }
}

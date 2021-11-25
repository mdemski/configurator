import {SingleConfiguration} from '../../models/single-configuration';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CrudService} from '../../services/crud-service';
import {
  AddAccessoryConfiguration,
  AddFlashingConfiguration,
  AddFlashingConfigurations,
  AddFlatRoofConfiguration,
  AddGlobalConfiguration,
  AddRoofWindowConfiguration,
  AddVerticalWindowConfiguration,
  DeleteAccessoryConfigurationByConfigAndAccessoryId,
  DeleteFlashingConfigurationByConfigAndFlashingId,
  DeleteFlatRoofConfigurationByConfigAndFlatId,
  DeleteGlobalConfiguration,
  DeleteRoofWindowConfigurationByConfigAndWindowId, DeleteVerticalWindowConfigurationByConfigAndWindowId,
  GetConfigurations,
  UpdateAccessoryConfiguration,
  UpdateAccessoryFormByFormName,
  UpdateAccessoryQuantityByConfigAndAccessoryId,
  UpdateFlashingConfiguration,
  UpdateFlashingConfigurations,
  UpdateFlashingFormByFormName,
  UpdateFlashingQuantityByConfigAndFlashingId,
  UpdateFlatRoofConfiguration,
  UpdateFlatRoofFormByFormName,
  UpdateFlatRoofQuantityByConfigAndFlatId,
  UpdateGlobalConfigurationNameByConfigId,
  UpdateRoofWindowConfiguration,
  UpdateRoofWindowFormByFormName,
  UpdateRoofWindowQuantityByConfigAndWindowId,
  UpdateVerticalWindowConfiguration,
  UpdateVerticalWindowFormByFormName,
  UpdateVerticalWindowQuantityByConfigAndWindowId
} from './configuration.actions';
import {tap} from 'rxjs/operators';
import {WindowConfig} from '../../models/window-config';
import {FlashingConfig} from '../../models/flashing-config';
import {AccessoryConfig} from '../../models/accessory-config';
import {FlatConfig} from '../../models/flat-config';
import {VerticalConfig} from '../../models/vertical-config';
import cloneDeep from 'lodash/cloneDeep';

export interface ConfigurationStateModel {
  // w razie problemów z wydajnością zmienić wczytywanie tylko na konfiguracje user'a a pełną listę brać wyłącznie do nadawania numerów
  configurations: SingleConfiguration[];
  // roofWindowConfigurations: WindowConfig[];
  // flashingConfigurations: FlashingConfig[];
  // accessoryConfigurations: AccessoryConfig[];
  // flatRoofConfigurations: FlatConfig[];
  // verticalWindowConfigurations: VerticalConfig[];
}

// tslint:disable-next-line:max-line-length
// TODO czy nadpisywać dane dotyczące jednej konfiguracji z różnych typów zapytań - by id, by name, czy utworzyć nowe instancje tego obiektu?
// TODO czy wczytywać konfiguracje wszystkie i oprócz tego dla klienta, czy tylko dla Klienta?
@State<ConfigurationStateModel>({
  name: 'configuration',
  defaults: {
    configurations: [],
    // roofWindowConfigurations: [],
    // flashingConfigurations: [],
    // accessoryConfigurations: [],
    // flatRoofConfigurations: [],
    // verticalWindowConfigurations: []
  }
})
export class ConfigurationState {
  constructor(private crud: CrudService) {
  }

  // Global configurations selectors
  @Selector()
  static configurations(state: ConfigurationStateModel) {
    return state.configurations;
  }

  @Selector()
  static userConfigurations(state: ConfigurationStateModel) {
    return (user: string) => {
      return state.configurations.filter(configuration => configuration.user === user && configuration.active === true);
    };
  }

  @Selector()
  static configurationByMongoID(state: ConfigurationStateModel) {
    return (mongoId) => {
      return state.configurations.find(configuration => configuration._id === mongoId && configuration.active === true);
    };
  }

  @Selector()
  static configurationByGlobalID(state: ConfigurationStateModel) {
    return (globalId: string) => {
      return state.configurations.find(configuration => configuration.globalId === globalId && configuration.active === true);
    };
  }

  @Selector()
  static configurationByName(state: ConfigurationStateModel) {
    return (configName: string) => {
      return state.configurations.find(configuration => configuration.name === configName && configuration.active === true);
    };
  }

  @Selector()
  static configurationByWindowFormName(state: SingleConfiguration[]) {
    return (formName: string) => {
      let chosenWindowConfig: WindowConfig = null;
      // @ts-ignore
      state.configurations.forEach(configuration => {
        if (configuration.products.windows) {
          configuration.products.windows.filter(windowConfig => {
            if (windowConfig.windowFormName === formName) {
              chosenWindowConfig = windowConfig;
            }
          });
        }
      });
      return chosenWindowConfig;
    };
  }

  @Selector()
  static configurationByFlashingFormName(state: SingleConfiguration[]) {
    return (formName: string) => {
      const productConfigs: FlashingConfig[] = [];
      // @ts-ignore
      state.configurations.forEach(configuration => {
        if (configuration.products.flashings) {
          configuration.products.flashings.filter(flashingConfig => {
            if (flashingConfig.flashingFormName === formName) {
              productConfigs.push(flashingConfig);
            }
          });
        }
      });
      return productConfigs;
    };
  }

  @Selector()
  static configurationByAccessoryFormName(state: SingleConfiguration[]) {
    return (formName: string) => {
      let chosenAccessoryConfig: AccessoryConfig = null;
      // @ts-ignore
      state.configurations.forEach(configuration => {
        if (configuration.products.accessories) {
          configuration.products.accessories.filter(accessoryConfig => {
            if (accessoryConfig.accessoryFormName === formName) {
              chosenAccessoryConfig = accessoryConfig;
            }
          });
        }
      });
      return chosenAccessoryConfig;
    };
  }

  @Selector()
  static configurationByFlatRoofFormName(state: SingleConfiguration[]) {
    return (formName: string) => {
      let chosenFlatRoofConfig: FlatConfig = null;
      // @ts-ignore
      state.configurations.forEach(configuration => {
        if (configuration.products.flats) {
          configuration.products.flats.filter(flatConfig => {
            if (flatConfig.flatFormName === formName) {
              chosenFlatRoofConfig = flatConfig;
            }
          });
        }
      });
      return chosenFlatRoofConfig;
    };
  }

  @Selector()
  static configurationByVerticalWindowFormName(state: SingleConfiguration[]) {
    return (formName: string) => {
      let chosenVerticalWindowConfig: VerticalConfig = null;
      // @ts-ignore
      state.configurations.forEach(configuration => {
        if (configuration.products.verticals) {
          configuration.products.verticals.filter(verticalConfig => {
            if (verticalConfig.verticalFormName === formName) {
              chosenVerticalWindowConfig = verticalConfig;
            }
          });
        }
      });
      return chosenVerticalWindowConfig;
    };
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Roof window configurations selectors
  @Selector()
  static roofWindowConfigurationsByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string) => {
      return state.configurations[globalId].products.windows;
    };
  }

  @Selector()
  static roofWindowConfigurationByIdByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string, windowId: number) => {
      return state.configurations[globalId].products.windows[windowId];
    };
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Flashing configurations selectors
  @Selector()
  static flashingConfigurationsByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string) => {
      return state.configurations[globalId].products.flashings;
    };
  }

  @Selector()
  static flashingConfigurationByIdByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string, flashingId: number) => {
      return state.configurations[globalId].products.flashings[flashingId];
    };
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Accessory configurations selectors
  @Selector()
  static accessoryConfigurationsByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string) => {
      return state.configurations[globalId].products.accessories;
    };
  }

  @Selector()
  static accessoryConfigurationByIdByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string, accessoryId: number) => {
      return state.configurations[globalId].products.accessories[accessoryId];
    };
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Flat roof window configurations selectors
  @Selector()
  static flatRoofConfigurationsByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string) => {
      return state.configurations[globalId].products.flats;
    };
  }

  @Selector()
  static flatRoofConfigurationByIdByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string, flatId: number) => {
      return state.configurations[globalId].products.flats[flatId];
    };
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Vertical roof window configurations selectors
  @Selector()
  static verticalWindowConfigurationsByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string) => {
      return state.configurations[globalId].products.flats;
    };
  }

  @Selector()
  static verticalWindowConfigurationByIdByGlobalId(state: ConfigurationStateModel) {
    return (globalId: string, verticalId: number) => {
      return state.configurations[globalId].products.verticals[verticalId];
    };
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Global configurations Actions
  @Action(GetConfigurations)
  getAllConfigurations(ctx: StateContext<ConfigurationStateModel>) {
    return this.crud.readAllConfigurationsFromMongoDB().pipe(
      tap((result: SingleConfiguration[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          configurations: result
        });
      }));
  }

  @Action(AddGlobalConfiguration)
  addGlobalConfiguration(ctx: StateContext<ConfigurationStateModel>, {user, payload}: AddGlobalConfiguration) {
    return this.crud.createConfigurationForUser(user, payload).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        ctx.patchState({
          configurations: [...state.configurations, result]
        });
      }));
  }

  @Action(UpdateGlobalConfigurationNameByConfigId)
  updateGlobalConfiguration(ctx: StateContext<ConfigurationStateModel>, {mongoId, configName}: UpdateGlobalConfigurationNameByConfigId) {
    return this.crud.updateNameConfigurationByMongoId(mongoId, configName).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === mongoId);
        configList[configIndex] = result;
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(DeleteGlobalConfiguration)
  deleteGlobalConfiguration(ctx: StateContext<ConfigurationStateModel>, {payload}: DeleteGlobalConfiguration) {
    return this.crud.deleteConfiguration(payload).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === payload._id);
        configList[configIndex] = result;
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Roof window configurations Actions
  @Action(AddRoofWindowConfiguration)
  addNewRoofWindowConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                {globalConfiguration, payload, formName, formData, configLink}: AddRoofWindowConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.createWindowConfigurationIntoGlobalConfiguration(configuration, payload, formName, formData, configLink).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          configurations: [...state.configurations, result]
        });
      }));
  }

  @Action(UpdateRoofWindowConfiguration)
  updateRoofWindowConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                {globalConfiguration, windowId, payload}: UpdateRoofWindowConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateWindowConfigurationIntoGlobalConfiguration(configuration, windowId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.windows.map(window => ({
          ...window,
          window: window.id === windowId ? payload : window
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateRoofWindowQuantityByConfigAndWindowId)
  updateRoofWindowQuantityConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                        {globalConfiguration, windowId, payload}: UpdateRoofWindowQuantityByConfigAndWindowId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateWindowQuantity(configuration, windowId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.windows.map(window => ({
          ...window,
          quantity: window.id === windowId ? payload : window.quantity
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateRoofWindowFormByFormName)
  updateRoofWindowFormByFromName(ctx: StateContext<ConfigurationStateModel>,
                                 {globalConfiguration, windowFormName, payload}: UpdateRoofWindowFormByFormName) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateWindowFormDataByFormName(configuration, windowFormName, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.windows.map(window => ({
          ...window,
          windowFormData: window.windowFormName === windowFormName ? payload : window.windowFormData
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(DeleteRoofWindowConfigurationByConfigAndWindowId)
  deleteRoofWindowConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                {globalConfiguration, windowId}: DeleteRoofWindowConfigurationByConfigAndWindowId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.deleteWindowConfigurationFromConfigurationById(configuration, windowId).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        const productList = configList[configIndex].products;
        configList[configIndex].products.windows.map(() => ({
          ...productList,
          windows: productList.windows.filter(window => window.id !== windowId)
        }));
        // TODO sprawdzić czy ten zapis zadziała poprawnie???
        // configList[configIndex].products.windows = configList[configIndex].products.windows.filter(window => window.id !== windowId);
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Flashing configurations Actions
  @Action(AddFlashingConfiguration)
  addNewFlashingConfiguration(ctx: StateContext<ConfigurationStateModel>,
                              {globalConfiguration, payload, formName, formData, configLink}: AddFlashingConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.createFlashingConfigurationIntoGlobalConfiguration(configuration, payload, formName, formData, configLink).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          configurations: [...state.configurations, result]
        });
      }));
  }

  @Action(AddFlashingConfigurations)
  addNewFlashingConfigurations(ctx: StateContext<ConfigurationStateModel>,
                               {globalConfiguration, payload}: AddFlashingConfigurations) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.createFlashingsArrayConfigurationIntoGlobalConfiguration(configuration, payload).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          configurations: [...state.configurations, result]
        });
      }));
  }

  @Action(UpdateFlashingConfiguration)
  updateFlashingConfiguration(ctx: StateContext<ConfigurationStateModel>,
                              {globalConfiguration, flashingId, payload}: UpdateFlashingConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateFlashingConfigurationIntoGlobalConfiguration(configuration, flashingId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.flashings.map(flashing => ({
          ...flashing,
          flashing: flashing.id === flashingId ? payload : flashing
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateFlashingConfigurations)
  updateFlashingConfigurations(ctx: StateContext<ConfigurationStateModel>,
                               {globalConfiguration, payload}: UpdateFlashingConfigurations) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateFlashingsArrayConfigurationIntoGlobalConfiguration(configuration, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        // TODO sprawdzić czy ten zapis zadziała poprawnie???
        const flashingConfigs = configList[configIndex].products.flashings;
        configList[configIndex].products.flashings.map(() => ({
          ...flashingConfigs,
          flashings: payload
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateFlashingQuantityByConfigAndFlashingId)
  updateFlashingQuantityConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                      {globalConfiguration, flashingId, payload}: UpdateFlashingQuantityByConfigAndFlashingId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateFlashingQuantity(configuration, flashingId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.flashings.map(flashing => ({
          ...flashing,
          quantity: flashing.id === flashingId ? payload : flashing.quantity
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateFlashingFormByFormName)
  updateFlashingFormByFromName(ctx: StateContext<ConfigurationStateModel>,
                               {globalConfiguration, flashingFormName, payload}: UpdateFlashingFormByFormName) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateFlashingFormDataByFormName(configuration, flashingFormName, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.flashings.map(flashing => ({
          ...flashing,
          flashingFormData: flashing.flashingFormName === flashingFormName ? payload : flashing.flashingFormData
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(DeleteFlashingConfigurationByConfigAndFlashingId)
  deleteFlashingConfiguration(ctx: StateContext<ConfigurationStateModel>,
                              {globalConfiguration, flashingId}: DeleteFlashingConfigurationByConfigAndFlashingId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.deleteFlashingConfigurationFromConfigurationById(configuration, flashingId).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        const productList = configList[configIndex].products;
        configList[configIndex].products.flashings.map(() => ({
          ...productList,
          flashings: productList.flashings.filter(flashing => flashing.id !== flashingId)
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Accessory configurations Actions
  @Action(AddAccessoryConfiguration)
  addNewAccessoryConfiguration(ctx: StateContext<ConfigurationStateModel>,
                               {globalConfiguration, payload, formName, formData, configLink}: AddAccessoryConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.createAccessoryConfigurationIntoGlobalConfiguration(configuration, payload, formName, formData, configLink).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          configurations: [...state.configurations, result]
        });
      }));
  }

  @Action(UpdateAccessoryConfiguration)
  updateAccessoryConfiguration(ctx: StateContext<ConfigurationStateModel>,
                               {globalConfiguration, accessoryId, payload}: UpdateAccessoryConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateAccessoryConfigurationIntoGlobalConfiguration(configuration, accessoryId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.accessories.map(accessory => ({
          ...accessory,
          accessory: accessory.id === accessoryId ? payload : accessory
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateAccessoryQuantityByConfigAndAccessoryId)
  updateAccessoryQuantityConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                       {globalConfiguration, accessoryId, payload}: UpdateAccessoryQuantityByConfigAndAccessoryId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateAccessoryQuantity(configuration, accessoryId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.accessories.map(accessory => ({
          ...accessory,
          quantity: accessory.id === accessoryId ? payload : accessory.quantity
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateAccessoryFormByFormName)
  updateAccessoryFormByFromName(ctx: StateContext<ConfigurationStateModel>,
                                {globalConfiguration, accessoryFormName, payload}: UpdateAccessoryFormByFormName) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateAccessoryFormDataByFormName(configuration, accessoryFormName, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.accessories.map(accessory => ({
          ...accessory,
          accessoryFormData: accessory.accessoryFormName === accessoryFormName ? payload : accessory.accessoryFormData
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(DeleteAccessoryConfigurationByConfigAndAccessoryId)
  deleteAccessoryConfiguration(ctx: StateContext<ConfigurationStateModel>,
                               {globalConfiguration, accessoryId}: DeleteAccessoryConfigurationByConfigAndAccessoryId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.deleteAccessoryConfigurationFromConfigurationById(configuration, accessoryId).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        const productList = configList[configIndex].products;
        configList[configIndex].products.accessories.map(() => ({
          ...productList,
          accessories: productList.accessories.filter(accessory => accessory.id !== accessoryId)
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Flat roof window configurations Actions
  @Action(AddFlatRoofConfiguration)
  addNewFlatRoofConfiguration(ctx: StateContext<ConfigurationStateModel>,
                              {globalConfiguration, payload, formName, formData, configLink}: AddFlatRoofConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.createFlatConfigurationIntoGlobalConfiguration(configuration, payload, formName, formData, configLink).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          configurations: [...state.configurations, result]
        });
      }));
  }

  @Action(UpdateFlatRoofConfiguration)
  updateFlatRoofConfiguration(ctx: StateContext<ConfigurationStateModel>,
                              {globalConfiguration, flatId, payload}: UpdateFlatRoofConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateFlatConfigurationIntoGlobalConfiguration(configuration, flatId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.flats.map(flat => ({
          ...flat,
          flat: flat.id === flatId ? payload : flat
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateFlatRoofQuantityByConfigAndFlatId)
  updateFlatRoofQuantityConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                      {globalConfiguration, flatId, payload}: UpdateFlatRoofQuantityByConfigAndFlatId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateFlatQuantity(configuration, flatId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.flats.map(flat => ({
          ...flat,
          quantity: flat.id === flatId ? payload : flat.quantity
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateFlatRoofFormByFormName)
  updateFlatRoofFormByFromName(ctx: StateContext<ConfigurationStateModel>,
                               {globalConfiguration, flatFormName, payload}: UpdateFlatRoofFormByFormName) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateFlatFormDataByFormName(configuration, flatFormName, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.flats.map(flat => ({
          ...flat,
          flatFormData: flat.flatFormName === flatFormName ? payload : flat.flatFormData
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(DeleteFlatRoofConfigurationByConfigAndFlatId)
  deleteFlatRoofConfiguration(ctx: StateContext<ConfigurationStateModel>,
                              {globalConfiguration, flatId}: DeleteFlatRoofConfigurationByConfigAndFlatId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.deleteFlatConfigurationFromConfigurationById(configuration, flatId).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        const productList = configList[configIndex].products;
        configList[configIndex].products.flats.map(() => ({
          ...productList,
          flats: productList.flats.filter(flat => flat.id !== flatId)
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Vertical window configurations Actions
  @Action(AddVerticalWindowConfiguration)
  addNewVerticalWindowConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                    {globalConfiguration, payload, formName, formData, configLink}: AddVerticalWindowConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.createVerticalConfigurationIntoGlobalConfiguration(configuration, payload, formName, formData, configLink).pipe(
      tap((result: SingleConfiguration) => {
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          configurations: [...state.configurations, result]
        });
      }));
  }

  @Action(UpdateVerticalWindowConfiguration)
  updateVerticalWindowConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                    {globalConfiguration, verticalId, payload}: UpdateVerticalWindowConfiguration) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateVerticalConfigurationIntoGlobalConfiguration(configuration, verticalId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.verticals.map(vertical => ({
          ...vertical,
          vertical: vertical.id === verticalId ? payload : vertical
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateVerticalWindowQuantityByConfigAndWindowId)
  updateVerticalWindowQuantityConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                            {globalConfiguration, verticalId, payload}: UpdateVerticalWindowQuantityByConfigAndWindowId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateVerticalQuantity(configuration, verticalId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.verticals.map(vertical => ({
          ...vertical,
          quantity: vertical.id === verticalId ? payload : vertical.quantity
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(UpdateVerticalWindowFormByFormName)
  updateVerticalWindowFormByFromName(ctx: StateContext<ConfigurationStateModel>,
                                     {globalConfiguration, verticalFormName, payload}: UpdateVerticalWindowFormByFormName) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.updateVerticalFormDataByFormName(configuration, verticalFormName, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        configList[configIndex].products.verticals.map(vertical => ({
          ...vertical,
          verticalFormData: vertical.verticalFormName === verticalFormName ? payload : vertical.verticalFormData
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  @Action(DeleteVerticalWindowConfigurationByConfigAndWindowId)
  deleteVerticalWindowConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                    {globalConfiguration, verticalId}: DeleteVerticalWindowConfigurationByConfigAndWindowId) {
    const configuration = cloneDeep(globalConfiguration);
    return this.crud.deleteVerticalConfigurationFromConfigurationById(configuration, verticalId).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.configurations];
        const configIndex = configList.findIndex(item => item._id === configuration._id);
        const productList = configList[configIndex].products;
        configList[configIndex].products.verticals.map(() => ({
          ...productList,
          verticals: productList.verticals.filter(vertical => vertical.id !== verticalId)
        }));
        ctx.setState({
          ...state,
          configurations: configList
        });
      }));
  }

  // ---------------------------------------------------------------------------------------------------------- //
}

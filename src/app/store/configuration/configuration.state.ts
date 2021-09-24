import {SingleConfiguration} from '../../models/single-configuration';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CrudService} from '../../services/crud-service';
import {
  AddGlobalConfiguration,
  AddRoofWindowConfiguration,
  DeleteGlobalConfiguration, DeleteRoofWindowConfigurationByConfigAndWindowId,
  GetConfigurations,
  UpdateGlobalConfigurationNameByConfigId,
  UpdateRoofWindowConfiguration,
  UpdateRoofWindowFormByFormName,
  UpdateRoofWindowQuantityByConfigAndWindowId
} from './configuration.actions';
import {tap} from 'rxjs/operators';
import {WindowConfig} from '../../models/window-config';
import {FlashingConfig} from '../../models/flashing-config';
import {AccessoryConfig} from '../../models/accessory-config';
import {FlatConfig} from '../../models/flat-config';
import {VerticalConfig} from '../../models/vertical-config';
import {config} from 'rxjs';

export interface ConfigurationStateModel {
  configurations: SingleConfiguration[];
  roofWindowConfigurations: WindowConfig[];
  flashingConfigurations: FlashingConfig[];
  accessoryConfigurations: AccessoryConfig[];
  flatRoofConfigurations: FlatConfig[];
  verticalWindowConfigurations: VerticalConfig[];
}

// tslint:disable-next-line:max-line-length
// TODO czy nadpisywać dane dotyczące jednej konfiguracji z różnych typów zapytań - by id, by name, czy utworzyć nowe instancje tego obiektu?
// TODO czy wczytywać konfiguracje wszystkie i oprócz tego dla klienta, czy tylko dla Klienta?
@State<ConfigurationStateModel>({
  name: 'configuration',
  defaults: {
    configurations: [],
    roofWindowConfigurations: [],
    flashingConfigurations: [],
    accessoryConfigurations: [],
    flatRoofConfigurations: [],
    verticalWindowConfigurations: []
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
  static userConfigurations(state: SingleConfiguration[], user) {
    return state.filter(configuration => configuration.user === user);
  }

  @Selector()
  static configurationByMongoID(state: SingleConfiguration[], mongoId) {
    return state.find(configuration => configuration._id === mongoId);
  }

  @Selector()
  static configurationByGlobalID(state: SingleConfiguration[], globalId) {
    return state.find(configuration => configuration.globalId === globalId);
  }

  @Selector()
  static configurationByName(state: SingleConfiguration[], configName: string) {
    return state.find(configuration => configuration.name === configName);
  }

  @Selector()
  static configurationByFormName(state: SingleConfiguration[], formName) {
    return state.forEach(configuration => {
      configuration.products.windows.forEach(windowConfig => {
        if (windowConfig.windowFormName === formName) {
          return configuration;
        }
      });
      configuration.products.flashings.forEach(flashingConfig => {
        if (flashingConfig.flashingFormName === formName) {
          return configuration;
        }
      });
      configuration.products.accessories.forEach(accessoryConfig => {
        if (accessoryConfig.accessoryFormName === formName) {
          return configuration;
        }
      });
      configuration.products.flats.forEach(flatConfig => {
        if (flatConfig.flatFormName === formName) {
          return configuration;
        }
      });
      configuration.products.verticals.forEach(verticalConfig => {
        if (verticalConfig.verticalFormName === formName) {
          return configuration;
        }
      });
    });
  }

  // ---------------------------------------------------------------------------------------------------------- //

  // Roof window configurations selectors
  @Selector()
  static roofWindowConfigurationsByGlobalId(state: ConfigurationStateModel, globalId: string) {
    state.roofWindowConfigurations = state.configurations.find(configuration => configuration.globalId === globalId).products.windows;
    return state.roofWindowConfigurations;
  }

  @Selector()
  static roofWindowConfigurationByIdByGlobalId(state: ConfigurationStateModel, windowId: number) {
    return state.roofWindowConfigurations.find(windowConfig => windowConfig.id === windowId);
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
    return this.crud.createWindowConfigurationIntoGlobalConfiguration(globalConfiguration, payload, formName, formData, configLink).pipe(
      tap((result: WindowConfig) => {
        const state = ctx.getState();
        ctx.patchState({
          roofWindowConfigurations: [...state.roofWindowConfigurations, result]
        });
      }));
  }

  @Action(UpdateRoofWindowConfiguration)
  updateRoofWindowConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                {globalConfiguration, windowId, payload}: UpdateRoofWindowConfiguration) {
    return this.crud.updateWindowConfigurationIntoGlobalConfiguration(globalConfiguration, windowId, payload).pipe(
      tap((result: WindowConfig) => {
        const state = ctx.getState();
        const configList = [...state.roofWindowConfigurations];
        const configIndex = configList.findIndex(item => item.id === windowId);
        configList[configIndex] = result;
        ctx.setState({
          ...state,
          roofWindowConfigurations: configList
        });
      }));
  }

  @Action(UpdateRoofWindowQuantityByConfigAndWindowId)
  updateRoofWindowQuantityConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                        {globalConfiguration, windowId, payload}: UpdateRoofWindowQuantityByConfigAndWindowId) {
    return this.crud.updateWindowQuantity(globalConfiguration, windowId, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.roofWindowConfigurations];
        const configIndex = configList.findIndex(item => item.id === windowId);
        configList[configIndex].quantity = payload;
        ctx.setState({
          ...state,
          roofWindowConfigurations: configList
        });
      }));
  }

  @Action(UpdateRoofWindowFormByFormName)
  updateRoofWindowFormByFromName(ctx: StateContext<ConfigurationStateModel>,
                                 {globalConfiguration, windowFormName, payload}: UpdateRoofWindowFormByFormName) {
    return this.crud.updateWindowFormDataByFormName(globalConfiguration, windowFormName, payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const configList = [...state.roofWindowConfigurations];
        const configIndex = configList.findIndex(item => item.windowFormName === windowFormName);
        configList[configIndex].windowFormData = payload;
        ctx.setState({
          ...state,
          roofWindowConfigurations: configList
        });
      }));
  }

  @Action(DeleteRoofWindowConfigurationByConfigAndWindowId)
  deleteRoofWindowConfiguration(ctx: StateContext<ConfigurationStateModel>,
                                {globalConfiguration, windowId}: DeleteRoofWindowConfigurationByConfigAndWindowId) {
    return this.crud.deleteWindowConfigurationFromConfigurationById(globalConfiguration, windowId).pipe(
      tap(() => {
        const state = ctx.getState();
        const filteredArray = state.roofWindowConfigurations.filter(window => window.id !== windowId);
        ctx.setState({
          ...state,
          roofWindowConfigurations: filteredArray
        });
      }));
  }
}

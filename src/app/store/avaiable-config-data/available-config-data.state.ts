import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {ConfigurationDataService} from '../../services/configuration-data.service';
import {
  GetAvailableGlazingsData,
  GetExclusionsForFlashings,
  GetExclusionsForRoofWindows,
  GetFlashingsAvailableConfigData,
  GetRoofWindowsAvailableConfigData
} from './available-config-data.actions';
import {tap} from 'rxjs/operators';
import {GlazingType} from '../../models/glazing-type';

export interface AvailableConfigDataStateModel {
  configRoofWindows: {};
  roofWindowConfigLoaded: boolean;
  configFlashings: {};
  flashingConfigLoaded: boolean;
  configAccessories: {};
  accessoryConfigLoaded: boolean;
  configFlatRoofWindows: {};
  flatWindowConfigLoaded: boolean;
  configVerticalWindows: {};
  verticalWindowConfigLoaded: boolean;
  roofWindowsExclusions: any[];
  roofWindowExclusionsLoaded: boolean;
  flashingsExclusions: any[];
  flashingExclusionsLoaded: boolean;
  accessoriesExclusions: any[];
  accessoryExclusionsLoaded: boolean;
  flatRoofWindowsExclusions: any[];
  flatWindowExclusionsLoaded: boolean;
  verticalWindowsExclusions: any[];
  verticalWindowExclusionsLoaded: boolean;
  glazingOptions: GlazingType[];
  glazingOptionsLoaded: boolean;
}

@State<AvailableConfigDataStateModel>({
  name: 'availableConfigData',
  defaults: {
    configRoofWindows: null,
    roofWindowConfigLoaded: false,
    configFlashings: null,
    flashingConfigLoaded: false,
    configAccessories: null,
    accessoryConfigLoaded: false,
    configFlatRoofWindows: null,
    flatWindowConfigLoaded: false,
    configVerticalWindows: null,
    verticalWindowConfigLoaded: false,
    roofWindowsExclusions: [],
    roofWindowExclusionsLoaded: false,
    flashingsExclusions: [],
    flashingExclusionsLoaded: false,
    accessoriesExclusions: [],
    accessoryExclusionsLoaded: false,
    flatRoofWindowsExclusions: [],
    flatWindowExclusionsLoaded: false,
    verticalWindowsExclusions: [],
    verticalWindowExclusionsLoaded: false,
    glazingOptions: [],
    glazingOptionsLoaded: false
  }
})
export class AvailableConfigDataState {
  constructor(private configData: ConfigurationDataService) {
  }

  @Selector()
  static configRoofWindows(state: AvailableConfigDataStateModel) {
    return state.configRoofWindows;
  }

  @Selector()
  static roofWindowsConfigLoaded(state: AvailableConfigDataStateModel) {
    return state.roofWindowConfigLoaded;
  }

  @Selector()
  static roofWindowsExclusions(state: AvailableConfigDataStateModel) {
    return state.roofWindowsExclusions;
  }

  @Selector()
  static roofWindowsExclusionsLoaded(state: AvailableConfigDataStateModel) {
    return state.roofWindowExclusionsLoaded;
  }

  @Selector()
  static configFlashings(state: AvailableConfigDataStateModel) {
    return state.configFlashings;
  }

  @Selector()
  static flashingsConfigLoaded(state: AvailableConfigDataStateModel) {
    return state.flashingConfigLoaded;
  }

  @Selector()
  static flashingsExclusions(state: AvailableConfigDataStateModel) {
    return state.flashingsExclusions;
  }

  @Selector()
  static flashingsExclusionsLoaded(state: AvailableConfigDataStateModel) {
    return state.flashingExclusionsLoaded;
  }

  @Selector()
  static configAccessories(state: AvailableConfigDataStateModel) {
    return state.configAccessories;
  }

  @Selector()
  static accessoriesConfigLoaded(state: AvailableConfigDataStateModel) {
    return state.accessoryConfigLoaded;
  }

  @Selector()
  static accessoriesExclusions(state: AvailableConfigDataStateModel) {
    return state.accessoriesExclusions;
  }

  @Selector()
  static accessoriesExclusionsLoaded(state: AvailableConfigDataStateModel) {
    return state.accessoryExclusionsLoaded;
  }

  @Selector()
  static configFlatRoofWindows(state: AvailableConfigDataStateModel) {
    return state.configFlatRoofWindows;
  }

  @Selector()
  static flatRoofWindowsConfigLoaded(state: AvailableConfigDataStateModel) {
    return state.flatWindowConfigLoaded;
  }

  @Selector()
  static flatRoofWindowsExclusions(state: AvailableConfigDataStateModel) {
    return state.flatRoofWindowsExclusions;
  }

  @Selector()
  static flatRoofWindowsExclusionsLoaded(state: AvailableConfigDataStateModel) {
    return state.flatWindowExclusionsLoaded;
  }

  @Selector()
  static configVerticalWindows(state: AvailableConfigDataStateModel) {
    return state.configVerticalWindows;
  }

  @Selector()
  static verticalWindowsConfigLoaded(state: AvailableConfigDataStateModel) {
    return state.verticalWindowConfigLoaded;
  }

  @Selector()
  static verticalWindowsExclusions(state: AvailableConfigDataStateModel) {
    return state.verticalWindowsExclusions;
  }

  @Selector()
  static verticalWindowsExclusionsLoaded(state: AvailableConfigDataStateModel) {
    return state.verticalWindowExclusionsLoaded;
  }

  @Selector()
  static glazingOptions(state: AvailableConfigDataStateModel) {
    return state.glazingOptions;
  }

  @Selector()
  static glazingOptionsLoaded(state: AvailableConfigDataStateModel) {
    return state.glazingOptionsLoaded;
  }

  @Action(GetRoofWindowsAvailableConfigData)
  getRoofWindowsConfigData(ctx: StateContext<AvailableConfigDataStateModel>) {
    return this.configData.fetchAllWindowsData().pipe(
      tap(result => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          configRoofWindows: result,
          roofWindowConfigLoaded: true
        });
      }));
  }

  @Action(GetExclusionsForRoofWindows)
  getExclusionsRoofWindows(ctx: StateContext<AvailableConfigDataStateModel>) {
    return this.configData.fetchAllWindowExclusions().pipe(
      tap((result: any[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          roofWindowsExclusions: result
        });
      }));
  }

  @Action(GetFlashingsAvailableConfigData)
  getFlashingsConfigData(ctx: StateContext<AvailableConfigDataStateModel>) {
    return this.configData.fetchAllFlashingsData().pipe(
      tap(result => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          configFlashings: result
        });
      }));
  }

  @Action(GetExclusionsForFlashings)
  getExclusionsFlashings(ctx: StateContext<AvailableConfigDataStateModel>) {
    return this.configData.fetchAllFlashingExclusions().pipe(
      tap((result: any[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          flashingsExclusions: result
        });
      }));
  }

  @Action(GetAvailableGlazingsData)
  getGlazingOptions(ctx: StateContext<AvailableConfigDataStateModel>) {
    return this.configData.fetchAllGlazingConfigurations().pipe(
      tap((result: GlazingType[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          glazingOptions: result
        });
      }));
  }
}

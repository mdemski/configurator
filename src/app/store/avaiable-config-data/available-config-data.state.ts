import {Action, Selector, State, StateContext} from '@ngxs/store';
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
  configFlashings: {};
  configAccessories: {};
  configFlatRoofWindows: {};
  configVerticalWindows: {};
  roofWindowsExclusions: {};
  flashingsExclusions: {};
  accessoriesExclusions: {};
  flatRoofWindowsExclusions: {};
  verticalWindowsExclusions: {};
  glazingOptions: GlazingType[];
}

@State<AvailableConfigDataStateModel>({
  name: 'availableConfigData',
  defaults: {
    configRoofWindows: null,
    configFlashings: null,
    configAccessories: null,
    configFlatRoofWindows: null,
    configVerticalWindows: null,
    roofWindowsExclusions: null,
    flashingsExclusions: null,
    accessoriesExclusions: null,
    flatRoofWindowsExclusions: null,
    verticalWindowsExclusions: null,
    glazingOptions: []
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
  static roofWindowsExclusions(state: AvailableConfigDataStateModel) {
    return state.roofWindowsExclusions;
  }

  @Selector()
  static configFlashings(state: AvailableConfigDataStateModel) {
    return state.configFlashings;
  }

  @Selector()
  static flashingsExclusions(state: AvailableConfigDataStateModel) {
    return state.flashingsExclusions;
  }

  @Selector()
  static configAccessories(state: AvailableConfigDataStateModel) {
    return state.configAccessories;
  }

  @Selector()
  static accessoriesExclusions(state: AvailableConfigDataStateModel) {
    return state.accessoriesExclusions;
  }

  @Selector()
  static configFlatRoofWindows(state: AvailableConfigDataStateModel) {
    return state.configFlatRoofWindows;
  }

  @Selector()
  static flatRoofWindowsExclusions(state: AvailableConfigDataStateModel) {
    return state.flatRoofWindowsExclusions;
  }

  @Selector()
  static configVerticalWindows(state: AvailableConfigDataStateModel) {
    return state.configVerticalWindows;
  }

  @Selector()
  static verticalWindowsExclusions(state: AvailableConfigDataStateModel) {
    return state.verticalWindowsExclusions;
  }

  @Selector()
  static glazingOptions(state: AvailableConfigDataStateModel) {
    return state.glazingOptions;
  }

  @Action(GetRoofWindowsAvailableConfigData)
  getRoofWindowsConfigData(ctx: StateContext<AvailableConfigDataStateModel>) {
    return this.configData.fetchAllWindowsData().pipe(
      tap(result => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          configRoofWindows: result
        });
      }));
  }

  @Action(GetExclusionsForRoofWindows)
  getExclusionsRoofWindows(ctx: StateContext<AvailableConfigDataStateModel>) {
    return this.configData.fetchAllWindowExclusions().pipe(
      tap(result => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          configRoofWindows: result
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
      tap(result => {
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

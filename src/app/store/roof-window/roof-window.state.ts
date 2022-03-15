import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetRoofWindows, SetChosenRoofWindow} from './roof-window.actions';
import {tap} from 'rxjs/operators';

export interface RoofWindowStateModel {
  roofWindows: RoofWindowSkylight[];
  roofWindowsLoaded: boolean;
  chosenRoofWindow: RoofWindowSkylight;
}

@State<RoofWindowStateModel>({
  name: 'roofWindow',
  defaults: {
    roofWindows: [],
    roofWindowsLoaded: false,
    chosenRoofWindow: null
  }
})
export class RoofWindowState {
  constructor(private db: DatabaseService) {
  }

  @Selector([RoofWindowState])
  static roofWindows(state: RoofWindowStateModel) {
    return state.roofWindows;
  }

  @Selector()
  static chosenRoofWindow(state: RoofWindowStateModel) {
    return state.chosenRoofWindow;
  }

  @Selector([RoofWindowState])
  static roofWindowByCode(state: RoofWindowStateModel) {
    return (code: string) => {
      return state.roofWindows.find(window => window.kod === code);
    };
  }

  @Action(GetRoofWindows)
  getRoofWindows(ctx: StateContext<RoofWindowStateModel>) {
    return this.db.fetchRoofWindows().pipe(
      tap((result: RoofWindowSkylight[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          roofWindows: result,
          roofWindowsLoaded: true
        });
      }));
  }

  @Action(SetChosenRoofWindow)
  setChosenRoofWindow(ctx: StateContext<RoofWindowStateModel>, {roofWindow}: SetChosenRoofWindow) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      chosenRoofWindow: roofWindow
    });
  }
}

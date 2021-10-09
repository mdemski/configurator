import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetRoofWindows} from './roof-window.actions';
import {tap} from 'rxjs/operators';

export interface RoofWindowStateModel {
  roofWindows: RoofWindowSkylight[];
  roofWindowsLoaded: boolean;
}

@State<RoofWindowStateModel>({
  name: 'roofWindow',
  defaults: {
    roofWindows: [],
    roofWindowsLoaded: false
  }
})
export class RoofWindowState {
  constructor(private db: DatabaseService) {
  }

  @Selector([RoofWindowState])
  static roofWindows(state: RoofWindowStateModel) {
    return state.roofWindows;
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
}

import {FlatRoofWindow} from '../../models/flat-roof-window';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetFlatRoofWindows} from './flat-roof-window.actions';
import {tap} from 'rxjs/operators';

export interface FlatRoofWindowStateModel {
  flats: FlatRoofWindow[];
}

@State<FlatRoofWindowStateModel>({
  name: 'flat',
  defaults: {
    flats: []
  }
})
export class FlatRoofWindowState {
  constructor(private db: DatabaseService) {
  }

  @Selector()
  static flats(state: FlatRoofWindowStateModel) {
    return state.flats;
  }

  @Action(GetFlatRoofWindows)
  getFlatRoofWindows(ctx: StateContext<FlatRoofWindowStateModel>) {
    return this.db.fetchFlatRoofWindows().pipe(
      tap((result: FlatRoofWindow[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          flats: result
        });
      }));
  }
}

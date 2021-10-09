import {FlatRoofWindow} from '../../models/flat-roof-window';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetFlatRoofWindows} from './flat-roof-window.actions';
import {tap} from 'rxjs/operators';

export interface FlatRoofWindowStateModel {
  flats: FlatRoofWindow[];
  flatsLoaded: boolean;
}

@State<FlatRoofWindowStateModel>({
  name: 'flat',
  defaults: {
    flats: [],
    flatsLoaded: false
  }
})
export class FlatRoofWindowState {
  constructor(private db: DatabaseService) {
  }

  @Selector()
  static flats(state: FlatRoofWindowStateModel) {
    return state.flats;
  }

  @Selector()
  static flatByCode(state: FlatRoofWindowStateModel) {
    return (flatCode: string) => {
      return state.flats.find(flat => flat.kod === flatCode);
    };
  }

  @Action(GetFlatRoofWindows)
  getFlatRoofWindows(ctx: StateContext<FlatRoofWindowStateModel>) {
    return this.db.fetchFlatRoofWindows().pipe(
      tap((result: FlatRoofWindow[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          flats: result,
          flatsLoaded: true
        });
      }));
  }
}

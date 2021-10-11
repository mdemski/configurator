import {FlatRoofWindow} from '../../models/flat-roof-window';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetFlatRoofWindows, SetChosenFlatRoofWindow} from './flat-roof-window.actions';
import {tap} from 'rxjs/operators';

export interface FlatRoofWindowStateModel {
  flats: FlatRoofWindow[];
  flatsLoaded: boolean;
  chosenFlatRoofWindow: FlatRoofWindow;
}

@State<FlatRoofWindowStateModel>({
  name: 'flat',
  defaults: {
    flats: [],
    flatsLoaded: false,
    chosenFlatRoofWindow: null
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
  static flat(state: FlatRoofWindowStateModel) {
    return state.chosenFlatRoofWindow;
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

  @Action(SetChosenFlatRoofWindow)
  setFlatRoofWindow(ctx: StateContext<FlatRoofWindowStateModel>, {flatRoof}: SetChosenFlatRoofWindow) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      chosenFlatRoofWindow: flatRoof
    });
  }
}

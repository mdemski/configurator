import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetSkylights, SetChosenSkylight} from './skylight.actions';
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

export interface SkylightStateModel {
  skylights: RoofWindowSkylight[];
  skylightsLoaded: boolean;
  chosenSkylight: RoofWindowSkylight;
}

@State<SkylightStateModel>({
  name: 'skylight',
  defaults: {
    skylights: [],
    skylightsLoaded: false,
    chosenSkylight: null
  }
})
@Injectable()
export class SkylightState {
  constructor(private db: DatabaseService) {
  }

  @Selector()
  static skylights(state: SkylightStateModel) {
    return state.skylights;
  }

  @Selector()
  static chosenSkylight(state: SkylightStateModel) {
    return state.chosenSkylight;
  }

  @Selector()
  static skylightByCode(state: SkylightStateModel) {
    return (skylightCode: string) => {
      return state.skylights.find(skylight => skylight.kod === skylightCode);
    };
  }

  @Action(GetSkylights)
  getSkylights(ctx: StateContext<SkylightStateModel>) {
    return this.db.fetchSkylights().pipe(
      tap((result: RoofWindowSkylight[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          skylights: result,
          skylightsLoaded: true
        });
      }));
  }

  @Action(SetChosenSkylight)
  setChosenSkylight(ctx: StateContext<SkylightStateModel>, {skylight}: SetChosenSkylight) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      chosenSkylight: skylight
    });
  }
}

import {RoofWindowSkylight} from '../../models/roof-window-skylight';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetSkylights} from './skylight.actions';
import {tap} from 'rxjs/operators';

export interface SkylightStateModel {
  skylights: RoofWindowSkylight[];
}

@State<SkylightStateModel>({
  name: 'skylight',
  defaults: {
    skylights: []
  }
})
export class SkylightsState {
  constructor(private db: DatabaseService) {
  }

  @Selector()
  static skylights(state: SkylightStateModel) {
    return state.skylights;
  }

  @Action(GetSkylights)
  getSkylights(ctx: StateContext<SkylightStateModel>) {
    return this.db.fetchSkylights().pipe(
      tap((result: RoofWindowSkylight[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          skylights: result
        });
      }));
  }
}

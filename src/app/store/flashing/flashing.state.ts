import {Flashing} from '../../models/flashing';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {tap} from 'rxjs/operators';
import {GetFlashings} from './flashing.actions';

export interface FlashingStateModel {
  flashings: Flashing[];
}

@State<FlashingStateModel>({
  name: 'flashing',
  defaults: {
    flashings: []
  }
})
export class FlashingState {
  constructor(private db: DatabaseService) {
  }

  @Selector()
  static flashings(state: FlashingStateModel) {
    return state.flashings;
  }

  @Action(GetFlashings)
  getFlashings(ctx: StateContext<FlashingStateModel>) {
    return this.db.fetchFlashings().pipe(
      tap((result: Flashing[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          flashings: result
        });
      }));
  }
}

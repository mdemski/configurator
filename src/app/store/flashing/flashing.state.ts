import {Flashing} from '../../models/flashing';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {tap} from 'rxjs/operators';
import {GetFlashings, SetChosenFlashing} from './flashing.actions';

export interface FlashingStateModel {
  flashings: Flashing[];
  flashingsLoaded: boolean;
  chosenFlashing: Flashing;
}

@State<FlashingStateModel>({
  name: 'flashing',
  defaults: {
    flashings: [],
    flashingsLoaded: false,
    chosenFlashing: null
  }
})
export class FlashingState {
  constructor(private db: DatabaseService) {
  }

  @Selector()
  static flashings(state: FlashingStateModel) {
    return state.flashings;
  }

  @Selector()
  static chosenFlashing(state: FlashingStateModel) {
    return state.chosenFlashing;
  }

  @Selector()
  static flashingByCode(state: FlashingStateModel) {
    return (flashingCode: string) => {
      return state.flashings.find(flashing => flashing.kod === flashingCode);
    };
  }

  @Action(GetFlashings)
  getFlashings(ctx: StateContext<FlashingStateModel>) {
    return this.db.fetchFlashings().pipe(
      tap((result: Flashing[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          flashings: result,
          flashingsLoaded: true
        });
      }));
  }

  @Action(SetChosenFlashing)
  setChosenFlashing(ctx: StateContext<FlashingStateModel>, {flashing}: SetChosenFlashing) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      chosenFlashing: flashing
    });
  }
}

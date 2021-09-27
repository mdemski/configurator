import {Accessory} from '../../models/accessory';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetAccessories} from './accessory.actions';
import {tap} from 'rxjs/operators';

export interface AccessoryStateModel {
  accessories: Accessory[];
}

@State<AccessoryStateModel>({
  name: 'accessory',
  defaults: {
    accessories: []
  }
})
export class AccessoryState {
  constructor(private db: DatabaseService) {
  }

  @Selector()
  static accessories(state: AccessoryStateModel) {
    return state.accessories;
  }

  @Action(GetAccessories)
  getAccessories(ctx: StateContext<AccessoryStateModel>) {
    return this.db.fetchAccessories().pipe(
      tap((result: Accessory[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          accessories: result
        });
      }));
  }
}

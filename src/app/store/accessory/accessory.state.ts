import {Accessory} from '../../models/accessory';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DatabaseService} from '../../services/database.service';
import {GetAccessories, SetChosenAccessory} from './accessory.actions';
import {tap} from 'rxjs/operators';

export interface AccessoryStateModel {
  accessories: Accessory[];
  accessoriesLoaded: boolean;
  chosenAccessory: Accessory;
}

@State<AccessoryStateModel>({
  name: 'accessory',
  defaults: {
    accessories: [],
    accessoriesLoaded: false,
    chosenAccessory: null
  }
})
export class AccessoryState {
  constructor(private db: DatabaseService) {
  }

  @Selector()
  static accessories(state: AccessoryStateModel) {
    return state.accessories;
  }

  @Selector()
  static chosenAccessory(state: AccessoryStateModel) {
    return state.chosenAccessory;
  }

  @Selector()
  static accessoryByCode(state: AccessoryStateModel) {
    return (accessoryCode: string) => {
      return state.accessories.find(accessory => accessory.kod === accessoryCode);
    };
  }

  @Action(GetAccessories)
  getAccessories(ctx: StateContext<AccessoryStateModel>) {
    return this.db.fetchAccessories().pipe(
      tap((result: Accessory[]) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          accessories: result,
          accessoriesLoaded: true
        });
      }));
  }

  @Action(SetChosenAccessory)
  setChosenAccessory(ctx: StateContext<AccessoryStateModel>, {accessory}: SetChosenAccessory) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      chosenAccessory: accessory
    });
  }
}

import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SetCurrentUser, UpdateCurrentUser} from './app.actions';
import {AuthService} from '../../services/auth.service';
import {tap} from 'rxjs/operators';

export interface AppStateModel {
  currentUser: string;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    currentUser: ''
  }
})
export class AppState {

  constructor(private authService: AuthService) {
  }

  @Selector([AppState])
  static currentUser(state: AppStateModel) {
    return state.currentUser;
  }

  @Action(SetCurrentUser)
  setCurrentUser(ctx: StateContext<AppStateModel>) {
    return this.authService.returnUser().pipe(
      tap((result) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          currentUser: result
        });
      })
    );
  }

  @Action(UpdateCurrentUser)
  updateCurrentUser(ctx: StateContext<AppStateModel>) {
    return this.authService.returnUser().pipe(
      tap((result) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          currentUser: result
        });
      })
    );
  }
}

import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SetCurrentUser} from './app.actions';
import {AuthService} from '../../services/auth.service';
import {tap} from 'rxjs/operators';

export interface AppStateModel {
  currentUser: {
    user: string,
    loggedIn: boolean
  };
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    currentUser: {
      user: '',
      loggedIn: false
    }
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
          currentUser: {
            user: result.currentUser,
            loggedIn: result.loggedIn
          }
        });
      })
    );
  }
}

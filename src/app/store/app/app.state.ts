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
  setCurrentUser({getState, setState}: StateContext<AppStateModel>) {
    return this.authService.returnUser().pipe(
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          currentUser: result
        });
      })
    );
  }

  @Action(UpdateCurrentUser)
  updateCurrentUser({getState, setState}: StateContext<AppStateModel>) {
    return this.authService.returnUser().pipe(
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          currentUser: result
        });
      })
    );
  }
}

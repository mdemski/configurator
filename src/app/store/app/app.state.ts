import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SetCurrentUser} from './app.actions';
import {AuthService} from '../../services/auth.service';
import {tap} from 'rxjs/operators';

export interface AppStateModel {
  currentUser: {
    email: string;
    userName: string;
    isLogged: boolean;
  };
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    currentUser: {
      email: '',
      userName: '',
      isLogged: false
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
      tap((result: {email: string, userName: string, isLogged: boolean}) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          currentUser: {
            email: result.email,
            userName: result.userName,
            isLogged: result.isLogged
          }
        });
      })
    );
  }
}

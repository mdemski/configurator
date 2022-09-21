import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SetCurrentUser, SetPreferredLanguage} from './app.actions';
import {AuthService} from '../../services/auth.service';
import {tap} from 'rxjs/operators';
import {CrudService} from '../../services/crud-service';
import {Injectable} from '@angular/core';
import {MdTranslateService} from '../../services/md-translate.service';

export interface AppStateModel {
  currentUser: {
    email: string;
    userName: string;
    isLogged: boolean;
  };
  preferredLanguage: string;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    currentUser: {
      email: '',
      userName: '',
      isLogged: false
    },
    preferredLanguage: ''
  }
})
@Injectable()
export class AppState {

  constructor(private authService: AuthService,
              private crud: CrudService,
              private translate: MdTranslateService) {
  }

  @Selector([AppState])
  static currentUser(state: AppStateModel) {
    return state.currentUser;
  }

  @Action(SetCurrentUser)
  setCurrentUser(ctx: StateContext<AppStateModel>) {
    return this.authService.returnUser().pipe(
      tap((result: { email: string, userName: string, isLogged: boolean }) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          currentUser: {
            email: result.email,
            userName: result.userName,
            isLogged: result.isLogged
          }
        });
      }));
  }

  @Action(SetPreferredLanguage)
  setPreferredLanguage(ctx: StateContext<AppStateModel>, {email}: SetPreferredLanguage) {
    if (email === '' || email === undefined) {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        preferredLanguage: this.translate.getBrowserLang()
      });
    } else {
      return this.crud.readUserByEmail(email).pipe(
        tap(result => {
          const state = ctx.getState();
          ctx.setState({
            ...state,
            preferredLanguage: result.preferredLanguage
          });
        }));
    }
  }
}

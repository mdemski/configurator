export class SetCurrentUser {
  static readonly type = '[App] Set Current User';
  constructor(public payload: string) {}
}

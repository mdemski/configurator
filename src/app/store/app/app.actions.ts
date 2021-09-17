export class SetCurrentUser {
  static readonly type = '[App] Set Current User';
  constructor(public payload: string) {}
}

export class UpdateCurrentUser {
  static readonly type = '[App] Update Current User';
  constructor(public payload: string) {}
}

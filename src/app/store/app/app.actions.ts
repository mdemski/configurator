export class SetCurrentUser {
  static readonly type = '[App] Set Current User';
}

export class SetPreferredLanguage {
  static readonly type = '[App] Set Preferred Language For User';

  constructor(public email: string) {
  }
}

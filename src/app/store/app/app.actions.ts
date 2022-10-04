export class SetCurrentUser {
  static readonly type = '[App] Set Current User';
}

export class SetPreferredLanguage {
  static readonly type = '[App] Set Preferred Language For User';

  constructor(public email: string) {
  }
}

export class SetMostRecentProducts {
  static readonly type = '[App] Set Most Recent Products';
}

export class SetAvailableSellers {
  static readonly type = '[App] Set Available Sellers';
}

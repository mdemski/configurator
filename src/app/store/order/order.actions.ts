import {Cart} from '../../models/cart';
import {User} from '../../models/user';
import {Company} from '../../models/company';

export class MakeOrder {
  static type = '[Order] Make An Order From Cart';

  constructor(public readonly cart: Cart, public readonly user: User, public readonly company: Company) {
  }
}

export class ChangeOrderStatus {
  static type = '[Order] Change Status For Order';

  constructor(public readonly status: string) {
  }
}

export class ChangeOrderComment {
  static type = '[Order] Change Comment For Order';

  constructor(public readonly comment: string) {
  }
}

export class SetUser {
  static type = '[Order] Set User For Order';

  constructor(public readonly user: User) {
  }
}

export class SetUserAndCompany {
  static type = '[Order] Set User And Company For Order';

  constructor(public readonly user: User, public readonly company: Company) {
  }
}

import {User} from '../../models/user';
import {Address} from '../../models/address';
import {Company} from '../../models/company';

export class GetUserData {
  static type = '[User] Get User Data';

  constructor(public readonly email: string) {
  }
}

export class UpdateUserData {
  static type = '[User] Update User Data';

  constructor(public user: User) {
  }
}

export class UpdateDiscountForUser {
  static type = '[User] Update User Discount';

  constructor(public readonly user: User, public discount: number, public code: string) {
  }
}

export class SetUserMainAddress {
  static type = '[User] Set Main Address For User';

  constructor(public user: User, public address: Address) {
  }
}

export class SetUserToSendAddress {
  static type = '[User] Set To Send Address For User';

  constructor(public user: User, public address: Address) {
  }
}

export class SetUserMainAndToSendSameAddress {
  static type = '[User] Set Same Addresses Main And To Send For User';

  constructor(public user: User, public address: Address) {
  }
}

export class UpdateUserMainAddress {
  static type = '[User] Update Main Address For User';

  constructor(public user: User, public address: Address) {
  }
}

export class UpdateUserToSendAddress {
  static type = '[User] Update To Send Address For User';

  constructor(public user: User, public address: Address) {
  }
}

export class SetCompanyUserForUser {
  static type = '[User] Set Company For User';

  constructor(public readonly user: User, public company: Company) {
  }
}

export class DeleteUser {
  static type = '[User] Delete User From Database';

  constructor(public user: User) {
  }
}

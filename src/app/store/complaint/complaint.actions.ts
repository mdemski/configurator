import {Complaint} from '../../models/complaint';

export class GetComplaintsForUser {
  static type = '[Complaint] Get All Complaint For User';

  constructor(public readonly email: string) {
  }
}

export class AddComplaint {
  static type = '[Complaint] Add New Complaint';

  constructor(public readonly email: string, public complaint: Complaint) {
  }
}

export class UpdateComplaint {
  static type = '[Complaint] Update Complaint';

  constructor(public complaint: Complaint) {
  }
}

export class DeleteComplaint {
  static type = '[Complaint] Delete Complaint';

  constructor(public complaint: Complaint) {
  }
}

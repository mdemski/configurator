import {Complaint} from '../../models/complaint';
import {ComplaintItem} from '../../models/complaintItem';

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

export class DeleteComplaintItem {
  static type = '[Complaint] Delete Complaint Item';

  constructor(public complaint: Complaint, public complaintItem: ComplaintItem) {
  }
}

import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AddComplaint, DeleteComplaint, DeleteComplaintItem, GetComplaintsForUser, UpdateComplaint} from './complaint.actions';
import {ComplaintService} from '../../services/complaint.service';
import {tap} from 'rxjs/operators';
import {Complaint} from '../../models/complaint';
import {insertItem, patch, removeItem, updateItem} from '@ngxs/store/operators';

export interface ComplaintStateModel {
  complaints: Complaint[];
}

@State({
  name: 'complaint',
  defaults: []
})
export class ComplaintState {

  constructor(private complaintService: ComplaintService) {
  }

  @Selector()
  complaint(state: ComplaintStateModel) {
    return state;
  }

  @Action(GetComplaintsForUser)
  getComplaintsForUser(ctx: StateContext<ComplaintStateModel>, {email}: GetComplaintsForUser) {
    return this.complaintService.getComplaintsByEmail(email).pipe(tap((result: Complaint[]) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        complaints: result
      });
    }));
  }

  @Action(AddComplaint)
  addComplaint(ctx: StateContext<ComplaintStateModel>, {email, complaint}: AddComplaint) {
    return this.complaintService.createComplaint(complaint, email).pipe(tap((result: Complaint) => {
      ctx.setState(
        patch({
          complaints: insertItem(result)
        }));
    }));
  }

  @Action(UpdateComplaint)
  updateComplaint(ctx: StateContext<ComplaintStateModel>, {complaint}: UpdateComplaint) {
    return this.complaintService.updateComplaint(complaint).pipe(tap((result: Complaint) => {
      ctx.setState(
        patch({
          complaints: updateItem(updatedComplaint => !!updatedComplaint && updatedComplaint.erpNumber === result.erpNumber, result)
        }));
    }));
  }

  @Action(DeleteComplaint)
  deleteComplaint(ctx: StateContext<ComplaintStateModel>, {complaint}: DeleteComplaint) {
    return this.complaintService.deleteComplaint(complaint).pipe(tap(() => {
      ctx.setState(
        patch({
          // @ts-ignore
          complaints: removeItem(removedComplaint => !!removedComplaint && removedComplaint.erpNumber === complaint.erpNumber)
        }));
    }));
  }

  @Action(DeleteComplaintItem)
  deleteComplaintItem(ctx: StateContext<ComplaintStateModel>, {complaint, complaintItem}: DeleteComplaintItem) {
    return this.complaintService.deleteComplaintItem(complaint, complaintItem).pipe(tap((result: Complaint) => {
      ctx.setState(
        patch({
          complaints: updateItem(updatedComplaint => !!updatedComplaint && updatedComplaint.erpNumber === result.erpNumber, result)
        }));
    }));
  }
}

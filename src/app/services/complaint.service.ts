import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Complaint} from '../models/complaint';
import {ComplaintItem} from '../models/complaintItem';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  baseUrlComplaint = '';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
  }

  getComplaintTypesFromERP() {
    const url = `${this.baseUrlComplaint}/types`;
    return this.http.get(url).pipe(catchError(err => err));
  }

  getElementFromERP() {
    const url = `${this.baseUrlComplaint}/elements`;
    return this.http.get(url).pipe(catchError(err => err));
  }

  getLocalizationsFromERP() {
    const url = `${this.baseUrlComplaint}/localizations`;
    return this.http.get(url).pipe(catchError(err => err));
  }

  getComplaints() {
    const url = `${this.baseUrlComplaint}/`;
    return this.http.get(url).pipe(catchError(err => err)) as Observable<Complaint[]>;
  }

  getComplaintsByEmail(email: string): Observable<Complaint[]> {
    const url = `${this.baseUrlComplaint}/${email}`;
    return this.http.get(url).pipe(catchError(err => err)) as Observable<Complaint[]>;
  }

  addComplaint(complaint: Complaint, email: string) {
    const url = `${this.baseUrlComplaint}/add/${email}`;
    return this.http.post(url, complaint).pipe(catchError(err => err));
  }

  updateComplaint(complaint: Complaint) {
    const url = `${this.baseUrlComplaint}/update`;
    return this.http.put(url, complaint).pipe(catchError(err => err));
  }

  deleteComplaint(complaint: Complaint) {
    const url = `${this.baseUrlComplaint}/delete`;
    return this.http.put(url, complaint).pipe(catchError(err => err));
  }

  // COMPLAINT ITEMS METHODS
  createComplaintItem(complaintItem: ComplaintItem) {
    const id = '' + Math.random().toString(36).substr(2, 9);
    return new ComplaintItem(id, complaintItem.product, complaintItem.quantity, complaintItem.complaintType,
      complaintItem.element, complaintItem.localization, complaintItem.description, complaintItem.dataPlateNumber, complaintItem.attachment);
  }

  updateComplaintItem(complaint: Complaint, complaintItem: ComplaintItem) {
    let complaintIndex: number;
    complaintIndex = complaint.items.indexOf(complaintItem);
    if (complaintIndex > -1) {
      complaint.items[complaintIndex] = complaintItem;
    } else {
      this.createComplaintItem(complaintItem);
    }
  }

  deleteComplaintItem(complaint: Complaint, complaintItem: ComplaintItem) {
    let complaintIndex: number;
    complaintIndex = complaint.items.indexOf(complaintItem);
    if (complaintIndex > -1) {
      complaint.items.splice(complaintIndex, 1);
    }
    complaintItem = null;
  }

  updateQuantity(complaint: Complaint, complaintItem: ComplaintItem, quantity: number) {
    for (const item of complaint.items) {
      if (item.id === complaintItem.id) {
        item.quantity = quantity;
      }
    }
  }
}

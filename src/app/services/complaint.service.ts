import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Complaint} from '../models/complaint';
import {ComplaintItem} from '../models/complaintItem';
import {Observable, of} from 'rxjs';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Company} from '../models/company';
import {Address} from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  baseUrlComplaint = '';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  windowToTests = new RoofWindowSkylight('1O-ISO-V-E02-KL00-A7022P-078118-OKPO01', 'ISO E02 78x118', 'ISO E02 78x118', 'I-OKNO', 'NPL-OKNO', 'Sprawdzony', 'Okno:ISOV', 'Okno:E02', 'dwuszybowy',
    78, 118, 'OknoDachowe', 'OknoDachowe:Okno', 'Okno:IS1', 'OknoDachowe:ISO', 'Okno:Obrotowe', 'NawiewnikNeoVent', 'DrewnoSosna',
    'Drewno:Bezbarwne', 'OknoDachowe:IS', 'Aluminium', 'Aluminium:RAL7022', 'Aluminium:Półmat', 'Okno:ExtraSecure',
    'Okno:RAL7048', null, 4, [], ['zewnetrznaHartowana'], ['assets/img/products/ISO-I22.png'], [], 997, 1.2, 1.0, 2000, 'Okno:RAL7048', 'Okno:RAL7048', null, 0, 'PL');

  companyToTests = new Company('Felek', 'm.demski@okpol.pl', '11122233344', 0.4, new Address('Lolek', 'Bolek', '123456789', 'Felkowa', '3/1', '10-150', 'Lewin', 'Polzka'),
    'DTHXX', 10000000, 5, 2, [], null);

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
    // TODO włączyć jak będzie dostępne API z eNova
    // const url = `${this.baseUrlComplaint}/${email}`;
    // return this.http.get(url).pipe(catchError(err => err)) as Observable<Complaint[]>;
    const complaintArray: Complaint[] = [new Complaint('13123546/2021', new Date(), 'Przeciek w czapce ISO', 'Otwarta', '1323154-1315',
      'test@test.pl', new Date(), 'UlaZak', [new ComplaintItem('1234sfg54', this.windowToTests, 2, 'PRZECIEK', 'CZAPKA', 'GÓRA', 'OKNO PRZECIEKA W PRAWYM GÓRNYM ROGU', '31351321 BO 123', [])], this.companyToTests, 'Jan Kowalski', null, new Date(), new Date(), new Date(), new Date()),
      new Complaint('13123546/2021', new Date(), 'Przeciek w czapce ISO', 'Otwarta', '1323154-1315',
        'test@test.pl', new Date(), 'UlaZak', [new ComplaintItem('1234sfgzzz', this.windowToTests, 2, 'PRZECIEK', 'KORYTKO', 'BOK', 'OKNO PRZECIEKA PD BOKU', '31351321 BO 123', [])], this.companyToTests, 'Jan Kowalski', null, new Date(), new Date(), new Date(), new Date())
    ];
    return of(complaintArray);
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

  getComplaintItemByID(id: string): Observable<ComplaintItem> {
    return this.getComplaintsByEmail('test@test.pl').pipe(switchMap(complaints => {
      let complaintItem: ComplaintItem;
      complaints.forEach(complaint => {
        complaint.items.forEach(item => {
          if (item.id === id) {
            complaintItem = item;
          }
        });
      });
      return of(complaintItem);
    }));
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

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Complaint} from '../models/complaint';
import {ComplaintItem} from '../models/complaintItem';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {RoofWindowSkylight} from '../models/roof-window-skylight';
import {Company} from '../models/company';
import {Address} from '../models/address';
import {environment} from '../../environments/environment';
import initializeApp = firebase.initializeApp;
import {getStorage, ref, uploadBytes, listAll, deleteObject, getDownloadURL} from 'firebase/storage';
import firebase from 'firebase/compat';

class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  updatedSuccessfully$ = new BehaviorSubject(false);
  selectedFile: ImageSnippet;
  firebaseApp = initializeApp(environment.firebaseConfig);
  storage = getStorage(this.firebaseApp);
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

  getComplaintByID(complaintID: string) {
    // TODO włączyć jak będzie dostępne API z eNova
    // const url = `${this.baseUrlComplaint}/:` + complaintID;
    // return this.http.get(url).pipe(catchError(err => err)) as Observable<Complaint[]>;
    return this.getComplaintsByEmail('test@test.pl').pipe(map(complaints => {
      return complaints.find(complaint => complaint.erpNumber === complaintID);
    }));
  }

  getComplaintsByEmail(email: string): Observable<Complaint[]> {
    // TODO włączyć jak będzie dostępne API z eNova
    // const url = `${this.baseUrlComplaint}/${email}`;
    // return this.http.get(url).pipe(catchError(err => err)) as Observable<Complaint[]>;
    const complaintArray: Complaint[] = [new Complaint('13123546/2021', new Date(), 'Przeciek w czapce ISO', 'Otwarta', '1323154-1315',
      'test@test.pl', new Date(), 'UlaZak',
      [new ComplaintItem('1234sfg54', this.windowToTests, this.windowToTests.productName, 2, 'PRZECIEK', 'CZAPKA', 'GÓRA', 'OKNO PRZECIEKA W PRAWYM GÓRNYM ROGU', '31351321 BO 123', []),
        new ComplaintItem('1234sfg23', this.windowToTests, this.windowToTests.productName, 1, 'KRZYWA RAMA', 'RAMA', 'BOK', 'OKNO JEST KRZYWE', '11231313 BO 999', [])], this.companyToTests, 'Jan Kowalski', null, new Date(), new Date(), new Date(), new Date()),
      new Complaint('13123547/2021', new Date(), 'Przeciek w czapce ISO', 'Otwarta', '1323154-1315',
        'test@test.pl', new Date(), 'UlaZak', [new ComplaintItem('1234sfgzzz', this.windowToTests, this.windowToTests.productName, 2, 'PRZECIEK', 'KORYTKO', 'BOK', 'OKNO PRZECIEKA PD BOKU', '31351321 BO 123', [])], this.companyToTests, 'Jan Kowalski', null, new Date(), new Date(), new Date(), new Date())
    ];
    // TODO poprawić ten fragment z dogrywaniem zdjęć do reklamacji
    for (const complaint of complaintArray) {
      complaint.items.forEach(complaintItem => this.complaintItemPicturesSetter(complaintItem));
    }
    return of(complaintArray);
  }

  createComplaint(complaint: Complaint, email: string) {
    const url = `${this.baseUrlComplaint}/add/${email}`;
    return this.http.post(url, complaint).pipe(catchError(err => err));
  }

  updateComplaint(complaint: Complaint) {
    const url = `${this.baseUrlComplaint}/update` + complaint.erpNumber;
    return this.http.put(url, complaint).pipe(catchError(err => err));
  }

  deleteComplaint(complaint: Complaint) {
    const url = `${this.baseUrlComplaint}/delete`;
    return this.http.put(url, complaint).pipe(catchError(err => err));
  }

  // COMPLAINT ITEMS METHODS
  createComplaintItem(complaintItem: ComplaintItem) {
    const id = '' + Math.random().toString(36).substr(2, 9);
    return new ComplaintItem(id, complaintItem.product, complaintItem.productName, complaintItem.quantity, complaintItem.complaintType,
      complaintItem.element, complaintItem.localization, complaintItem.description, complaintItem.dataPlateNumber, complaintItem.attachment);
  }

  getComplaintByItemID(id: string, email: string): Observable<Complaint> {
    return this.getComplaintsByEmail(email).pipe(switchMap(complaints => {
      let foundComplaint: Complaint;
      complaints.forEach(complaint => {
        complaint.items.forEach(item => {
          if (item.id === id) {
            foundComplaint = complaint;
          }
        });
      });
      return of(foundComplaint);
    }));
  }

  getComplaintItemItemIndexByID(id: string, email: string): Observable<number> {
    return this.getComplaintsByEmail(email).pipe(
      switchMap(complaints => complaints.map(complaint => {
        let searchingElement: ComplaintItem = null;
        complaint.items.find(item => {
          if (item.id === id) {
            searchingElement = item;
          }
        });
        return complaint.items.indexOf(searchingElement);
      })));
  }

  async complaintItemPicturesSetter(complaintItem: ComplaintItem) {
    complaintItem.attachment = [];
    await this.getFiles(complaintItem.id)
      .then(references => references.items.forEach(reference => getDownloadURL(reference)
        .then(url => complaintItem.attachment.push(url))));
  }

  sameID(complaintItem: ComplaintItem, id: string) {
    return complaintItem.id === id;
  }

  updateComplaintItem(complaint: Complaint, complaintItem: ComplaintItem) {
    let complaintIndex: number;
    complaintIndex = complaint.items.indexOf(complaintItem);
    if (complaintIndex > -1) {
      complaint.items[complaintIndex] = complaintItem;
    } else {
      this.createComplaintItem(complaintItem);
    }
    return this.updateComplaint(complaint);
  }

  deleteComplaintItem(complaint: Complaint, complaintItem: ComplaintItem) {
    let complaintIndex: number;
    complaintIndex = complaint.items.indexOf(complaintItem);
    if (complaintIndex > -1) {
      complaint.items.splice(complaintIndex, 1);
    }
    complaintItem = null;
    return this.updateComplaint(complaint);
  }

  updateQuantity(complaint: Complaint, complaintItem: ComplaintItem, quantity: number) {
    for (const item of complaint.items) {
      if (item.id === complaintItem.id) {
        item.quantity = quantity;
      }
    }
  }

  // FILES PROCESSING
  processFile(imageInput: HTMLInputElement, complaintItem: ComplaintItem) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.uploadImage(this.selectedFile.file, complaintItem).then(
        (snapshot) => {
          if (snapshot.metadata.size > 0) {
            this.complaintItemPicturesSetter(complaintItem).then(() => this.updatedSuccessfully$.next(true));
            // complaintItem.attachment.push(snapshot.metadata.fullPath);
          }
        },
        (error) => {
          this.updatedSuccessfully$.next(false);
          return error;
        });
    });

    reader.readAsDataURL(file);
  }

  uploadImage(image: File, complaintItem: ComplaintItem) {
    const refNameFolderString = 'complaint-images/' + complaintItem.id + '/';
    const name = '' + Math.random().toString(36).substr(2, 9);
    const refNameFileString = refNameFolderString + name + '.jpg';
    const newComplaintFolderRef = ref(this.storage, refNameFileString);
    return uploadBytes(newComplaintFolderRef, image);
  }

  getFiles(complaintId: string) {
    const refNameFolderString = 'complaint-images/' + complaintId;
    const folderRef = ref(this.storage, refNameFolderString);
    this.updatedSuccessfully$.next(false);
    return listAll(folderRef);
  }


  updatePhoto(imageUpdate: HTMLInputElement, fileName: string, complaintItem: ComplaintItem) {
    const file: File = imageUpdate.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      const refNameFileString = 'complaint-images/' + complaintItem.id + '/' + fileName + '.jpg';
      const reference = ref(this.storage, refNameFileString);
      uploadBytes(reference, this.selectedFile.file).then(
        (snapshot) => {
          this.complaintItemPicturesSetter(complaintItem).then(() => this.updatedSuccessfully$.next(true));
        },
        (error) => {
          this.updatedSuccessfully$.next(false);
          return error;
        });
    });

    reader.readAsDataURL(file);
  }

  deletePhoto(fileName: string, complaintItem: ComplaintItem) {
    const refNameFileString = 'complaint-images/' + complaintItem.id + '/' + fileName + '.jpg';
    const reference = ref(this.storage, refNameFileString);
    deleteObject(reference).then(() => {
      this.complaintItemPicturesSetter(complaintItem).then(() => this.updatedSuccessfully$.next(true));
      // File deleted successfully
    }).catch((error) => {
      this.updatedSuccessfully$.next(false);
      return error;
    });
  }
}

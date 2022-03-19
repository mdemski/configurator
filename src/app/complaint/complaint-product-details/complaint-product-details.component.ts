import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ComplaintService} from '../../services/complaint.service';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {Complaint} from '../../models/complaint';
import {ComplaintItem} from '../../models/complaintItem';
import { getDownloadURL } from 'firebase/storage';
import {DeleteComplaintItem} from '../../store/complaint/complaint.actions';

@Component({
  selector: 'app-complaint-product-details',
  templateUrl: './complaint-product-details.component.html',
  styleUrls: ['./complaint-product-details.component.scss']
})
export class ComplaintProductDetailsComponent implements OnInit, OnDestroy {

  @Select(AppState) user$: Observable<{ currentUser }>;
  isDestroyed$ = new Subject();
  complaint$: Observable<Complaint>;
  isLoading = true;
  currentUser: { email: string, userName: string, isLogged: boolean };
  itemID: number;
  addPhotoPopup = false;
  photosArray: string[] = [];
  paramsID = '';

  constructor(public complaintService: ComplaintService,
              private route: ActivatedRoute,
              private store: Store) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser);
  }

  ngOnInit(): void {
    this.complaint$ = this.route.paramMap.pipe(
      takeUntil(this.isDestroyed$),
      map(params => this.paramsID = params.get('id')),
      tap(id => this.complaintService.getFiles(id).then((array) => {
        array.items.forEach(element => getDownloadURL(element).then(url => this.photosArray.push(url)));
      })),
      switchMap(id => this.complaintService.getComplaintByItemID(id, this.currentUser.email)));
    this.route.paramMap.pipe(
      takeUntil(this.isDestroyed$),
      tap(data => this.complaintService.getComplaintItemItemIndexByID(data.get('id'), this.currentUser.email).subscribe(foundID => {
        if (foundID > -1) {
          this.itemID = foundID;
        }
      }))).subscribe(() => this.isLoading = false);
    // this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(null);
  }

  addPhotosPopup() {
    this.addPhotoPopup = true;
  }

  closePhotosPopup() {
    this.complaintService.updatedSuccessfully$.next(false);
    this.addPhotoPopup = false;
  }

  processFile(imageInput: HTMLInputElement, complaintItem: ComplaintItem) {
    this.complaintService.processFile(imageInput, complaintItem);
    this.reloadArray();
  }

  deleteComplaintItem(complaint: Complaint, compliantItem: ComplaintItem) {
    this.store.dispatch(new DeleteComplaintItem(complaint, compliantItem));
  }

  updateFile(imageUpdate: HTMLInputElement, photoLink: string, complaintItem: ComplaintItem) {
    const fileName = photoLink.split('%')[2].substr(2).split('.')[0];
    this.complaintService.updatePhoto(imageUpdate, fileName, complaintItem);
    this.reloadArray();
  }

  deletePhoto(photoLink: string, complaintItem: ComplaintItem) {
    const fileName = photoLink.split('%')[2].substr(2).split('.')[0];
    this.complaintService.deletePhoto(fileName, complaintItem);
    const index = this.photosArray.indexOf(fileName, 0);
    if (index > -1) {
      this.photosArray.splice(index, 1);
    }
    this.reloadArray();
  }

  private reloadArray() {
    this.isLoading = true;
    this.photosArray = [];
    this.complaintService.updatedSuccessfully$.pipe(takeUntil(this.isDestroyed$)).subscribe(booleanValue => {
      if (booleanValue) {
        this.complaintService.getFiles(this.paramsID).then(array => {
          array.items.forEach(element => getDownloadURL(element).then(url => this.photosArray.push(url)));
          this.isLoading = false;
        });
      }
    });
  }
}

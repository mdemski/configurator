import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ComplaintService} from '../../services/complaint.service';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/app/app.state';
import {Complaint} from '../../models/complaint';
import {FilesService} from '../../services/files.service';
import {ComplaintItem} from '../../models/complaintItem';
import {getDownloadURL} from 'firebase/storage';
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

  constructor(private complaintService: ComplaintService,
              private route: ActivatedRoute,
              public filesService: FilesService,
              private store: Store) {
    this.user$.pipe(takeUntil(this.isDestroyed$)).subscribe(user => this.currentUser = user.currentUser);
  }

  ngOnInit(): void {
    this.complaint$ = this.route.paramMap.pipe(
      takeUntil(this.isDestroyed$),
      map(params => params.get('id')),
      tap(id => this.filesService.getFiles(id).then((array) => {
        array.items.forEach(element => getDownloadURL(element).then(url => this.photosArray.push(url)));
      })),
      switchMap(id => this.complaintService.getComplaintByItemID(id, this.currentUser.email)));
    this.route.paramMap.pipe(
      takeUntil(this.isDestroyed$),
      tap(data => this.complaintService.getComplaintItemItemIndexByID(data.get('id'), this.currentUser.email).subscribe(foundID => {
        if (foundID > -1) {
          this.itemID = foundID;
        }
      }))).subscribe();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }

  addPhotosPopup() {
    this.addPhotoPopup = true;
  }

  closePhotosPopup() {
    this.filesService.uploadSuccessfully$.next(false);
    this.addPhotoPopup = false;
  }

  processFile(imageInput: HTMLInputElement, complaintItem: ComplaintItem) {
    this.filesService.processFile(imageInput, complaintItem);
  }

  deleteComplaintItem(complaint: Complaint, compliantItem: ComplaintItem) {
    this.store.dispatch(new DeleteComplaintItem(complaint, compliantItem));
  }
}

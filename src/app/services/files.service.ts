import {Injectable} from '@angular/core';
import {ComplaintItem} from '../models/complaintItem';
import {environment} from '../../environments/environment';
import initializeApp = firebase.initializeApp;
import {getStorage, ref, uploadBytes, listAll} from 'firebase/storage';
import firebase from 'firebase/compat';
import {BehaviorSubject} from 'rxjs';

class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  uploadSuccessfully$ = new BehaviorSubject(false);
  selectedFile: ImageSnippet;
  firebaseApp = initializeApp(environment.firebaseConfig);
  storage = getStorage(this.firebaseApp);

  constructor() {
  }

  processFile(imageInput: HTMLInputElement, complaintItem: ComplaintItem) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.uploadImage(this.selectedFile.file, complaintItem).then(
        (snapshot) => {
          if (snapshot.metadata.size > 0) {
            this.uploadSuccessfully$.next(true);
            // complaintItem.attachment.push(snapshot.metadata.fullPath);
          }
        },
        (error) => {
          this.uploadSuccessfully$.next(false);
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
    return listAll(folderRef);
  }
}

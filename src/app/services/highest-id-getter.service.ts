import {Injectable} from '@angular/core';
import {SingleConfiguration} from '../models/single-configuration';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HighestIdGetterService {
  highestId: number;
  configurationGlobalId$ = new BehaviorSubject(1);
  configurationUserId$ = new BehaviorSubject(1);

  constructor(private firestore: AngularFirestore,
              private auth: AuthService) {
    this.highestId = 0;
    this.auth.returnUser().subscribe(user => {
      this.firestore.collection('allConfigurations').valueChanges().pipe().subscribe((allConfigurations: SingleConfiguration[]) => {
        let userIdNumber = 1;
        this.configurationGlobalId$.next(allConfigurations.length + 1);
        allConfigurations.forEach(config => {
          if (config.user === user) {
            userIdNumber++;
          }
        });
        this.configurationUserId$.next(userIdNumber);
      });
    });
  }

  getHighestId(initialId, configurations: any[]) {
    this.highestId = initialId;
    for (const config of configurations) {
      if (config !== null) {
        if (this.highestId < config.id) {
          this.highestId = config.id;
        }
      }
    }
    this.highestId++;
    return this.highestId;
  }

  getHighestIdFormFireStore() {
    let configurationId = 1;
    this.configurationGlobalId$.subscribe(id => configurationId = id);
    this.configurationGlobalId$.next(configurationId + 1);
    return configurationId;
  }

  getHighestIdForUser() {
    let userId = 1;
    this.configurationUserId$.subscribe(id => userId = id);
    this.configurationUserId$.next(userId + 1);
    return userId;
  }
}

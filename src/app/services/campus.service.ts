import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {Floor} from '../models/floor.model';
import {Campus} from '../models/campus.model';
import {Room} from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class CampusService {

  ref = firebase.firestore().collection('campuses');

  constructor() {
  }

  getCampuses(): Observable<Campus[]> {
    return Observable.create(observer => {
      this.ref.onSnapshot(snapshot => {
        observer.next(<Campus[]>snapshot.docs.map(doc => doc.data()));
      });
    });
  }

  getCampus(campusId: string): Observable<Campus> {
    return Observable.create(observer => {
      this.ref.doc(campusId).get().then(doc => {
        observer.next(<Campus>doc.data());
      });
    });
  }
}

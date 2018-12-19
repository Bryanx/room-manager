import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {Floor} from '../models/floor.model';

@Injectable({
  providedIn: 'root'
})
export class FloorService {

  db = firebase.firestore();

  constructor() {
  }

  /**
   * onSnapshot -> keep listening for updates.
   * Because firestore returns a Promise, we need to cast it to an Observable.
   * We keep adding/updating floors on changes from the store to the Observable.
   * @param campusId The campus on which the floor is located
   */
  getFloors(campusId: string): Observable<Floor[]> {

    return Observable.create(observer => {
      this.getFloorCollection(campusId).onSnapshot(snapshot => {
        observer.next(<Floor[]>snapshot.docs.map(doc => doc.data()));
      });
    });
  }

  /**
   * Gets information about a single floor
   * @param campusId The campus on which the floor is located
   * @param floorId the floor number
   */
  getFloor(campusId: string, floorId: string): Observable<Floor> {
    return new Observable((observer) => {
      this.getFloorCollection(campusId).doc(floorId).get().then((doc) => {
        observer.next(<Floor>doc.data());
      });
    });
  }

  /**
   * Gets all the floors for a given campus
   * @param campusId The campus on which the floor is located
   */
  getFloorCollection(campusId: string) {
    return this.db.collection('campuses/' + campusId + '/floors');
  }
}

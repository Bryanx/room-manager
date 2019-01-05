import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {Floor} from '../models/floor.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Campus} from '../models/campus.model';

@Injectable({
  providedIn: 'root'
})
export class FloorService {

  constructor(private afs: AngularFirestore) { }

  getFloors(campusId: string): Observable<Floor[]> {
    return this.getFloorCollection(campusId).valueChanges();
  }

  /**
   * Get a campus' floor by its id and floor number and listen to changes.
   * @param campusId the given campus
   * @param floorId the required floor.
   */
  getFloor(campusId: string, floorId: string): Observable<Floor> {
    return this.getFloorCollection(campusId).doc<Floor>(floorId).valueChanges();

  }

  /**
   * Get a firestore collection of floors.
   * @param campusId The campus on which the floor is located.
   */
  getFloorCollection(campusId: string): AngularFirestoreCollection<Floor> {
    return this.afs.collection(`campuses/${campusId}/floors`);
  }
}

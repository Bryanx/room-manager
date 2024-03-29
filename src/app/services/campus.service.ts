import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Campus} from '../models/campus.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CampusService {

  campusCollection: AngularFirestoreCollection<Campus> = this.afs.collection('campuses');

  constructor(private afs: AngularFirestore) { }

  getCampuses(): Observable<Campus[]> {
    return this.campusCollection.valueChanges();
  }

  /**
   * Get an existing campus and listen to changes.
   * @param campusId The id of the campus.
   */
  getCampus(campusId: string): Observable<Campus> {
    return this.campusCollection.doc<Campus>(campusId).valueChanges();
  }
}

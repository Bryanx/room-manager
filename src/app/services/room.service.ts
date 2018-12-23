import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Room} from '../models/room.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private afs: AngularFirestore) { }

  getRooms(campusId: string, floorId: string): Observable<Room[]> {
    return this.getRoomCollection(campusId, floorId).valueChanges();
  }

  getRoom(campusId: string, floorId: string, roomId: string): Observable<Room> {
    return this.getRoomCollection(campusId, floorId).doc<Room>(roomId).valueChanges();
  }

  updateRoom(campusId: string, floorId: string, roomId: string, room: Room): Observable<any> {
    return fromPromise(this.getRoomCollection(campusId, floorId).doc<Room>(roomId).update(room));
  }

  /**
   * Get a firestore collection of rooms.
   * @param campusId Campus id of the requested rooms.
   * @param floorId Floor id of the requested rooms.
   */
  private getRoomCollection(campusId: string, floorId: string): AngularFirestoreCollection<Room> {
    return this.afs.collection(`campuses/${campusId}/floors/${floorId}/rooms`);
  }
}

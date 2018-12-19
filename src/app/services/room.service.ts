import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import {Floor} from '../models/floor.model';
import {Room} from '../models/room.model';
import {NgForm} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  ref = firebase.firestore().collection('rooms');

  constructor() { }

  /**
   * Get all rooms by floorId.
   * Note: rootcollections are used because deep querying by subcollections isn't supported in firestore yet.
   * {@link https://stackoverflow.com/a/46614683}
   * @param campusId id of the campus
   * @param floorId to lookup
   */
  getRooms(campusId: string, floorId: string): Observable<Room[]> {
    return new Observable(observer => {
      this.getRoomCollection(campusId, floorId).onSnapshot(snapshot => {
        observer.next(<Room[]>snapshot.docs.map(doc => doc.data()));
      });
    });
  }

  getRoom(campusId: string, floorId: string, roomId: string): Observable<Room> {
    return new Observable(observer => {
      this.getRoomCollection(campusId, floorId).doc(roomId).get().then(doc => {
        observer.next(<Room> doc.data());
      });
    });
  }

  postRoom(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }

  updateRoom(campusId: string, floorId: string, roomId: string, room: Room): Observable<Room> {
    return new Observable((observer) => {
      this.getRoomCollection(campusId, floorId).doc(roomId).update(room).then(_ => {
        observer.next();
      });
    });
  }

  deleteRoom(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }

  private getRoomCollection(campusId: string, floorId: string) {
    return firebase.firestore()
      .collection('campuses').doc(campusId)
      .collection('floors').doc(floorId)
      .collection('rooms');
  }
}

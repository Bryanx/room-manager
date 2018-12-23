import {Inject, Injectable} from '@angular/core';
import {SESSION_STORAGE, StorageService} from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
  }

  /**
   * Stores a key value pair in local storage.
   * @param key To lookup the data, can only be string.
   * @param value Value of corresponding key.
   */
  store(key: string, value: any) {
    this.storage.set(key, value);
  }

  /**
   * retrieve a value from the storage by its key.
   * @param key The key of the required value.
   */
  fetch(key: string) {
    return this.storage.get(key) || null;
  }
}

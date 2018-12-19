import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {Campus} from './models/campus.model';
import {CampusService} from './services/campus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // public items: Observable<any[]>;
  //
  // constructor(db: AngularFirestore) {
  //   this.items = db.collection('/campus/rkw2vhU241rEHeGU7U0C/floor/TSl8TdmS7Qp5pzcCfc23/classroom').valueChanges();
  // }


  campuses: Campus[];

  constructor(db: AngularFirestore, private campusService: CampusService) {
  }

  ngOnInit() {
    this.getCampuses();
  }

  private getCampuses() {
    this.campusService.getCampuses().subscribe(data => {
      this.campuses = data;
    });
  }
}

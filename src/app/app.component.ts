import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {Campus} from './models/campus.model';
import {CampusService} from './services/campus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  campuses: Campus[];

  constructor(private campusService: CampusService) {
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

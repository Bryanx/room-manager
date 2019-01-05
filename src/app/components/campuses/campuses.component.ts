import {Component, OnInit} from '@angular/core';
import {Campus} from '../../models/campus.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {CampusService} from '../../services/campus.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-campuses',
  templateUrl: './campuses.component.html',
  styleUrls: ['./campuses.component.scss']
})
export class CampusesComponent implements OnInit {
  displayedColumns = ['name', 'city'];
  campuses: Campus[];

  constructor(private route: ActivatedRoute,
              private campusService: CampusService) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.campusService.getCampuses();
      })).subscribe(data => {
      this.campuses = data;
    });
  }
}

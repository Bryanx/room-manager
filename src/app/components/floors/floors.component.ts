import {Component, OnInit} from '@angular/core';
import {FloorService} from '../../services/floor.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {CampusService} from '../../services/campus.service';
import {Floor} from '../../models/floor.model';
import {Campus} from '../../models/campus.model';
import {switchMap} from 'rxjs/operators';
import {combineLatest, forkJoin} from 'rxjs';

@Component({
  selector: 'app-floors',
  templateUrl: './floors.component.html',
  styleUrls: ['./floors.component.scss']
})
export class FloorsComponent implements OnInit {
  displayedColumns = ['number', 'description'];
  floors: Floor[];
  campus: Campus;
  campusId: string;

  constructor(private route: ActivatedRoute,
              private floorService: FloorService,
              private campusService: CampusService) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.campusId = params.get('campusId');
        return combineLatest(
          this.campusService.getCampus(this.campusId),
          this.floorService.getFloors(this.campusId)
        );
      })).subscribe(data => {
      this.campus = data[0];
      this.floors = data[1];
    });
  }
}

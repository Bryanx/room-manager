import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FloorService} from '../../services/floor.service';
import {RoomService} from '../../services/room.service';
import {Room} from '../../models/room.model';
import {Floor} from '../../models/floor.model';
import {combineLatest} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-floor-detail',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  campusId: string;
  floorId: string;
  floor: Floor;
  rooms: Room[];
  listView: boolean;

  constructor(private route: ActivatedRoute,
              private floorService: FloorService,
              private roomService: RoomService,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.campusId = params.get('campusId');
        this.floorId = params.get('floorId');
        return combineLatest(
          this.floorService.getFloor(this.campusId, this.floorId),
          this.roomService.getRooms(this.campusId, this.floorId)
        );
      })).subscribe((data: [Floor, Room[]]) => {
      this.floor = data[0];
      this.rooms = data[1];
    });
  }

  changeFloor(change: number) {
    this.router.navigate(['/campuses', this.campusId, 'floors', +this.floorId + change]);
  }
}

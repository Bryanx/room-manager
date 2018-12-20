import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FloorService} from '../../services/floor.service';
import {RoomService} from '../../services/room.service';
import {Room} from '../../models/room.model';
import {Floor} from '../../models/floor.model';
import {combineLatest, interval} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

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
              private router: Router,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.campusId = params.get('campusId');
        this.floorId = params.get('floorId');
        return combineLatest(
          this.floorService.getFloor(this.campusId, this.floorId),
          this.roomService.getRooms(this.campusId, this.floorId)
        );
      })).subscribe(data => {
      this.floor = data[0];
      this.rooms = data[1];
      this.setOccupiedTimer(this.rooms);
    });
  }

  private setOccupiedTimer(rooms: Room[]) {
    rooms.filter(r => r.occupied).forEach(room => {
      const timer = interval(1000)
        .pipe(map(_ => {
            const now = new Date().getTime();
            const future = room.reservationStart + (room.reservationDuration * 10000); // 3600000
            return future - now;
          })
        ).subscribe(timeLeft => {
          room.timeLeft = new Date(timeLeft).toUTCString().split(' ')[4];
          if (timeLeft <= 1) {
            timer.unsubscribe();
            room.occupied = false;
            room.timeLeft = '';
            this.updateRoom(room, false);
          }
        });
    });
  }


  updateRoom(room: Room, showSnackbar: boolean = true) {
    this.roomService.updateRoom(this.campusId, this.floorId, room.id, room).subscribe(_ => {
      if (showSnackbar) {
        this.snackBar.open('Room was saved.', 'Dismiss', {
          duration: 3000
        });
      }
    });
  }

  goFloorUp() {
    this.router.navigate(['/campuses', this.campusId, 'floors', +this.floorId + 1]);
  }

  goFloorDown() {
    this.router.navigate(['/campuses', this.campusId, 'floors', +this.floorId - 1]);
  }
}
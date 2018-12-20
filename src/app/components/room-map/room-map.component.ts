import {Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Room} from '../../models/room.model';
import {RoomService} from '../../services/room.service';
import {MatSnackBar} from '@angular/material';
import {interval, Subscription, timer} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-room-map',
  templateUrl: './room-map.component.html',
  styleUrls: ['./room-map.component.scss']
})
export class RoomMapComponent implements OnChanges {
  @Input() room: Room;
  @Input() campusId: string;
  @Input() floorId: string;
  @HostBinding('class.selected') selected: boolean;
  @HostBinding('class.occupied') occupied: boolean;
  timer: Subscription;

  constructor(private roomService: RoomService,
              private eRef: ElementRef,
              public snackBar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room']) {
      this.occupied = this.room.occupied;
    }
    if (this.occupied) {
      this.setTimer();
    }
  }

  /**
   * if someone clicks on this component: selected = true
   * if someone clicks outside this component: selected = false
   */
  @HostListener('document:click', ['$event']) onClick(event) {
    this.selected = this.eRef.nativeElement.contains(event.target);
  }

  getCrowdednessColor(room: Room) {
    const hue = Math.abs(room.crowdedness / room.capacity * 120 - 120);
    return `hsl(${hue}, 100%, 50%)`;
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

  reserveRoom(room: Room, hours: number) {
    room.occupied = true;
    room.reservationStart = new Date().getTime();
    room.reservationDuration = hours;
    this.updateRoom(room); // this will trigger changes, which will start a timer
  }

  setTimer() {
    this.timer = interval(1000)
      .pipe(map(_ => {
          const now = new Date().getTime();
          const future = this.room.reservationStart + (this.room.reservationDuration * 10000); // 3600000
          return future - now;
        })
      ).subscribe(timeLeft => {
        this.room.timeLeft = new Date(timeLeft).toUTCString().split(' ')[4];
        if (timeLeft <= 1) {
          this.timer.unsubscribe();
          this.room.occupied = false;
          this.room.timeLeft = '';
          this.updateRoom(this.room, false);
        }
      });
  }
}

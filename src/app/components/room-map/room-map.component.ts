import {Component, ElementRef, HostBinding, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Room, RoomType} from '../../models/room.model';
import {RoomService} from '../../services/room.service';
import {MatSnackBar} from '@angular/material';
import {interval, Subscription} from 'rxjs';
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
  @Input() clearView: boolean;
  @HostBinding('class.selected') selected: boolean;
  @HostBinding('class.occupied') occupied: boolean;
  timer: Subscription;
  isReservable: boolean;
  hasCrowdedness: boolean;

  constructor(private roomService: RoomService,
              private eRef: ElementRef,
              public snackBar: MatSnackBar) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room']) {
      this.occupied = this.room.occupied;
    }
    if (this.occupied) {
      this.setOccupiedTimer();
    }
    this.isReservable = !this.clearView && ['vergaderzaal', 'aula', 'klaslokaal'].includes(this.room.type.toString());
    this.hasCrowdedness = !this.clearView && ['cafetaria', 'studielandschap'].includes(this.room.type.toString());
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

  updateRoom(room: Room, showSnackbar: boolean = true, message: string = room.name + ' is opgeslagen.') {
    this.roomService.updateRoom(this.campusId, this.floorId, room.id, room).subscribe(_ => {
      if (showSnackbar) {
        this.snackBar.open(message, 'OK', {
          duration: 3000
        });
      }
    });
  }

  reserveRoom(room: Room, hours: number) {
    room.occupied = true;
    room.reservationStart = new Date().getTime();
    room.reservationDuration = hours;
    this.updateRoom(room, true, room.name + ' werd gereserveerd.'); // this will trigger changes, which will start a timer
  }

  setOccupiedTimer() {
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
          this.updateRoom(this.room, true, this.room.name + ' is niet meer bezet.');
        }
      });
  }
}

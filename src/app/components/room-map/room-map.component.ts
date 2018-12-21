import {Component, ElementRef, HostBinding, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';
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
  @Input() clearView: boolean;
  @HostBinding('class.selected') isSelected: boolean;
  @HostBinding('class.isOccupied') isOccupied: boolean;
  occupiedTimer: Subscription = new Subscription();
  selectTimer: Subscription = new Subscription();
  isReservable: boolean;
  hasCrowdedness: boolean;
  occupiedTimeLeft: string;

  constructor(private roomService: RoomService,
              private eRef: ElementRef,
              public snackBar: MatSnackBar) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room']) {
      this.isOccupied = this.room.occupied;
    }
    if (this.isOccupied) {
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
    this.isSelected = this.eRef.nativeElement.contains(event.target);
    if (this.isSelected) {
      this.setSelectionTimer();
    }
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
    const future = this.room.reservationStart + (this.room.reservationDuration * 10000); // 3600000
    this.occupiedTimer = interval(1000)
      .pipe(map(_ => future - new Date().getTime()))
      .subscribe(timeLeft => {
        this.occupiedTimeLeft = new Date(timeLeft).toUTCString().split(' ')[4];
        if (timeLeft <= 1) {
          this.occupiedTimer.unsubscribe();
          this.room.occupied = false;
          this.isOccupied = false;
          this.updateRoom(this.room, true, this.room.name + ' is niet meer bezet.');
        }
      });
  }

  setSelectionTimer() {
    if (!this.selectTimer.closed) {
      this.selectTimer.unsubscribe();
    }
    this.selectTimer = timer(5000).subscribe(_ => this.isSelected = false);
  }
}

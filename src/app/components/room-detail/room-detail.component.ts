import {Component, ElementRef, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Room} from '../../models/room.model';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {switchMap} from 'rxjs/operators';
import initCaps from '../../util/string.util';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {
  initCaps = initCaps;
  room: Room = <Room>{
    name: '',
    type: '',
  };
  form: FormGroup;
  error: boolean;
  campusId: string;
  floorId: String = '0';
  roomId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private roomService: RoomService,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.campusId = params.get('campusId');
        this.floorId = params.get('floorId');
        this.roomId = params.get('roomId');
        return this.roomService.getRoom(this.campusId, this.floorId.toString(), this.roomId);
      })).subscribe(data => this.fillForm(data));
  }

  private fillForm(room: Room) {
    this.room = room;
    this.form = this.formBuilder.group({
      'name': [room.name, Validators.required],
      'type': [room.type, Validators.required],
      'capacity': [room.capacity, Validators.required],
      'crowdedness': room.crowdedness,
      'occupied': room.occupied,
      'beamer': room.beamer,
      'x': room.dimensions.x,
      'y': room.dimensions.y,
      'width': room.dimensions.width,
      'height': room.dimensions.height,
    });
  }

  onFormSubmit(room: Room) {
    this.roomService.updateRoom(this.campusId, this.floorId.toString(), this.roomId, room).subscribe(_ => {
        this.snackBar.open('Settings saved.', 'Back to overview', {
          duration: 3000
        }).onAction().subscribe(data => {
          this.router.navigate(['/campuses', this.campusId, 'floors', this.floorId]);
        });
      });
  }
}

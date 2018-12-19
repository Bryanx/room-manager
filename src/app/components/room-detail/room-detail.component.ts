import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Room} from '../../models/room.model';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {switchMap} from 'rxjs/operators';
import initCaps from '../../util/string.util';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {
  initCaps = initCaps;
  room: Room = <Room> {
    name: '',
    type: '',
  };
  roomForm: FormGroup;
  error: boolean;
  campusId: string;
  floorId: String = '0';
  roomId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private roomService: RoomService,
              private formBuilder: FormBuilder) {
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

  private fillForm(data: Room) {
    this.room = data;
    this.roomForm = this.formBuilder.group({
      'name': [data.name, Validators.required],
      'type': [data.type, Validators.required],
      'capacity': [data.capacity, Validators.required],
      'occupied': data.occupied,
      'beamer': data.beamer,
      'dimensions.x': data.dimensions.x,
      'dimensions.y': data.dimensions.y,
      'dimensions.width': data.dimensions.width,
      'dimensions.height': data.dimensions.height,
    });
  }

  onFormSubmit(room: Room) {
    this.roomService.updateRoom(this.campusId, this.floorId.toString(), this.roomId, room).subscribe(_ => {
      this.router.navigate(['/campuses', this.campusId, 'floors', this.floorId]);
    });
  }

}

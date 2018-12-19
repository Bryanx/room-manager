import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Room} from '../../models/room.model';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {
  room: Room;
  roomForm: FormGroup;
  error: boolean;
  campusId: string;
  floorId: string;
  roomId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private roomService: RoomService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.campusId = this.route.snapshot.params['campusId'];
    this.floorId = this.route.snapshot.params['floorId'];
    this.roomId = this.route.snapshot.params['roomId'];
    this.getRoom();
    this.roomForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'type': [null, Validators.required],
      'capacity': [null, Validators.required],
      'crowdedness': null,
      'occupied': new FormControl(false),
      'beamer': new FormControl(false),
    });
  }

  private getRoom() {
    this.roomService.getRoom(this.campusId, this.floorId, this.roomId)
      .subscribe(data => {
        this.room = data;
        this.roomForm.setValue(data);
      }, error => {
        this.error = true;
      });
  }

  onFormSubmit(room: Room) {
    this.roomService.updateRoom(this.campusId, this.floorId, this.roomId, room).subscribe(_ => {
      this.router.navigate(['/campuses', this.campusId, 'floors', this.floorId]);
    });
  }
}

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {FloorsComponent} from './components/floors/floors.component';
import {RoomDetailComponent} from './components/room-detail/room-detail.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatSliderModule,
  MatTooltipModule, MatMenuModule, MatButtonToggleModule
} from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RoomsComponent} from './components/rooms/rooms.component';
import {SvgIconComponent} from './components/svg-icon/svg-icon.component';

const appRoutes: Routes = [
  {
    path: 'campuses/:campusId',
    component: FloorsComponent,
    data: {title: 'Floors'}
  },
  {
    path: 'campuses/:campusId/floors/:floorId',
    component: RoomsComponent,
    data: {title: 'Floor'}
  },
  {
    path: 'campuses/:campusId/floors/:floorId/rooms/:roomId',
    component: RoomDetailComponent,
    data: {title: 'Room'}
  },
];

@NgModule({
  declarations: [
    AppComponent,
    FloorsComponent,
    RoomsComponent,
    RoomDetailComponent,
    SvgIconComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // Material design:
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSliderModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() displayedColumns: String[] = [];
  @Input() data: Object[];
  @Input() redirectUrl: string;
}
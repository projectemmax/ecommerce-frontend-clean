import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-table-skeleton',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table-skeleton.component.html',
    styleUrls: ['./table-skeleton.component.css']
})
export class TableSkeletonComponent {

    @Input() rows = 5;

    @Input() columns = 5;

}